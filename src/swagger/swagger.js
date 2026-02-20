// src/swagger/swagger.js

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "EcoRide API",
    version: "1.0.0",
    description: "Documentation de l'API EcoRide",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Serveur local",
    },
  ],
  paths: {
    "/api/users/register": {
      post: {
        tags: ["Users"],
        summary: "Inscription utilisateur",
      },
    },
    "/api/users/login": {
      post: {
        tags: ["Users"],
        summary: "Connexion utilisateur",
      },
    },
    "/api/rides": {
      get: {
        tags: ["Rides"],
        summary: "Liste des trajets disponibles",
      },
      post: {
        tags: ["Rides"],
        summary: "Créer un trajet (driver)",
      },
    },
    "/api/bookings/{rideId}/book": {
      post: {
        tags: ["Bookings"],
        summary: "Réserver un trajet",
        parameters: [
          {
            name: "rideId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
      },
    },
  },
};

export default swaggerDocument;
