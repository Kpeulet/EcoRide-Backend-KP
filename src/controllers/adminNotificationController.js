import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { createNotification } from "../services/notificationService.js";

/* -------------------------------------------------------
   🟢 ENVOYER UNE NOTIFICATION À UN UTILISATEUR (ADMIN)
------------------------------------------------------- */
export const sendNotificationToUser = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        message: "L'ID utilisateur et le message sont obligatoires.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable.",
      });
    }

    await createNotification(
      userId,
      "admin_message",
      `Message de l'équipe : ${message}`,
      { adminId: req.user._id }
    );

    res.status(200).json({
      message: "Notification envoyée avec succès.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'envoi de la notification.",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------
   🟢 ENVOYER UNE NOTIFICATION À TOUS LES UTILISATEURS (ADMIN)
------------------------------------------------------- */
export const sendNotificationToAllUsers = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Le message est obligatoire.",
      });
    }

    const users = await User.find({}, "_id");

    for (const user of users) {
      await createNotification(
        user._id,
        "admin_message",
        `Message de l'équipe : ${message}`,
        { adminId: req.user._id }
      );
    }

    res.status(200).json({
      message: "Notification envoyée à tous les utilisateurs.",
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'envoi global.",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------
   🟦 RÉCUPÉRER TOUTES LES NOTIFICATIONS (ADMIN)
------------------------------------------------------- */
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("user", "firstname lastname email role")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des notifications.",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------
   🟦 SUPPRIMER UNE NOTIFICATION (ADMIN)
------------------------------------------------------- */
export const deleteNotificationByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification introuvable.",
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      message: "Notification supprimée avec succès.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression.",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------
   🟦 MARQUER TOUTES LES NOTIFICATIONS COMME LUES (ADMIN)
------------------------------------------------------- */
export const markAllAsReadByAdmin = async (req, res) => {
  try {
    await Notification.updateMany({}, { isRead: true });

    res.status(200).json({
      message: "Toutes les notifications ont été marquées comme lues.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour.",
      error: error.message,
    });
  }
};
