/* ------------------------------------------------------
   🎭 Vérifie que l'utilisateur possède l'un des rôles autorisés
------------------------------------------------------- */

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Vérifier que l'utilisateur est authentifié
      if (!req.user) {
        return res.status(401).json({
          message: "Authentification requise"
        });
      }

      // Vérifier que le rôle est autorisé
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Accès refusé : rôle insuffisant"
        });
      }

      next();

    } catch (error) {
      console.error("Erreur middleware authorizeRoles :", error.message);

      res.status(500).json({
        message: "Erreur serveur lors de la vérification des rôles",
        error: error.message
      });
    }
  };
};
