import Notification from "../models/Notification.js";

/* -------------------------------------------------------
   🟢 CRÉER UNE NOTIFICATION
------------------------------------------------------- */
export const createNotification = async (userId, type, message, payload = {}) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      message,
      payload,
    });

    return notification;
  } catch (error) {
    throw new Error("Erreur lors de la création de la notification : " + error.message);
  }
};

/* -------------------------------------------------------
   🟢 RÉCUPÉRER LES NOTIFICATIONS D’UN UTILISATEUR (PAGINÉ)
------------------------------------------------------- */
export const getUserNotifications = async (userId, page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ user: userId });

    return {
      notifications,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new Error("Erreur lors de la récupération des notifications : " + error.message);
  }
};

/* -------------------------------------------------------
   🟢 RÉCUPÉRER LES NOTIFICATIONS NON LUES
------------------------------------------------------- */
export const getUnreadNotifications = async (userId) => {
  try {
    return await Notification.find({ user: userId, isRead: false }).sort({
      createdAt: -1,
    });
  } catch (error) {
    throw new Error("Erreur lors de la récupération des notifications non lues : " + error.message);
  }
};

/* -------------------------------------------------------
   🟢 MARQUER UNE NOTIFICATION COMME LUE
------------------------------------------------------- */
export const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOne({
      _id: notificationId,
      user: userId,
    });

    if (!notification) return null;

    notification.isRead = true;
    await notification.save();

    return notification;
  } catch (error) {
    throw new Error("Erreur lors du marquage comme lu : " + error.message);
  }
};

/* -------------------------------------------------------
   🟢 MARQUER TOUTES LES NOTIFICATIONS COMME LUES
------------------------------------------------------- */
export const markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } }
    );

    return true;
  } catch (error) {
    throw new Error("Erreur lors du marquage global comme lu : " + error.message);
  }
};

/* -------------------------------------------------------
   🟢 SUPPRIMER UNE NOTIFICATION
------------------------------------------------------- */
export const deleteNotification = async (notificationId, userId) => {
  try {
    const deleted = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });

    return deleted;
  } catch (error) {
    throw new Error("Erreur lors de la suppression : " + error.message);
  }
};

/* -------------------------------------------------------
   🟢 SUPPRIMER TOUTES LES NOTIFICATIONS
------------------------------------------------------- */
export const deleteAllNotifications = async (userId) => {
  try {
    await Notification.deleteMany({ user: userId });
    return true;
  } catch (error) {
    throw new Error("Erreur lors de la suppression globale : " + error.message);
  }
};
