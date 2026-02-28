import express from "express";
import {
  searchRides,
  createRide,
  bookRide
} from "../controllers/rideController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

/* ============================================================
   🟦 US 3 + US 4 : Recherche de trajets (VISITEUR)
   - Accessible sans authentification
============================================================ */
router.get("/search", searchRides);

/* ============================================================
   🟩 US 5 : Création d’un trajet (DRIVER)
   - Authentification obligatoire
============================================================ */
router.post("/", protect, createRide);

/* ============================================================
   🟧 US 5 : Réservation d’un trajet (PASSAGER)
   - Authentification obligatoire
============================================================ */
router.post("/:rideId/book", protect, bookRide);

export default router;
