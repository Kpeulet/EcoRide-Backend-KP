import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  createVehicle,
  getMyVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";

const router = express.Router();

/* ------------------------------------------------------
   🚗 Ajouter un véhicule
------------------------------------------------------- */
router.post("/", protect, createVehicle);

/* ------------------------------------------------------
   🚗 Mes véhicules
------------------------------------------------------- */
router.get("/me", protect, getMyVehicles);

/* ------------------------------------------------------
   🚗 Détails d’un véhicule
------------------------------------------------------- */
router.get("/:id", protect, getVehicleById);

/* ------------------------------------------------------
   🚗 Modifier un véhicule
------------------------------------------------------- */
router.patch("/:id", protect, updateVehicle);

/* ------------------------------------------------------
   🚗 Supprimer un véhicule
------------------------------------------------------- */
router.delete("/:id", protect, deleteVehicle);

export default router;
