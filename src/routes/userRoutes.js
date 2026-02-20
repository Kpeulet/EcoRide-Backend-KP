import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  updateModes,
  updatePreferences,
  addVehicle,
  deleteMe,
} from "../controllers/userController.js";

import { protect } from "../middlewares/auth.js";

const router = express.Router();

/* ------------------------------------------------------
   🟢 Inscription
------------------------------------------------------- */
router.post("/register", registerUser);

/* ------------------------------------------------------
   🟢 Connexion
------------------------------------------------------- */
router.post("/login", loginUser);

/* ------------------------------------------------------
   🟢 Profil utilisateur
------------------------------------------------------- */
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.delete("/me", protect, deleteMe);

/* ------------------------------------------------------
   🟢 Modes d'utilisation
------------------------------------------------------- */
router.patch("/modes", protect, updateModes);

/* ------------------------------------------------------
   🟢 Préférences chauffeur
------------------------------------------------------- */
router.patch("/preferences", protect, updatePreferences);

/* ------------------------------------------------------
   🟢 Ajouter un véhicule
------------------------------------------------------- */
router.post("/vehicle", protect, addVehicle);

export default router;
