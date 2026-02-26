import express from "express";
import { protect } from "../middlewares/auth.js";
import { payBooking } from "../controllers/paymentController.js";

const router = express.Router();

/* ------------------------------------------------------
   💳 Paiement d'une réservation
------------------------------------------------------- */
router.put("/:id/pay", protect, payBooking);

export default router;
