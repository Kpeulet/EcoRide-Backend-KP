/* ------------------------------------------------------
   🚗 Vérifie que l'utilisateur est conducteur
------------------------------------------------------- */

const isDriver = (req, res, next) => {
  try {
    // Vérifier que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({
        message: "Authentification requise"
      });
    }

    // Vérifier le rôle
    if (req.user.role !== "driver") {
      return res.status(403).json({
        message: "Accès réservé aux conducteurs"
      });
    }

    next();

  } catch (error) {
    console.error("Erreur middleware isDriver :", error.message);

    res.status(500).json({
      message: "Erreur serveur lors de la vérification du rôle conducteur",
      error: error.message
    });
  }
};

export default isDriver;
