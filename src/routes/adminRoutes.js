import express from "express";
import { protect, restrictTo } from "../middlewares/auth.js";
import {
  createEmployee,
  suspendUser,
  getAdminStats,
  getRidesPerDay,
  getRevenuePerDay
} from "../controllers/adminController.js";

const router = express.Router();

/* ------------------------------------------------------
   👤 Création d'un employé (Admin uniquement)
------------------------------------------------------- */
router.post(
  "/create-employee",
  protect,
  restrictTo("admin"),
  createEmployee
);

/* ------------------------------------------------------
   🚫 Suspension d'un utilisateur (Admin uniquement)
------------------------------------------------------- */
router.patch(
  "/suspend-user/:id",
  protect,
  restrictTo("admin"),
  suspendUser
);

/* ------------------------------------------------------
   📊 Statistiques globales (Admin uniquement)
------------------------------------------------------- */
router.get(
  "/stats",
  protect,
  restrictTo("admin"),
  getAdminStats
);

/* ------------------------------------------------------
   📈 Covoiturages par jour (Admin uniquement)
------------------------------------------------------- */
router.get(
  "/stats/rides-per-day",
  protect,
  restrictTo("admin"),
  getRidesPerDay
);

/* ------------------------------------------------------
   💰 Revenus par jour (Admin uniquement)
------------------------------------------------------- */
router.get(
  "/stats/revenue-per-day",
  protect,
  restrictTo("admin"),
  getRevenuePerDay
);

export default router;
