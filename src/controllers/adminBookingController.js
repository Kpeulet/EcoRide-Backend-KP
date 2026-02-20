import Booking from "../models/Booking.js";
import Ride from "../models/Ride.js";
import User from "../models/User.js";
import { isValidObjectId } from "../utils/validateObjectId.js";

/* -------------------------------------------------------
   🛡️ Vérification du rôle admin
------------------------------------------------------- */
const ensureAdmin = (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Accès réservé aux administrateurs." });
    return false;
  }
  return true;
};

/* -------------------------------------------------------
   🟦 RÉCUPÉRER TOUTES LES RÉSERVATIONS (AVEC FILTRES + PAGINATION)
------------------------------------------------------- */
export const getAllBookings = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  try {
    const {
      user,
      ride,
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};

    if (user) filter.user = user;
    if (ride) filter.ride = ride;

    const skip = (page - 1) * limit;

    const total = await Booking.countDocuments(filter);

    const bookings = await Booking.find(filter)
      .populate("user", "firstname lastname email role")
      .populate("ride", "departure arrival date price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      bookings
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* -------------------------------------------------------
   🟦 RÉCUPÉRER UNE RÉSERVATION PAR ID
------------------------------------------------------- */
export const getBookingById = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const booking = await Booking.findById(id)
      .populate("user", "firstname lastname email role")
      .populate("ride", "departure arrival date price");

    if (!booking) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }

    res.status(200).json(booking);

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* -------------------------------------------------------
   🟦 ANNULER UNE RÉSERVATION (AU LIEU DE SUPPRIMER)
------------------------------------------------------- */
export const deleteBookingByAdmin = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }

    // Récupérer le trajet associé
    const ride = await Ride.findById(booking.ride);

    if (ride) {
      // Retirer le passager du trajet
      ride.passengers = ride.passengers.filter(
        (p) => p.toString() !== booking.user.toString()
      );

      // Réajuster le nombre de places
      ride.seatsLeft = Math.min(ride.seatsLeft + 1, ride.seats);

      await ride.save();
    }

    // Supprimer la réservation
    await booking.deleteOne();

    res.status(200).json({
      message: "Réservation annulée et supprimée avec succès"
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
