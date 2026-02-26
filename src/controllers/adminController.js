/* ------------------------------------------------------
   🛠️ Admin Controller — Gestion Admin + Statistiques
------------------------------------------------------- */

import User from "../models/User.js";
import Ride from "../models/Ride.js";
import Booking from "../models/Booking.js";

/* ------------------------------------------------------
   👤 Création d'un employé
------------------------------------------------------- */
export const createEmployee = async (req, res) => {
  try {
    const { username, firstname, lastname, email, password, phone } = req.body;

    // Vérifier si l'email existe déjà
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Vérifier si le username existe déjà
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Ce nom d'utilisateur est déjà utilisé." });
    }

    // Création de l'employé
    const employee = await User.create({
      username,
      firstname,
      lastname,
      email,
      password,
      phone,
      role: "employee",
      modes: [],
      credits: 0,
    });

    res.status(201).json({
      message: "Employé créé avec succès.",
      employee,
    });
  } catch (error) {
    console.error("Erreur création employé :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   🚫 Suspension d'un utilisateur
------------------------------------------------------- */
export const suspendUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    user.isSuspended = true;
    await user.save();

    res.json({
      message: "Utilisateur suspendu avec succès.",
      user,
    });
  } catch (error) {
    console.error("Erreur suspension utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   📊 Statistiques Admin
------------------------------------------------------- */
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRides = await Ride.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const paidBookings = await Booking.countDocuments({ paymentStatus: "paid" });

    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const topDrivers = await User.find({ role: "driver" })
      .sort({ credits: -1 })
      .limit(5)
      .select("firstname lastname credits");

    const topPassengers = await Booking.aggregate([
      { $group: { _id: "$passenger", bookings: { $sum: 1 } } },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          firstname: "$user.firstname",
          lastname: "$user.lastname",
          bookings: 1
        }
      }
    ]);

    res.json({
      totalUsers,
      totalRides,
      totalBookings,
      paidBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      topDrivers,
      topPassengers
    });

  } catch (error) {
    console.error("Erreur stats admin :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   📈 Covoiturages par jour
------------------------------------------------------- */
export const getRidesPerDay = async (req, res) => {
  try {
    const rides = await Ride.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formatted = rides.map(r => ({
      date: r._id,
      rides: r.total
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Erreur ridesPerDay :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   💰 Revenus par jour
------------------------------------------------------- */
export const getRevenuePerDay = async (req, res) => {
  try {
    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          total: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formatted = revenue.map(r => ({
      date: r._id,
      revenue: r.total
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Erreur revenuePerDay :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
