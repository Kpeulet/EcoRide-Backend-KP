import Ride from "../models/Ride.js";
import User from "../models/User.js";

// -----------------------------------------------------
// RECHERCHER DES TRAJETS
// -----------------------------------------------------
export const searchRides = async (req, res) => {
    try {
        const { startAddress, endAddress } = req.query;

        const rides = await Ride.find({
            startAddress: { $regex: startAddress, $options: "i" },
            endAddress: { $regex: endAddress, $options: "i" },
            status: "scheduled"
        });

        res.status(200).json(rides);

    } catch (error) {
        console.error("Erreur recherche trajets :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// -----------------------------------------------------
// OBTENIR LES DÉTAILS D'UN TRAJET
// -----------------------------------------------------
export const getRideDetails = async (req, res) => {
    try {
        const rideId = req.params.id;

        const ride = await Ride.findById(rideId)
            .populate("driver", "firstname lastname email")
            .populate("vehicle")
            .populate("passengers", "firstname lastname email");

        if (!ride) {
            return res.status(404).json({ message: "Trajet introuvable." });
        }

        res.status(200).json(ride);

    } catch (error) {
        console.error("Erreur détails trajet :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// -----------------------------------------------------
// CRÉER UN TRAJET (chauffeur)
// -----------------------------------------------------
export const createRide = async (req, res) => {
    try {
        const driverId = req.user.id;

        const ride = await Ride.create({
            driver: driverId,
            vehicle: req.body.vehicle,
            startAddress: req.body.startAddress,
            endAddress: req.body.endAddress,
            price: req.body.price,
            finalPrice: req.body.finalPrice,
            availableSeats: req.body.availableSeats,
        });


        res.status(201).json({
            message: "Trajet créé.",
            ride
        });
    } catch (error) {
        console.error("Erreur création trajet :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// -----------------------------------------------------
// RÉSERVER UN TRAJET (passager)
// -----------------------------------------------------
export const bookRide = async (req, res) => {
    try {
        const rideId = req.params.rideId;

        const passengerId = req.user.id;

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Trajet introuvable." });
        }

        // Empêcher la réservation si le trajet n'est pas "scheduled"
        if (ride.status !== "scheduled") {
            return res.status(400).json({
                message: "Ce trajet n'est plus réservable."
            });
        }

        if (ride.passengers.includes(passengerId)) {
            return res.status(400).json({
                message: "Vous êtes déjà inscrit à ce trajet."
            });
        }

        if (ride.passengers.length >= ride.availableSeats) {
            return res.status(400).json({
                message: "Plus de places disponibles."
            });
        }

        ride.passengers.push(passengerId);
        await ride.save();

        res.status(200).json({
            message: "Réservation confirmée.",
            ride
        });

    } catch (error) {
        console.error("Erreur réservation :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// -----------------------------------------------------
// ANNULER UNE RÉSERVATION (passager)
// -----------------------------------------------------
export const cancelBooking = async (req, res) => {
    try {
        const rideId = req.params.rideId;
        const passengerId = req.user.id;

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Trajet introuvable." });
        }

        // Vérifier que le passager est bien inscrit
        if (!ride.passengers.includes(passengerId)) {
            return res.status(400).json({
                message: "Vous n'êtes pas inscrit à ce trajet."
            });
        }

        // Vérifier qu'il n'a pas déjà été validé par le chauffeur
        if (ride.passengerValidations.includes(passengerId)) {
            return res.status(400).json({
                message: "Vous avez déjà été validé par le chauffeur. Annulation impossible."
            });
        }

        // Retirer le passager de la liste
        ride.passengers = ride.passengers.filter(
            (p) => p.toString() !== passengerId
        );

        await ride.save();

        res.status(200).json({
            message: "Réservation annulée avec succès.",
            ride
        });

    } catch (error) {
        console.error("Erreur annulation réservation :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// -----------------------------------------------------
// VALIDER UN PASSAGER (chauffeur)
// -----------------------------------------------------
export const validateRide = async (req, res) => {
    try {
        const rideId = req.params.rideId;
        const driverId = req.user.id;
        const { passengerId } = req.body;

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Trajet introuvable." });
        }

        // Vérifier que le trajet n'est pas annulé
        if (ride.status === "cancelled") {
            return res.status(400).json({
                message: "Ce trajet est annulé. Validation impossible."
            });
        }

        // Vérifier que le chauffeur est bien le propriétaire du trajet
        if (ride.driver.toString() !== driverId) {
            return res.status(403).json({
                message: "Vous n'êtes pas le chauffeur de ce trajet."
            });
        }

        // Vérifier que le passager est inscrit
        if (!ride.passengers.includes(passengerId)) {
            return res.status(400).json({
                message: "Ce passager n'est pas inscrit à ce trajet."
            });
        }

        // Vérifier qu'il n'est pas déjà validé
        if (ride.passengerValidations.includes(passengerId)) {
            return res.status(400).json({
                message: "Ce passager a déjà été validé."
            });
        }

        // Ajouter le passager dans la liste des validations
        ride.passengerValidations.push(passengerId);

        await ride.save();

        res.status(200).json({
            message: "Passager validé avec succès.",
            ride
        });

    } catch (error) {
        console.error("Erreur validation passager :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// -----------------------------------------------------
// ANNULER UN TRAJET (chauffeur)
// -----------------------------------------------------
export const cancelRide = async (req, res) => {
    try {
        const rideId = req.params.rideId;
        const driverId = req.user.id;

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Trajet introuvable." });
        }

        if (ride.driver.toString() !== driverId) {
            return res.status(403).json({ message: "Action non autorisée." });
        }

        ride.status = "cancelled";
        await ride.save();

        res.status(200).json({
            message: "Trajet annulé.",
            ride
        });

    } catch (error) {
        console.error("Erreur annulation trajet :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// -----------------------------------------------------
// SUPPRIMER UN TRAJET (chauffeur)
// -----------------------------------------------------
export const deleteRide = async (req, res) => {
    try {
        const rideId = req.params.rideId;
        const driverId = req.user.id;

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Trajet introuvable." });
        }

        if (ride.driver.toString() !== driverId) {
            return res.status(403).json({ message: "Action non autorisée." });
        }

        await ride.deleteOne();

        res.status(200).json({
            message: "Trajet supprimé avec succès."
        });

    } catch (error) {
        console.error("Erreur suppression trajet :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// -----------------------------------------------------
// DÉMARRER UN TRAJET (chauffeur)
// -----------------------------------------------------
export const startRide = async (req, res) => {
    try {
        const rideId = req.params.rideId;
        const driverId = req.user.id;

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Trajet introuvable." });
        }

        if (ride.driver.toString() !== driverId) {
            return res.status(403).json({ message: "Action non autorisée." });
        }

        if (ride.status !== "scheduled") {
            return res.status(400).json({ message: "Ce trajet ne peut pas être démarré." });
        }

        ride.status = "in_progress";
        await ride.save();

        res.status(200).json({
            message: "Trajet démarré.",
            ride
        });

    } catch (error) {
        console.error("Erreur démarrage trajet :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// -----------------------------------------------------
// TERMINER UN TRAJET (chauffeur)
// -----------------------------------------------------
export const completeRide = async (req, res) => {
    try {
        const rideId = req.params.rideId;
        const driverId = req.user.id;

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Trajet introuvable." });
        }

        if (ride.driver.toString() !== driverId) {
            return res.status(403).json({ message: "Action non autorisée." });
        }

        if (ride.status !== "in_progress") {
            return res.status(400).json({ message: "Ce trajet ne peut pas être terminé." });
        }

        ride.status = "completed";
        await ride.save();

        res.status(200).json({
            message: "Trajet terminé.",
            ride
        });

    } catch (error) {
        console.error("Erreur fin trajet :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

