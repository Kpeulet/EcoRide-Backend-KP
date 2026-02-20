import Review from "../models/Review.js";

/* ------------------------------------------------------
   ⭐ Récupérer tous les avis (Admin)
------------------------------------------------------- */
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("author ride driver", "username email");

    res.json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Erreur récupération avis :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   ⭐ Supprimer un avis (Admin)
------------------------------------------------------- */
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Avis introuvable." });
    }

    res.json({ message: "Avis supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression avis :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
