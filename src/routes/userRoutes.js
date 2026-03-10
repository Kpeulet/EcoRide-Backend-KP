import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getMyProfile,
  updateUserType,
  addVehicle,
  updatePreferences,
  getRideHistory
} from "../controllers/userController.js";
import { addCredits } from "../controllers/userController.js";

const router = express.Router();

/* ============================================================
   👤 Profil utilisateur
============================================================ */
router.get("/me", protect, getMyProfile);

/* ============================================================
   🟦 Type d'utilisateur (chauffeur / passager)
============================================================ */
router.patch("/me/type", protect, updateUserType);

/* ============================================================
   🚗 Gestion des véhicules
============================================================ */
router.post("/me/vehicles", protect, addVehicle);

/* ============================================================
   ⚙️ Préférences chauffeur
============================================================ */
router.patch("/me/preferences", protect, updatePreferences);

/* ============================================================
   📜 Historique des trajets (US 10)
============================================================ */
router.get("/me/history", protect, getRideHistory);

router.patch("/me/credits", protect, addCredits);

export default router;
