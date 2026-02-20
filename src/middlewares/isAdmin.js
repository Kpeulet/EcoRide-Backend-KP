/* ------------------------------------------------------
   🛡️ Vérifie que l'utilisateur est administrateur
------------------------------------------------------- */

const isAdmin = (req, res, next) => {
  try {
    // Vérifier que auth.js a bien ajouté req.user
    if (!req.user) {
      return res.status(401).json({
        message: "Authentification requise"
      });
    }

    // Vérifier le rôle
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Accès réservé aux administrateurs"
      });
    }

    next();

  } catch (error) {
    console.error("Erreur middleware isAdmin :", error.message);

    res.status(500).json({
      message: "Erreur serveur lors de la vérification du rôle administrateur",
      error: error.message
    });
  }
};

export default isAdmin;
