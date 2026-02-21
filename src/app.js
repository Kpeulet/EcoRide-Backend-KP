import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import rideRoutes from "./routes/rideRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import adminReviewRoutes from "./routes/adminReviewRoutes.js";
import adminNotificationRoutes from "./routes/adminNotificationRoutes.js";
import adminVehicleRoutes from "./routes/adminVehicleRoutes.js";
import adminStatsRoutes from "./routes/adminStatsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "EcoRide API is running 🚀" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/admin/reviews", adminReviewRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);
app.use("/api/admin/vehicles", adminVehicleRoutes);
app.use("/api/admin/stats", adminStatsRoutes);

app.use("/api/vehicles", vehicleRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bookings", bookingRoutes);

app.use("/api/employee", employeeRoutes);

app.use(errorMiddleware);

export default app;
