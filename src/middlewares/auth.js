import jwt from "jsonwebtoken";

/* ------------------------------------------------------
   🔐 Middleware protect — Vérifie l'Access Token
------------------------------------------------------- */
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Aucun header Authorization
    if (!authHeader) {
      return res.status(401).json({ message: "Accès non autorisé (token manquant)" });
    }

    // Format incorrect
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Format du token invalide" });
    }

    const token = authHeader.split(" ")[1];

    // Vérification du token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Token invalide ou expiré",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }

    // Injection des infos utilisateur dans req
    req.user = {
      _id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Erreur interne lors de la vérification du token",
      error: error.message,
    });
  }
};

/* ------------------------------------------------------
   🛡️ Middleware restrictTo(...roles)
------------------------------------------------------- */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Si protect n'a pas injecté req.user
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Vérification du rôle
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé (rôle insuffisant)" });
    }

    next();
  };
};
