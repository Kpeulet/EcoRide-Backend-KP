import User from "../models/User.js";
import Ride from "../models/Ride.js";
import Booking from "../models/Booking.js";

/* ------------------------------------------------------
   📊 Statistiques globales
------------------------------------------------------- */
export const getGlobalStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const rides = await Ride.countDocuments();
    const bookings = await Booking.countDocuments();

    res.json({
      users,
      rides,
      bookings,
    });
  } catch (error) {
    console.error("Erreur stats globales :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   📊 Statistiques utilisateurs
------------------------------------------------------- */
export const getUserStats = async (req, res) => {
  try {
    const activeUsers = await User.countDocuments({ isActive: true });
    const suspendedUsers = await User.countDocuments({ isSuspended: true });

    res.json({
      activeUsers,
      suspendedUsers,
    });
  } catch (error) {
    console.error("Erreur stats utilisateurs :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   📊 Statistiques trajets
------------------------------------------------------- */
export const getRideStats = async (req, res) => {
  try {
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.countDocuments({ status: "completed" });

    res.json({
      totalRides,
      completedRides,
    });
  } catch (error) {
    console.error("Erreur stats trajets :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
