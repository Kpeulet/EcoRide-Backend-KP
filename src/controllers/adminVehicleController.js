import Vehicle from "../models/Vehicle.js";

/* ------------------------------------------------------
   🚗 Récupérer tous les véhicules (Admin)
------------------------------------------------------- */
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("owner", "username email");

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
   🚗 Supprimer un véhicule (Admin)
------------------------------------------------------- */
export const deleteVehicleAdmin = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Véhicule introuvable." });
    }

    res.json({ message: "Véhicule supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression véhicule :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
