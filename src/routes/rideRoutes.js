import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  createRide,
  searchRides,
} from "../controllers/rideController.js";

const router = express.Router();

/* ------------------------------------------------------
   🔍 Recherche de trajets (visiteur)
------------------------------------------------------- */
router.get("/search", searchRides);

/* ------------------------------------------------------
   🚗 Création d’un trajet (utilisateur connecté)
------------------------------------------------------- */
router.post("/", protect, createRide);

export default router;
