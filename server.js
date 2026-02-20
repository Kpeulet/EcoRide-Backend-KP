import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

/* ------------------------------------------------------
   🌿 Chargement des variables d'environnement
------------------------------------------------------- */
dotenv.config();

/* ------------------------------------------------------
   📦 Connexion à MongoDB
------------------------------------------------------- */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

/* ------------------------------------------------------
   🚀 Lancement du serveur
------------------------------------------------------- */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 EcoRide backend running on port ${PORT}`);
});
