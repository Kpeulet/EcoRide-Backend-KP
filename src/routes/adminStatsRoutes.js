import express from "express";
import { protect, restrictTo } from "../middlewares/auth.js";
import {
  getGlobalStats,
  getUserStats,
  getRideStats,
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

export default router;
