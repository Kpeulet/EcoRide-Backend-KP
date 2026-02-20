import express from "express";
import { protect, restrictTo } from "../middlewares/auth.js";
import {
  getAllReviews,
  deleteReview,
} from "../controllers/adminReviewController.js";

const router = express.Router();

/* ------------------------------------------------------
   🛡️ Admin : accès réservé
------------------------------------------------------- */
router.use(protect, restrictTo("admin"));

/* ------------------------------------------------------
   ⭐ Liste de tous les avis
------------------------------------------------------- */
router.get("/", getAllReviews);

/* ------------------------------------------------------
   ⭐ Supprimer un avis
------------------------------------------------------- */
router.delete("/:id", deleteReview);

export default router;
