import express from "express";
import { protect, restrictTo } from "../middlewares/auth.js";
import {
  getAllUsers,
  getUserDetails,
  updateUserStatus,
} from "../controllers/employeeController.js";

const router = express.Router();

/* ------------------------------------------------------
   🧑‍💼 Employés : accès réservé
------------------------------------------------------- */
router.use(protect, restrictTo("employee", "admin"));

/* ------------------------------------------------------
   📋 Liste des utilisateurs
------------------------------------------------------- */
router.get("/users", getAllUsers);

/* ------------------------------------------------------
   🔍 Détails d’un utilisateur
------------------------------------------------------- */
router.get("/users/:id", getUserDetails);

/* ------------------------------------------------------
   🔧 Mise à jour du statut d’un utilisateur
------------------------------------------------------- */
router.patch("/users/:id/status", updateUserStatus);

export default router;
