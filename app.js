import express from "express";
import cors from "cors";

/* ------------------------------------------------------
   📦 Import des routes
------------------------------------------------------- */
import userRoutes from "./src/routes/userRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import vehicleRoutes from "./src/routes/vehicleRoutes.js";
import rideRoutes from "./src/routes/rideRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import employeeRoutes from "./src/routes/employeeRoutes.js";
import adminReviewRoutes from "./src/routes/adminReviewRoutes.js";
import adminNotificationRoutes from "./src/routes/adminNotificationRoutes.js";
import adminVehicleRoutes from "./src/routes/adminVehicleRoutes.js";
import adminStatsRoutes from "./src/routes/adminStatsRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";

/* ------------------------------------------------------
   📘 Swagger Documentation
------------------------------------------------------- */
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./src/swagger/swagger.js";

/* ------------------------------------------------------
   🛑 Middleware global d'erreurs
------------------------------------------------------- */
import errorMiddleware from "./src/middlewares/errorMiddleware.js";

/* ------------------------------------------------------
   🚀 Initialisation de l'application Express
------------------------------------------------------- */
const app = express();

/* ------------------------------------------------------
   🧩 Middlewares globaux
------------------------------------------------------- */
app.use(cors());
app.use(express.json());

/* ------------------------------------------------------
   🧪 Route de test
------------------------------------------------------- */
app.get("/", (req, res) => {
  res.json({ message: "EcoRide API is running 🚀" });
});

/* ------------------------------------------------------
   📘 Swagger UI
------------------------------------------------------- */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* ------------------------------------------------------
   👤 Routes publiques
------------------------------------------------------- */
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

/* ------------------------------------------------------
   🛡️ Routes Admin
------------------------------------------------------- */
app.use("/api/admin", adminRoutes);
app.use("/api/admin/reviews", adminReviewRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);
app.use("/api/admin/vehicles", adminVehicleRoutes);
app.use("/api/admin/stats", adminStatsRoutes);

/* ------------------------------------------------------
   🚗 Routes générales
------------------------------------------------------- */
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bookings", bookingRoutes);

/* ------------------------------------------------------
   🧑‍💼 Routes Employés
------------------------------------------------------- */
app.use("/api/employee", employeeRoutes);

/* ------------------------------------------------------
   🛑 Middleware global d'erreurs
------------------------------------------------------- */
app.use(errorMiddleware);

export default app;
