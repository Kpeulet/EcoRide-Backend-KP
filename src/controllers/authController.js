/* ------------------------------------------------------
   🔄 Auth Controller (Refresh + Logout, rotation sécurisée)
------------------------------------------------------- */

import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/authService.js";

/* ------------------------------------------------------
   🔄 Rafraîchir l'access token (rotation sécurisée)
------------------------------------------------------- */
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token manquant" });
    }

    // Vérifier si le refresh token existe en base
    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedToken) {
      return res.status(403).json({ message: "Refresh token invalide" });
    }

    // Vérifier expiration
    if (storedToken.expiresAt < new Date()) {
      await storedToken.deleteOne();
      return res.status(403).json({ message: "Refresh token expiré" });
    }

    // Vérifier la signature du refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const userId = decoded.id;

    // 🔥 ROTATION SÉCURISÉE
    // 1. Supprimer l'ancien refresh token
    await storedToken.deleteOne();

    // 2. Générer un nouveau refresh token
    const newRefreshToken = generateRefreshToken({ _id: userId });

    // 3. Stocker le nouveau refresh token
    await RefreshToken.create({
      user: userId,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // 4. Générer un nouveau access token
    const newAccessToken = generateAccessToken({ _id: userId });

    // 5. Renvoyer les deux tokens
    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du rafraîchissement du token",
      error: error.message,
    });
  }
};

/* ------------------------------------------------------
   🚪 Déconnexion (invalidation du refresh token)
------------------------------------------------------- */
export const logoutUser = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token manquant" });
    }

    // Supprimer le refresh token en base
    await RefreshToken.findOneAndDelete({ token: refreshToken });

    res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la déconnexion",
      error: error.message,
    });
  }
};
