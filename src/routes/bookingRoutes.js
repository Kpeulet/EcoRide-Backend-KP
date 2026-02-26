import express from "express";
import { protect } from "../middlewares/auth.js";

import {
  createBooking,
  cancelBooking
} from "../controllers/bookingController.js";

const router = express.Router();

/* ------------------------------------------------------
   🎫 Créer une réservation
------------------------------------------------------- */
router.post("/", protect, createBooking);

/* ------------------------------------------------------
   ❌ Annuler une réservation (passager uniquement)
------------------------------------------------------- */
router.put("/:id/cancel", protect, cancelBooking);

export default router;
