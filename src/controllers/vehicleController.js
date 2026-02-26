import Vehicle from "../models/Vehicle.js";

/* ------------------------------------------------------
   🚗 Ajouter un véhicule
------------------------------------------------------- */
export const createVehicle = async (req, res) => {
  try {
    const {
      brand,
      model,
      plate,
      seats,
      energy,
      firstRegistration,
      color,
      year
    } = req.body;

    // Vérification des champs obligatoires
    if (!brand || !model || !plate || !seats || !energy || !firstRegistration) {
      return res.status(400).json({
        message:
          "Les champs brand, model, plate, seats, energy et firstRegistration sont obligatoires."
      });
    }

    // Création du véhicule
    const vehicle = await Vehicle.create({
      owner: req.user._id,
      brand,
      model,
      plate,
      seats,
      energy,
      firstRegistration,
      color,
      year
    });

    res.status(201).json({
      message: "Véhicule ajouté avec succès",
      vehicle
    });
  } catch (error) {
    console.error("Erreur ajout véhicule :", error);

    // Gestion de l’erreur de doublon (plaque unique)
    if (error.code === 11000 && error.keyPattern?.plate) {
      return res.status(400).json({
        message: "Cette plaque est déjà enregistrée."
      });
    }

    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   🚗 Mes véhicules
------------------------------------------------------- */
export const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id });
    res.json(vehicles);
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
      owner: req.user._id
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Véhicule introuvable ou non autorisé."
      });
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
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Véhicule introuvable ou non autorisé."
      });
    }

    Object.assign(vehicle, req.body);
    await vehicle.save();

    res.json({
      message: "Véhicule mis à jour avec succès",
      vehicle
    });
  } catch (error) {
    console.error("Erreur mise à jour véhicule :", error);

    if (error.code === 11000 && error.keyPattern?.plate) {
      return res.status(400).json({
        message: "Cette plaque est déjà enregistrée."
      });
    }

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
      owner: req.user._id
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Véhicule introuvable ou non autorisé."
      });
    }

    res.json({ message: "Véhicule supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression véhicule :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
