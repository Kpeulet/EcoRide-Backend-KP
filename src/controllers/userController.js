import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/authService.js";

import RefreshToken from "../models/RefreshToken.js";

/* -------------------------------------------------------
   🟢 Inscription utilisateur (corrigée + validation complète)
------------------------------------------------------- */
export const registerUser = async (req, res) => {
  const { username, firstname, lastname, email, password, phone, role } = req.body;

  try {
    // 🔍 Validation complète des champs obligatoires
    if (!username || !firstname || !lastname || !email || !password || !phone) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires.",
      });
    }

    // Vérifier email unique
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Vérifier username unique
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Ce pseudo est déjà utilisé" });
    }

    // Rôle autorisé
    const allowedRoles = ["passenger", "driver"];
    const finalRole = allowedRoles.includes(role) ? role : "passenger";

    // Hash du mot de passe AVANT création
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création utilisateur
    const newUser = await User.create({
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phone,
      credits: 20,
      role: finalRole,
      modes: ["passenger"],
    });

    // Génération du token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        credits: newUser.credits,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* -------------------------------------------------------
   🟢 US 8 — Mise à jour des modes
------------------------------------------------------- */
export const updateModes = async (req, res) => {
  try {
    const { modes } = req.body;

    if (!Array.isArray(modes)) {
      return res.status(400).json({ message: "Format invalide : modes doit être un tableau." });
    }

    const allowed = ["passenger", "driver"];
    const validModes = modes.filter((m) => allowed.includes(m));

    if (validModes.length === 0) {
      return res.status(400).json({ message: "Aucun mode valide fourni." });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { modes: validModes },
      { new: true }
    );

    res.json({
      message: "Modes mis à jour",
      modes: user.modes,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* -------------------------------------------------------
   🟢 Connexion utilisateur
------------------------------------------------------- */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Ce compte est désactivé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.json({
      message: "Connexion réussie",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        phone: user.phone,
        credits: user.credits,
        driverRating: user.driverRating,
        driverReviewsCount: user.driverReviewsCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* -------------------------------------------------------
   🟢 Voir son profil
------------------------------------------------------- */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* -------------------------------------------------------
   🟢 Mettre à jour son profil
------------------------------------------------------- */
export const updateMe = async (req, res) => {
  try {
    const allowedFields = ["firstname", "lastname", "email", "phone"];
    const updates = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ message: "Profil mis à jour", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* -------------------------------------------------------
   🟢 US 8 — Préférences chauffeur
------------------------------------------------------- */
export const updatePreferences = async (req, res) => {
  try {
    const { smoker, animals, custom } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        preferences: {
          smoker: smoker ?? false,
          animals: animals ?? false,
          custom: Array.isArray(custom) ? custom : [],
        },
      },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Préférences mises à jour",
      preferences: user.preferences,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* -------------------------------------------------------
   🟢 US 8 — Ajouter un véhicule
------------------------------------------------------- */
export const addVehicle = async (req, res) => {
  try {
    const { brand, model, color, energy, plate, firstRegistration, seats } =
      req.body;

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
      message: "Véhicule ajouté",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/* -------------------------------------------------------
   🟢 Supprimer son compte
------------------------------------------------------- */
export const deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Compte supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
