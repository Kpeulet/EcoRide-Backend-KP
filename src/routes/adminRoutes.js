import express from "express";
import { protect, restrictTo } from "../middlewares/auth.js";
import {
  createEmployee,
  suspendUser,
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

export default router;
