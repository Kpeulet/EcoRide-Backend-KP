import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  createRide,
  getAvailableRides,
  getRideById,
  updateRide,
  deleteRide,
} from "../controllers/rideController.js";

const router = express.Router();

/* ------------------------------------------------------
   🚗 Création d’un trajet
------------------------------------------------------- */
router.post("/", protect, createRide);

/* ------------------------------------------------------
   🔍 Liste des trajets disponibles
------------------------------------------------------- */
router.get("/", getAvailableRides);

/* ------------------------------------------------------
   🔍 Détails d’un trajet
------------------------------------------------------- */
router.get("/:id", getRideById);

/* ------------------------------------------------------
   ✏️ Mise à jour d’un trajet
------------------------------------------------------- */
router.patch("/:id", protect, updateRide);

/* ------------------------------------------------------
   ❌ Suppression d’un trajet
------------------------------------------------------- */
router.delete("/:id", protect, deleteRide);

export default router;
