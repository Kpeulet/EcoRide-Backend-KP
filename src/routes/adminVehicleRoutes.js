import express from "express";
import { protect, restrictTo } from "../middlewares/auth.js";
import {
  getAllVehicles,
  deleteVehicleAdmin,
} from "../controllers/adminVehicleController.js";

const router = express.Router();

/* ------------------------------------------------------
   🛡️ Admin : accès réservé
------------------------------------------------------- */
router.use(protect, restrictTo("admin"));

/* ------------------------------------------------------
   🚗 Liste de tous les véhicules
------------------------------------------------------- */
router.get("/", getAllVehicles);

/* ------------------------------------------------------
   🚗 Supprimer un véhicule
------------------------------------------------------- */
router.delete("/:id", deleteVehicleAdmin);

export default router;
