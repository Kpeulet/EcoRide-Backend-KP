import Booking from "../models/Booking.js";
import Ride from "../models/Ride.js";

/* ------------------------------------------------------
   🟢 Réserver un trajet
------------------------------------------------------- */
export const createBooking = async (req, res) => {
  try {
    const { rideId } = req.body;

    if (!rideId) {
      return res.status(400).json({ message: "Le champ rideId est obligatoire." });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable." });
    }

    if (ride.seats <= 0) {
      return res.status(400).json({ message: "Plus de places disponibles." });
    }

    const booking = await Booking.create({
      user: req.user._id,
      ride: rideId,
    });

    ride.seats -= 1;
    await ride.save();

    res.status(201).json({
      message: "Réservation effectuée avec succès",
      booking,
    });
  } catch (error) {
    console.error("Erreur création réservation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   📋 Mes réservations
------------------------------------------------------- */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("ride")
      .sort({ createdAt: -1 });

    res.json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Erreur récupération réservations :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   ❌ Annuler une réservation
------------------------------------------------------- */
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Réservation introuvable." });
    }

    const ride = await Ride.findById(booking.ride);
    if (ride) {
      ride.seats += 1;
      await ride.save();
    }

    res.json({ message: "Réservation annulée avec succès" });
  } catch (error) {
    console.error("Erreur annulation réservation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
