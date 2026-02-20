import User from "../models/User.js";

/* ------------------------------------------------------
   📋 Récupérer tous les utilisateurs (Employé/Admin)
------------------------------------------------------- */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Erreur récupération utilisateurs :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   🔍 Détails d’un utilisateur
------------------------------------------------------- */
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    res.json(user);
  } catch (error) {
    console.error("Erreur récupération utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   🔧 Mise à jour du statut d’un utilisateur
------------------------------------------------------- */
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive, isSuspended } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive, isSuspended },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    res.json({
      message: "Statut mis à jour",
      user,
    });
  } catch (error) {
    console.error("Erreur mise à jour statut utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
