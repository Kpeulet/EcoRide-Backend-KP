import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../services/authService.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { username, firstname, lastname, email, password, phone } = req.body;

    const strongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

      if (!strongPassword.test(password)) {
      return res.status(400).json({
      message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial."
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
    }

    const user = await User.create({
      username,
      firstname,
      lastname,
      email,
      password,
      phone,
      credits: 20,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      message: "Inscription réussie",
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
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

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
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({
    user: req.user,
  });
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token manquant." });
    }

    // Vérification du refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Récupération de l'utilisateur
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Génération d'un nouveau accessToken
    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      message: "Token rafraîchi",
      accessToken: newAccessToken,
    });

  } catch (error) {
    return res.status(401).json({ message: "Refresh token invalide." });
  }
};