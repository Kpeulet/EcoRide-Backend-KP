import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ============================================================
   🛡️ Middleware : Vérifier que l'utilisateur est connecté
============================================================ */
export const protect = async (req, res, next) => {
  let token;

  // Vérification du header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extraction du token
      token = req.headers.authorization.split(" ")[1];

      // 🔥 IMPORTANT : Vérification avec la bonne variable d’environnement
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Récupération de l'utilisateur sans le mot de passe
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Utilisateur introuvable." });
      }

      // Synchronisation du rôle (optionnel mais utile)
      if (decoded.role) {
        req.user.role = decoded.role;
      }

      return next();
    } catch (error) {
      console.error("Erreur protect :", error);
      return res.status(401).json({ message: "Token invalide." });
    }
  }

  return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
};

/* ============================================================
   🛡️ Middleware : Vérifier le rôle (ADMIN / DRIVER / PASSENGER)
============================================================ */
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

/* ============================================================
   🛡️ Alias : restrictTo (identique à authorize)
============================================================ */
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
