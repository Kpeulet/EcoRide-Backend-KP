import Ride from "../models/Ride.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

/* ============================================================
   🟦 US 3 + US 4 : Recherche de trajets (visiteur)
   - Recherche par ville + date
   - Filtre places disponibles
   - Filtres US4 : eco, prix max, durée max, note min
   - Suggestion de date si aucun trajet exact
============================================================ */
export const searchRides = async (req, res) => {
  try {
    const { from, to, date, eco, maxPrice, maxDuration, minRating } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({
        message: "Les paramètres from, to et date sont obligatoires."
      });
    }

    // 🔍 Filtres de base (US 3)
    let filters = {
      departureCity: from,
      arrivalCity: to,
      date,
      availableSeats: { $gte: 1 }
    };

    // 🌱 Filtre écologique (US 4)
    if (eco === "true") {
      filters.isEco = true;
    }

    if (eco === "false") {
      filters.isEco = false;
    }

    // 💶 Filtre prix maximum (US 4)
    if (maxPrice) {
      filters.price = { $lte: Number(maxPrice) };
    }

    // ⏱️ Filtre durée maximum (US 4)
    if (maxDuration) {
      filters.duration = { $lte: Number(maxDuration) };
    }

    // ⭐ Filtre note minimale du chauffeur (US 4)
    // if (minRating) {
      // filters.driverRating = { $gte: Number(minRating) };
    //}

    // 🔎 Recherche des trajets correspondant aux filtres
    const rides = await Ride.find(filters)
      .populate("driver", "username photo driverRating driverReviewsCount")
      .populate("vehicle", "energy");

    // Si des trajets existent → on renvoie directement
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
          duration: r.duration,
          isEco: r.vehicle.energy === "electric"
        }))
      });
    }

    // Aucun trajet exact → suggestion de date (US 3)
    const nextRide = await Ride.findOne({
      departureCity: from,
      arrivalCity: to,
      date: { $gt: date }
    })
      .sort({ date: 1 })
      .populate("vehicle", "energy")
      .populate("driver", "username photo driverRating driverReviewsCount");

    if (!nextRide) {
      return res.json({
        rides: [],
        suggestedDate: null
      });
    }

    return res.json({
      rides: [],
      suggestedDate: nextRide.date
    });
  } catch (error) {
    console.error("Erreur recherche trajets :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ============================================================
   🟩 US 5 : Création d’un trajet (driver)
   - Ajout du champ duration
============================================================ */
export const createRide = async (req, res) => {
  try {
    const driverId = req.user.id;
    const {
      vehicleId,
      departureCity,
      arrivalCity,
      date,
      time,
      availableSeats,
      price,
      duration
    } = req.body;

    if (!vehicleId || !departureCity || !arrivalCity || !date || !time || !availableSeats || !price || !duration) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires (y compris duration)."
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Véhicule introuvable." });
    }

    // 👉 Calcul correct du champ écologique
    const isEco = vehicle.energy === "electric";

    // 👉 Enregistrement du champ isEco dans MongoDB
    const ride = await Ride.create({
      driver: driverId,
      vehicle: vehicleId,
      departureCity,
      arrivalCity,
      date,
      time,
      availableSeats,
      price,
      duration,
      isEco
    });

    res.status(201).json({
      message: "Trajet créé avec succès",
      ride
    });
  } catch (error) {
    console.error("Erreur création trajet :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


/* ============================================================
   🟧 US 5 : Réservation d’un trajet (passager)
============================================================ */
export const bookRide = async (req, res) => {
  try {
    const passengerId = req.user.id;
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Trajet introuvable." });
    }

    if (ride.availableSeats <= 0) {
      return res.status(400).json({ message: "Aucune place disponible." });
    }

    if (ride.passengers.includes(passengerId)) {
      return res.status(400).json({ message: "Vous avez déjà réservé ce trajet." });
    }

    ride.passengers.push(passengerId);
    ride.availableSeats -= 1;

    await ride.save();

    res.json({
      message: "Réservation effectuée avec succès",
      ride
    });
  } catch (error) {
    console.error("Erreur réservation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
