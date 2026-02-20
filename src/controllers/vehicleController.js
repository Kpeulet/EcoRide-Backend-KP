import Vehicle from "../models/Vehicle.js";

/* ------------------------------------------------------
   🚗 Ajouter un véhicule
------------------------------------------------------- */
export const createVehicle = async (req, res) => {
  try {
    const { brand, model, color, energy, plate, firstRegistration, seats } =
      req.body;

    if (!brand || !model || !plate || !seats) {
      return res.status(400).json({
        message: "Les champs brand, model, plate et seats sont obligatoires.",
      });
    }

    const vehicle = await Vehicle.create({
      owner: req.user._id,
      brand,
      model,
      color,
      energy,
      plate,
      firstRegistration,
      seats,
    });

    res.status(201).json({
      message: "Véhicule ajouté avec succès",
      vehicle,
    });
  } catch (error) {
    console.error("Erreur ajout véhicule :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   🚗 Mes véhicules
------------------------------------------------------- */
export const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id });

    res.json({
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    console.error("Erreur récupération véhicules :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   🚗 Détails d’un véhicule
------------------------------------------------------- */
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Véhicule introuvable." });
    }

    res.json(vehicle);
  } catch (error) {
    console.error("Erreur récupération véhicule :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   🚗 Modifier un véhicule
------------------------------------------------------- */
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Véhicule introuvable." });
    }

    res.json({
      message: "Véhicule mis à jour",
      vehicle,
    });
  } catch (error) {
    console.error("Erreur mise à jour véhicule :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   🚗 Supprimer un véhicule
------------------------------------------------------- */
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Véhicule introuvable." });
    }

    res.json({ message: "Véhicule supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression véhicule :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
