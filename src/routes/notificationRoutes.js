import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getMyNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

/* ------------------------------------------------------
   🔔 Mes notifications
------------------------------------------------------- */
router.get("/", protect, getMyNotifications);

/* ------------------------------------------------------
   🔔 Marquer comme lue
------------------------------------------------------- */
router.patch("/:id/read", protect, markAsRead);

/* ------------------------------------------------------
   🔔 Supprimer une notification
------------------------------------------------------- */
router.delete("/:id", protect, deleteNotification);

export default router;
