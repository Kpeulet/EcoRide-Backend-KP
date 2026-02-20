/* ------------------------------------------------------
   ❗ Middleware global de gestion des erreurs
------------------------------------------------------- */

const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 Erreur serveur :", err);

  // Code HTTP
  const statusCode = err.statusCode || 500;

  // Message utilisateur
  const message = err.message || "Erreur serveur interne";

  // Structure de réponse
  const response = {
    success: false,
    message,
  };

  // En développement → afficher les détails techniques
  if (process.env.NODE_ENV === "development") {
    response.error = err.stack || err;
  }

  res.status(statusCode).json(response);
};

export default errorMiddleware;
