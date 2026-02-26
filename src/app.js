import express from "express";
import cors from "cors";
import morgan from "morgan";

import rideRoutes from "./routes/rideRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/admin", adminRoutes);

// Middleware 404
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée." });
});

// Middleware d’erreur
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Erreur serveur." });
});

export default app;
