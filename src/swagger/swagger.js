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
    /* ============================================================
       USERS
    ============================================================ */
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

    /* ============================================================
       RIDES — US3 + US4
    ============================================================ */
    "/api/rides/search": {
      get: {
        tags: ["Rides"],
        summary: "Recherche de trajets (US3 + filtres US4)",
        description:
          "Recherche par ville + date, avec filtres : écologique, prix max, durée max, note minimale.",
        parameters: [
          { name: "from", in: "query", required: true, schema: { type: "string" } },
          { name: "to", in: "query", required: true, schema: { type: "string" } },
          { name: "date", in: "query", required: true, schema: { type: "string", format: "date" } },
          { name: "eco", in: "query", required: false, schema: { type: "boolean" } },
          { name: "maxPrice", in: "query", required: false, schema: { type: "number" } },
          { name: "maxDuration", in: "query", required: false, schema: { type: "number" } },
          { name: "minRating", in: "query", required: false, schema: { type: "number" } },
        ],
        responses: {
          200: {
            description: "Liste des trajets ou suggestion de date",
          },
        },
      },
    },

    /* ============================================================
       RIDES — US5 (create)
    ============================================================ */
    "/api/rides": {
      post: {
        tags: ["Rides"],
        summary: "Créer un trajet (driver)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "vehicleId",
                  "departureCity",
                  "arrivalCity",
                  "date",
                  "time",
                  "availableSeats",
                  "price",
                  "duration",
                ],
                properties: {
                  vehicleId: { type: "string" },
                  departureCity: { type: "string" },
                  arrivalCity: { type: "string" },
                  date: { type: "string" },
                  time: { type: "string" },
                  availableSeats: { type: "number" },
                  price: { type: "number" },
                  duration: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Trajet créé avec succès" },
        },
      },
    },

    /* ============================================================
       RIDES — US5 (booking)
    ============================================================ */
    "/api/rides/{rideId}/book": {
      post: {
        tags: ["Rides"],
        summary: "Réserver un trajet (passager)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "rideId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Réservation effectuée" },
          400: { description: "Aucune place disponible ou déjà réservé" },
          404: { description: "Trajet introuvable" },
        },
      },
    },
  },

  /* ============================================================
     COMPONENTS (Security + Models)
  ============================================================ */
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    schemas: {
      /* -------------------------
         USER MODEL
      ------------------------- */
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          username: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
          photo: { type: "string", nullable: true },
          driverRating: { type: "number" },
          driverReviewsCount: { type: "number" },
          role: {
            type: "string",
            enum: ["driver", "passenger"],
          },
        },
      },

      /* -------------------------
         VEHICLE MODEL
      ------------------------- */
      Vehicle: {
        type: "object",
        properties: {
          _id: { type: "string" },
          brand: { type: "string" },
          model: { type: "string" },
          energy: {
            type: "string",
            enum: ["electric", "diesel", "petrol", "hybrid"],
          },
          seats: { type: "number" },
          owner: {
            type: "string",
            description: "ID du driver propriétaire",
          },
        },
      },

      /* -------------------------
         RIDE MODEL
      ------------------------- */
      Ride: {
        type: "object",
        properties: {
          _id: { type: "string" },
          driver: { $ref: "#/components/schemas/User" },
          vehicle: { $ref: "#/components/schemas/Vehicle" },
          departureCity: { type: "string" },
          arrivalCity: { type: "string" },
          date: { type: "string", format: "date" },
          time: { type: "string", example: "14:00" },
          availableSeats: { type: "number" },
          price: { type: "number" },
          duration: {
            type: "number",
            description: "Durée du trajet en minutes",
          },
          passengers: {
            type: "array",
            items: { $ref: "#/components/schemas/User" },
          },
        },
      },
    },
  },
};

export default swaggerDocument;
