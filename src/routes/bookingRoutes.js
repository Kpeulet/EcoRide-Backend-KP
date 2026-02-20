import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

/* ------------------------------------------------------
   🟢 Réserver un trajet
------------------------------------------------------- */
router.post("/", protect, createBooking);

/* ------------------------------------------------------
   📋 Mes réservations
------------------------------------------------------- */
router.get("/me", protect, getMyBookings);

/* ------------------------------------------------------
   ❌ Annuler une réservation
------------------------------------------------------- */
router.delete("/:id", protect, cancelBooking);

export default router;
