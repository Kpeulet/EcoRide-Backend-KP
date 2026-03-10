import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import Ride from "../models/Ride.js";
import sendEmail from "../services/sendEmail.js"; // si tu as un utilitaire d’envoi d’email

/* ============================================================
   👤 GET /users/me : profil complet
============================================================ */
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("vehicles");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    res.json(user);
  } catch (error) {
    console.error("Erreur getMyProfile :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

/* ============================================================
   🟦 PATCH /users/me/type : changer le type d'utilisateur
============================================================ */
export const updateUserType = async (req, res) => {
  try {
    const { userType } = req.body;

    if (!["passenger", "driver", "both"].includes(userType)) {
      return res.status(400).json({
        message: "Type d'utilisateur invalide. Valeurs possibles : passenger, driver, both."
      });
    }

    const user = await User.findById(req.user._id).populate("vehicles");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if ((userType === "driver" || userType === "both") && user.vehicles.length === 0) {
      return res.status(400).json({
        message: "Vous devez ajouter au moins un véhicule avant de devenir chauffeur."
      });
    }

    user.userType = userType;
    await user.save();

    res.json({
      message: "Type d'utilisateur mis à jour avec succès.",
      userType: user.userType
    });
  } catch (error) {
    console.error("Erreur updateUserType :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

/* ============================================================
   🚗 POST /users/me/vehicles : ajouter un véhicule
============================================================ */
export const addVehicle = async (req, res) => {
  try {
    const {
      brand,
      model,
      color,
      plate,
      firstRegistration,
      seats,
      energy
    } = req.body;

    if (!brand || !model || !color || !plate || !firstRegistration || !seats) {
      return res.status(400).json({
        message: "Tous les champs véhicule sont obligatoires."
      });
    }

    const vehicle = await Vehicle.create({
      owner: req.user._id,
      brand,
      model,
      color,
      plate,
      firstRegistration,
      seats,
      energy
    });

    const user = await User.findById(req.user._id);
    user.vehicles.push(vehicle._id);
    await user.save();

    res.status(201).json({
      message: "Véhicule ajouté avec succès.",
      vehicle
    });
  } catch (error) {
    console.error("Erreur addVehicle :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

/* ============================================================
   ⚙️ PATCH /users/me/preferences : préférences conducteur
============================================================ */
export const updatePreferences = async (req, res) => {
  try {
    const { smoker, animals, custom } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if (typeof smoker !== "undefined") user.preferences.smoker = Boolean(smoker);
    if (typeof animals !== "undefined") user.preferences.animals = Boolean(animals);
    if (typeof custom !== "undefined") user.preferences.custom = custom;

    await user.save();

    res.json({
      message: "Préférences mises à jour avec succès.",
      preferences: user.preferences
    });
  } catch (error) {
    console.error("Erreur updatePreferences :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

/* ============================================================
   📜 GET /users/me/history : historique des trajets
============================================================ */
export const getRideHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const rides = await Ride.find({
      $or: [
        { driver: userId },
        { passengers: userId }
      ]
    })
      .populate("driver", "-password")
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (error) {
    console.error("Erreur getRideHistory :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

/* ============================================================
   💰 Ajouter des crédits au compte utilisateur
============================================================ */
export const addCredits = async (req, res) => {
  try {
    const user = req.user;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Montant invalide." });
    }

    user.credits = (user.credits || 0) + amount;
    await user.save();

    res.json({
      message: "Crédits ajoutés avec succès.",
      credits: user.credits
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};