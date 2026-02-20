import Ride from "../models/Ride.js";

/* ------------------------------------------------------
   🚗 Créer un trajet
------------------------------------------------------- */
export const createRide = async (req, res) => {
  try {
    const { from, to, date, seats, price } = req.body;

    if (!from || !to || !date || !seats) {
      return res.status(400).json({
        message: "Les champs from, to, date et seats sont obligatoires.",
      });
    }

    const ride = await Ride.create({
      driver: req.user._id,
      from,
      to,
      date,
      seats,
      price,
    });

    res.status(201).json({
      message: "Trajet créé avec succès",
      ride,
    });
  } catch (error) {
    console.error("Erreur création trajet :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   🚗 Trajets disponibles
------------------------------------------------------- */
export const getAvailableRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: "open" }).populate(
      "driver",
      "username email"
    );

    res.json({
      count: rides.length,
      rides,
    });
  } catch (error) {
    console.error("Erreur récupération trajets :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   🚗 Détails d’un trajet
------------------------------------------------------- */
export const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate(
      "driver",
      "username email"
    );

    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable." });
    }

    res.json(ride);
  } catch (error) {
    console.error("Erreur récupération trajet :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   🚗 Modifier un trajet
------------------------------------------------------- */
export const updateRide = async (req, res) => {
  try {
    const ride = await Ride.findOneAndUpdate(
      { _id: req.params.id, driver: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable." });
    }

    res.json({
      message: "Trajet mis à jour",
      ride,
    });
  } catch (error) {
    console.error("Erreur mise à jour trajet :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   🚗 Supprimer un trajet
------------------------------------------------------- */
export const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findOneAndDelete({
      _id: req.params.id,
      driver: req.user._id,
    });

    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable." });
    }

    res.json({ message: "Trajet supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression trajet :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
