/* ------------------------------------------------------
   🌿 Chargement et validation des variables d'environnement
------------------------------------------------------- */

import dotenv from "dotenv";

export const loadEnvironment = () => {
  // Chargement du fichier .env
  dotenv.config();

  console.log("🌿 Environment variables loaded");

  // Liste des variables indispensables au fonctionnement du backend
  const requiredVars = ["PORT", "MONGO_URI", "JWT_SECRET"];

  requiredVars.forEach((key) => {
    if (!process.env[key]) {
      console.warn(`⚠️ Missing environment variable: ${key}`);
    }
  });
};
