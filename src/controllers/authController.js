import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/authService.js";

/* ------------------------------------------------------
   🔄 Rafraîchir l'access token
------------------------------------------------------- */
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token manquant" });
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedToken) {
      return res.status(403).json({ message: "Refresh token invalide" });
    }

    if (storedToken.expiresAt < new Date()) {
      await storedToken.deleteOne();
      return res.status(403).json({ message: "Refresh token expiré" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const userId = decoded.id;

    await storedToken.deleteOne();

    const newRefreshToken = generateRefreshToken({ _id: userId });

    await RefreshToken.create({
      user: userId,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    const newAccessToken = generateAccessToken({ _id: userId });

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
   🚪 Déconnexion
------------------------------------------------------- */
export const logoutUser = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token manquant" });
    }

    await RefreshToken.findOneAndDelete({ token: refreshToken });

    res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la déconnexion",
      error: error.message,
    });
  }
};
