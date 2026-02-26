import Booking from "../models/Booking.js";
import Ride from "../models/Ride.js";

/* ------------------------------------------------------
   🎫 Créer une réservation
------------------------------------------------------- */
export const createBooking = async (req, res) => {
  try {
    const { rideId, seatsBooked } = req.body;

    if (!rideId) {
      return res.status(400).json({ message: "Le champ rideId est obligatoire." });
    }

    if (!seatsBooked || seatsBooked <= 0) {
      return res.status(400).json({ message: "Le nombre de sièges réservés est invalide." });
    }

    // Vérifier que le trajet existe
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable." });
    }

    // Vérifier les places disponibles
    if (ride.availableSeats < seatsBooked) {
      return res.status(400).json({ message: "Pas assez de places disponibles." });
    }

    // Création de la réservation
    const booking = await Booking.create({
      ride: rideId,
      driver: ride.driver,        // 🔥 IMPORTANT
      passenger: req.user._id,    // 🔥 IMPORTANT
      seatsBooked,
      totalPrice: ride.price * seatsBooked
    });

    // Mise à jour des places restantes
    ride.availableSeats -= seatsBooked;
    await ride.save();

    res.status(201).json({
      message: "Réservation créée avec succès",
      booking
    });

  } catch (error) {
    console.error("Erreur création réservation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      passenger: req.user._id
    }).populate("ride");

    if (!booking) {
      return res.status(404).json({ message: "Réservation introuvable ou non autorisée." });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Cette réservation est déjà annulée." });
    }

    // Annuler la réservation
    booking.status = "cancelled";
    await booking.save();

    // Rendre les places au trajet
    booking.ride.availableSeats += booking.seatsBooked;
    await booking.ride.save();

    res.json({ message: "Réservation annulée avec succès." });

  } catch (error) {
    console.error("Erreur annulation réservation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
