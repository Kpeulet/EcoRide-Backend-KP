import express from "express";
import {
  searchRides,
  getRideDetails,
  createRide,
  bookRide,
  cancelBooking,
  cancelRide,
  deleteRide,
  startRide,
  completeRide,
  validateRide
} from "../controllers/rideController.js";

import { protect } from "../middlewares/auth.js";

const router = express.Router();

/* ============================================================
   🔍 US 3 — Recherche & détails
============================================================ */
router.get("/search", searchRides);
router.get("/:id", getRideDetails);

/* ============================================================
   🚗 US 9 — Création d’un trajet (chauffeur)
============================================================ */
router.post("/", protect, createRide);

/* ============================================================
   🟧 US 6 — Réservation d’un trajet
============================================================ */
router.post("/:rideId/book", protect, bookRide);

/* ============================================================
// 🟧 US 7 — Annulation d’une réservation
 ============================================================ */
router.delete("/:rideId/book", protect, cancelBooking);

/* ============================================================
   🟥 US 10 — Annulation d’un trajet
============================================================ */
router.patch("/:rideId/cancel", protect, cancelRide);

/* ============================================================
   🟥 Suppression d’un trajet (optionnel)
============================================================ */
router.delete("/:rideId", protect, deleteRide);

/* ============================================================
   🟦🟩🟨 US 11 — Démarrer / Terminer / Valider un trajet
============================================================ */
router.patch("/:rideId/start", protect, startRide);
router.patch("/:rideId/complete", protect, completeRide);
router.patch("/:rideId/validate", protect, validateRide);

export default router;
