import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =========================
// 🔐 Générer un token JWT
// =========================
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// =========================
// 🛡️ Middleware : Vérifier le token
// =========================
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Utilisateur introuvable." });
      }

      next();
    } catch (error) {
      console.error("Erreur protect :", error);
      return res.status(401).json({ message: "Token invalide." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
  }
};

// =========================
// 🛡️ Middleware : Vérifier le rôle
// =========================
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Accès refusé : rôle insuffisant." });
    }
    next();
  };
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Accès refusé : rôle insuffisant." });
    }
    next();
  };
};


// =========================
// 📝 Register
// =========================
export const register = async (req, res) => {
  try {
    const { username, firstname, lastname, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const user = await User.create({
      username,
      firstname,
      lastname,
      email,
      password,
      phone,
      role: "user",
    });

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user,
    });
  } catch (error) {
    console.error("Erreur register :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// =========================
// 🔑 Login
// =========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Identifiants invalides." });
    }

    const accessToken = generateToken(user._id, user.role);

    res.json({
      message: "Connexion réussie",
      accessToken,
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
    console.error("Erreur login :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// =========================
// 👤 Me (utilisateur connecté)
// =========================
export const me = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error("Erreur me :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
