import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB");

    // Vérifier si un admin existe déjà
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log("⚠️ Un admin existe déjà :", adminExists.email);
      process.exit();
    }

    // Créer l'admin
    const admin = await User.create({
      username: "admin",
      firstname: "Super",
      lastname: "Admin",
      email: "admin@example.com",
      password: "Admin123!",
      role: "admin",
      phone: "0600000000",
    });

    console.log("🎉 Admin créé avec succès :", admin.email);
    process.exit();
  } catch (error) {
    console.error("❌ Erreur :", error);
    process.exit(1);
  }
}

createAdmin();
