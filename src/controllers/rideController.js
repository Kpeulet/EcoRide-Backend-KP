import Ride from "../models/Ride.js";
import Vehicle from "../models/Vehicle.js";

/* -------------------------------------------------------
   🟢 Créer un trajet (utilisateur connecté)
------------------------------------------------------- */
export const createRide = async (req, res, next) => {
  try {
    const {
      departureCity,
      arrivalCity,
      date,
      time,
      availableSeats,
      price,
      vehicleId,
    } = req.body;

    // Vérifier que le véhicule appartient bien à l'utilisateur
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      owner: req.user._id,
    });

    if (!vehicle) {
      return res.status(400).json({
        message: "Véhicule introuvable ou non associé à cet utilisateur.",
      });
    }

    const ride = await Ride.create({
      driver: req.user._id,
      vehicle: vehicleId,
      departureCity,
      arrivalCity,
      date,
      time,
      availableSeats,
      price,
    });

    res.status(201).json({
      message: "Trajet créé avec succès",
      ride,
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------
   🟢 Rechercher des trajets (visiteur)
------------------------------------------------------- */
export const searchRides = async (req, res, next) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({
        message: "Les champs from, to et date sont obligatoires.",
      });
    }

    // Recherche des trajets correspondant exactement à la date
    const rides = await Ride.find({
      departureCity: from,
      arrivalCity: to,
      date,
      availableSeats: { $gte: 1 },
    })
      .populate("driver", "username photo driverRating driverReviewsCount")
      .populate("vehicle", "energy");

    // Si des trajets existent → on les renvoie
    if (rides.length > 0) {
      return res.json({
        rides: rides.map((r) => ({
          id: r._id,
          driver: r.driver,
          departureCity: r.departureCity,
          arrivalCity: r.arrivalCity,
          date: r.date,
          time: r.time,
          availableSeats: r.availableSeats,
          price: r.price,
          isEco: r.vehicle.energy === "electric",
        })),
      });
    }

    // Sinon → on cherche la date la plus proche après celle demandée
    const nextRide = await Ride.find({
      departureCity: from,
      arrivalCity: to,
      availableSeats: { $gte: 1 },
      date: { $gt: date },
    })
      .sort({ date: 1 })
      .limit(1);

    if (nextRide.length === 0) {
      return res.json({
        rides: [],
        suggestedDate: null,
      });
    }

    return res.json({
      rides: [],
      suggestedDate: nextRide[0].date,
    });
  } catch (error) {
    next(error);
  }
};
