import Notification from "../models/Notification.js";

/* ------------------------------------------------------
   🔔 Mes notifications
------------------------------------------------------- */
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Erreur récupération notifications :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   🔔 Marquer comme lue
------------------------------------------------------- */
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification introuvable." });
    }

    res.json({
      message: "Notification marquée comme lue",
      notification,
    });
  } catch (error) {
    console.error("Erreur lecture notification :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   🔔 Supprimer une notification
------------------------------------------------------- */
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification introuvable." });
    }

    res.json({ message: "Notification supprimée avec succès" });
  } catch (error) {
    console.error("Erreur suppression notification :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
