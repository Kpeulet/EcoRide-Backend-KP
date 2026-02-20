import Ride from "../models/Ride.js";
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
   🟦 RÉCUPÉRER TOUS LES TRAJETS (AVEC FILTRES + PAGINATION)
------------------------------------------------------- */
export const getAllRides = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  try {
    const {
      driver,
      departure,
      arrival,
      status,
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};

    if (driver) filter.driver = driver;
    if (departure) filter.departure = { $regex: departure, $i: true };
    if (arrival) filter.arrival = { $regex: arrival, $i: true };

    if (status === "completed") filter.isCompleted = true;
    if (status === "active") filter.isCompleted = false;
    if (status === "cancelled") filter.isCancelled = true;

    const skip = (page - 1) * limit;

    const total = await Ride.countDocuments(filter);

    const rides = await Ride.find(filter)
      .populate("driver", "firstname lastname email phone role")
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      rides
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* -------------------------------------------------------
   🟦 RÉCUPÉRER UN TRAJET PAR ID
------------------------------------------------------- */
export const getRideById = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const ride = await Ride.findById(id)
      .populate("driver", "firstname lastname email phone role")
      .populate("passengers", "firstname lastname email");

    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable" });
    }

    res.status(200).json(ride);

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* -------------------------------------------------------
   🟦 ANNULER UN TRAJET (AU LIEU DE SUPPRIMER)
------------------------------------------------------- */
export const deleteRideByAdmin = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const ride = await Ride.findByIdAndUpdate(
      id,
      { isCancelled: true },
      { new: true }
    );

    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable" });
    }

    res.status(200).json({
      message: "Trajet annulé avec succès",
      ride
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
