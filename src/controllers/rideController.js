import Ride from "../models/Ride.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";
import Review from "../models/Review.js";
import sendEmail from "../services/sendEmail.js";

/* ============================================================
   🔍 US 3 — Recherche de trajets
============================================================ */
export const searchRides = async (req, res) => {
  try {
    const { startAddress, endAddress } = req.query;

    const rides = await Ride.find({
      startAddress: { $regex: startAddress, $options: "i" },
      endAddress: { $regex: endAddress, $options: "i" },
      status: "scheduled"
    })
      .populate("driver", "-password")
      .populate("vehicle");

    res.json(rides);
  } catch (error) {
    console.error("Erreur searchRides :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

/* ============================================================
   🔍 US 3 — Détails d’un trajet
============================================================ */
export const getRideDetails = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate("driver", "-password")
      .populate("vehicle");

    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable." });
    }

    res.json(ride);
  } catch (error) {
    console.error("Erreur getRideDetails :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

/* ============================================================
   🚗 US 9 — Créer un trajet (chauffeur)
============================================================ */
export const createRide = async (req, res) => {
  try {
    if (req.user.role !== "driver" && req.user.role !== "both") {
      return res.status(403).json({
        message: "Vous devez être chauffeur pour créer un trajet."
      });
    }

    const { startAddress, endAddress, price, vehicleId } = req.body;

    if (!startAddress || !endAddress || !price || !vehicleId) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires."
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ message: "Véhicule introuvable." });
    }

    if (vehicle.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Ce véhicule ne vous appartient pas."
      });
    }

    if (price < 3) {
      return res.status(400).json({
        message: "Le prix doit être d'au moins 3 crédits."
      });
    }

    const finalPrice = price - 2;

    const ride = await Ride.create({
      driver: req.user.id,
      vehicle: vehicleId,
      startAddress,
      endAddress,
      price,
      finalPrice,
      status: "scheduled"
    });

    res.status(201).json({
      message: "Trajet créé avec succès.",
      ride
    });
  } catch (error) {
    console.error("Erreur createRide :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

/* ============================================================
   🟧 US 6 — Réserver un trajet
============================================================ */
export const bookRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable." });
    }

    if (ride.passengers.includes(req.user.id)) {
      return res.status(400).json({ message: "Vous avez déjà réservé ce trajet." });
    }

    const passenger = await User.findById(req.user.id);

    if (passenger.credits < ride.finalPrice) {
      return res.status(400).json({ message: "Crédits insuffisants." });
    }

    passenger.credits -= ride.finalPrice;
    await passenger.save();

    ride.passengers.push(req.user.id);
    await ride.save();

    res.json({ message: "Réservation confirmée.", ride });
  } catch (error) {
    console.error("Erreur bookRide :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

/* ============================================================
   🟧 US 7 — Annulation d’une réservation
============================================================ */
export const cancelBooking = async (req, res) => {
  try {
    const { rideId } = req.params;
    const userId = req.user.id;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable." });
    }

    // Vérifier que l'utilisateur est bien un passager du trajet
    const isPassenger = ride.passengers.some(
      (p) => p.toString() === userId.toString()
    );

    if (!isPassenger) {
      return res.status(403).json({
        message: "Vous n'avez pas réservé ce trajet."
      });
    }

    // Remboursement du passager
    const passenger = await User.findById(userId);
    passenger.credits += ride.finalPrice;
    await passenger.save();

    // Retirer le passager de la liste
    ride.passengers = ride.passengers.filter(
      (p) => p.toString() !== userId.toString()
    );

    await ride.save();

    res.json({ message: "Réservation annulée." });
  } catch (error) {
    console.error("Erreur cancelBooking :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


/* ============================================================
   🟥 US 10 — Annulation d’un trajet
============================================================ */
export const cancelRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const userId = req.user.id;

    const ride = await Ride.findById(rideId).populate("passengers");

    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable." });
    }

    // Chauffeur annule
    if (ride.driver.toString() === userId.toString()) {
      ride.status = "cancelled";

      for (const passenger of ride.passengers) {
        passenger.credits += ride.finalPrice;
        await passenger.save();

        await sendEmail({
          to: passenger.email,
          subject: "Trajet annulé",
          text: `Le chauffeur a annulé le trajet de ${ride.startAddress} à ${ride.endAddress}.`
        });
      }

      ride.passengers = [];
      await ride.save();

      return res.json({ message: "Trajet annulé et passagers remboursés." });
    }

    // Passager annule
    const isPassenger = ride.passengers.some(
      (p) => p._id.toString() === userId.toString()
    );

    if (!isPassenger) {
      return res.status(403).json({
        message: "Vous ne participez pas à ce trajet."
      });
    }

    const passenger = await User.findById(userId);
    passenger.credits += ride.finalPrice;
    await passenger.save();

    ride.passengers = ride.passengers.filter(
      (p) => p._id.toString() !== userId.toString()
    );

    await ride.save();

    res.json({ message: "Réservation annulée et crédits remboursés." });
  } catch (error) {
    console.error("Erreur cancelRide :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

/* ============================================================
   🟥 Suppression d’un trajet (optionnel)
============================================================ */
export const deleteRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable." });
    }

    if (ride.driver.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Vous ne pouvez supprimer que vos trajets."
      });
    }

    await ride.deleteOne();

    res.json({ message: "Trajet supprimé avec succès." });
  } catch (error) {
    console.error("Erreur deleteRide :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

/* ============================================================
   🟦 US11 — Démarrer un trajet
============================================================ */
export const startRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable." });
    }

    if (ride.driver.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Seul le chauffeur peut démarrer ce trajet."
      });
    }

    if (ride.status !== "scheduled") {
      return res.status(400).json({
        message: "Ce trajet ne peut pas être démarré."
      });
    }

    ride.status = "in_progress";
    await ride.save();

    res.json({ message: "Trajet démarré.", ride });
  } catch (error) {
    console.error("Erreur startRide :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

/* ============================================================
   🟩 US11 — Terminer un trajet
============================================================ */
export const completeRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId).populate("passengers");

    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable." });
    }

    if (ride.driver.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Seul le chauffeur peut terminer ce trajet."
      });
    }

    if (ride.status !== "in_progress") {
      return res.status(400).json({
        message: "Ce trajet ne peut pas être terminé."
      });
    }

    ride.status = "completed";

    ride.passengerValidations = ride.passengers.map((p) => ({
      passenger: p._id,
      status: "pending",
      comment: ""
    }));

    await ride.save();

    for (const passenger of ride.passengers) {
      await sendEmail({
        to: passenger.email,
        subject: "Trajet terminé",
        text: `Votre trajet de ${ride.startAddress} à ${ride.endAddress} est terminé. Merci de valider le trajet et laisser un avis.`
      });
    }

    res.json({ message: "Trajet terminé. Emails envoyés aux passagers.", ride });
  } catch (error) {
    console.error("Erreur completeRide :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

/* ============================================================
   🟨 US11 — Validation par un passager
============================================================ */
export const validateRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { status, comment, rating } = req.body;

    const ride = await Ride.findById(rideId)
      .populate("driver")
      .populate("passengers");

    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable." });
    }

    const passengerId = req.user.id.toString();
    const isPassenger = ride.passengers.some(
      (p) => p._id.toString() === passengerId
    );

    if (!isPassenger) {
      return res.status(403).json({
        message: "Vous ne participez pas à ce trajet."
      });
    }

    const validation = ride.passengerValidations.find(
      (v) => v.passenger.toString() === passengerId
    );

    if (!validation) {
      return res.status(400).json({
        message: "Aucune validation trouvée pour ce passager."
      });
    }

    if (validation.status !== "pending") {
      return res.status(400).json({
        message: "Vous avez déjà validé ce trajet."
      });
    }

    validation.status = status;
    validation.comment = comment || "";

    await ride.save();

    // ⭐ VERSION CORRIGÉE POUR MATCHER TON MODELE Review.js
    await Review.create({
      reviewer: passengerId,        // celui qui laisse l'avis
      ride: ride._id,               // trajet concerné
      driver: ride.driver._id,      // chauffeur noté
      rating,                       // obligatoire
      comment,                      // optionnel
      isApproved: false,            // US12
      issue: status === "issue"     // si tu utilises ce champ
    });

    if (status === "ok") {
      ride.driver.credits += ride.finalPrice;
      await ride.driver.save();
    }

    res.json({
      message:
        status === "ok"
          ? "Validation enregistrée. Le chauffeur sera crédité après validation employé."
          : "Problème signalé. Un employé analysera la situation.",
      ride
    });
  } catch (error) {
    console.error("Erreur validateRide :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

