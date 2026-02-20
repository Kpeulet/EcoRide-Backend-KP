/* ------------------------------------------------------
   🧍 Vérifie que l'utilisateur est passager
------------------------------------------------------- */

const isPassenger = (req, res, next) => {
  try {
    // Vérifier que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({
        message: "Authentification requise"
      });
    }

    // Vérifier le rôle
    if (req.user.role !== "passenger") {
      return res.status(403).json({
        message: "Accès réservé aux passagers"
      });
    }

    next();

  } catch (error) {
    console.error("Erreur middleware isPassenger :", error.message);

    res.status(500).json({
      message: "Erreur serveur lors de la vérification du rôle passager",
      error: error.message
    });
  }
};

export default isPassenger;
