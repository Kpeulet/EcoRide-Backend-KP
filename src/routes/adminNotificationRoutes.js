import express from "express";
import { protect, restrictTo } from "../middlewares/auth.js";

import {
  getAllNotifications,
  deleteNotificationByAdmin,
  markAllAsReadByAdmin,
  sendNotificationToUser,
  sendNotificationToAllUsers
} from "../controllers/adminNotificationController.js";

const router = express.Router();

/* -------------------------------------------------------
   🛡️ ADMIN — GESTION DES NOTIFICATIONS
------------------------------------------------------- */

router.get("/", protect, restrictTo("admin"), getAllNotifications);

router.delete("/:id", protect, restrictTo("admin"), deleteNotificationByAdmin);

router.post("/mark-all-read", protect, restrictTo("admin"), markAllAsReadByAdmin);

router.post("/send", protect, restrictTo("admin"), sendNotificationToUser);

router.post("/send-all", protect, restrictTo("admin"), sendNotificationToAllUsers);

export default router;
