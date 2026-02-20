/* ------------------------------------------------------
   📦 Connexion MongoDB (version professionnelle)
------------------------------------------------------- */

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("📦 MongoDB connected successfully");
    console.log(`   → Host: ${conn.connection.host}`);
    console.log(`   → Database: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);

    // Arrête complètement le serveur si la DB ne se connecte pas
    process.exit(1);
  }
};

export default connectDB;
