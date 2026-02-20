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
   🟦 RÉCUPÉRER TOUS LES UTILISATEURS (AVEC PAGINATION + FILTRES)
------------------------------------------------------- */
export const getAllUsers = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (role) filter.role = role;

    if (search) {
      filter.$or = [
        { firstname: { $regex: search, $i: true } },
        { lastname: { $regex: search, $i: true } },
        { email: { $regex: search, $i: true } }
      ];
    }

    const skip = (page - 1) * limit;

    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      users
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* -------------------------------------------------------
   🟦 RÉCUPÉRER UN UTILISATEUR PAR ID
------------------------------------------------------- */
export const getUserById = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* -------------------------------------------------------
   🟦 DÉSACTIVER UN UTILISATEUR (AU LIEU DE SUPPRIMER)
------------------------------------------------------- */
export const deactivateUser = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.status(200).json({
      message: "Utilisateur désactivé avec succès",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* -------------------------------------------------------
   🟦 CHANGER LE RÔLE D’UN UTILISATEUR
------------------------------------------------------- */
export const updateUserRole = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const { id } = req.params;
  const { role } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  const allowedRoles = ["admin", "driver", "passenger"];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Rôle invalide" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.status(200).json({
      message: "Rôle mis à jour avec succès",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
