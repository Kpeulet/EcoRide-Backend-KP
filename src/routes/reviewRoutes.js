import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  createReview,
  getDriverReviews,
  getRideReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

/* ------------------------------------------------------
   ⭐ Laisser un avis
------------------------------------------------------- */
router.post("/", protect, createReview);

/* ------------------------------------------------------
   ⭐ Avis d’un conducteur
------------------------------------------------------- */
router.get("/driver/:driverId", getDriverReviews);

/* ------------------------------------------------------
   ⭐ Avis d’un trajet
------------------------------------------------------- */
router.get("/ride/:rideId", getRideReviews);

export default router;
