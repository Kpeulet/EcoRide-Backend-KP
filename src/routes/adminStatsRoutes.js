import express from "express";
import { protect, restrictTo } from "../middlewares/auth.js";
import {
  getGlobalStats,
  getUserStats,
  getRideStats,
  getCreditsPerDay,
  getCreditsTotal
} from "../controllers/adminStatsController.js";

const router = express.Router();

/* ------------------------------------------------------
   🛡️ Admin : accès réservé
------------------------------------------------------- */
router.use(protect, restrictTo("admin"));

/* ------------------------------------------------------
   📊 Statistiques globales
------------------------------------------------------- */
router.get("/global", getGlobalStats);

/* ------------------------------------------------------
   📊 Statistiques utilisateurs
------------------------------------------------------- */
router.get("/users", getUserStats);

/* ------------------------------------------------------
   📊 Statistiques trajets
------------------------------------------------------- */
router.get("/rides", getRideStats);

/* ------------------------------------------------------
   📊 Crédits gagnés par jour
------------------------------------------------------- */
router.get("/credits-per-day", getCreditsPerDay);

/* ------------------------------------------------------
   💰 Total des crédits gagnés
------------------------------------------------------- */
router.get("/credits-total", getCreditsTotal);

export default router;
