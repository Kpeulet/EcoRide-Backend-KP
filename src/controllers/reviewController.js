import Review from "../models/Review.js";

/* ------------------------------------------------------
   ⭐ Laisser un avis
------------------------------------------------------- */
export const createReview = async (req, res) => {
  try {
    const { ride, driver, rating, comment } = req.body;

    if (!ride || !driver || !rating) {
      return res.status(400).json({
        message: "Les champs ride, driver et rating sont obligatoires.",
      });
    }

    const review = await Review.create({
      author: req.user._id,
      ride,
      driver,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Avis ajouté avec succès",
      review,
    });
  } catch (error) {
    console.error("Erreur création avis :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   ⭐ Avis d’un conducteur
------------------------------------------------------- */
export const getDriverReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ driver: req.params.driverId }).populate(
      "author",
      "username"
    );

    res.json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Erreur récupération avis conducteur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   ⭐ Avis d’un trajet
------------------------------------------------------- */
export const getRideReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ ride: req.params.rideId }).populate(
      "author",
      "username"
    );

    res.json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Erreur récupération avis trajet :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
