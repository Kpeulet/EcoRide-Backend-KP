/* ------------------------------------------------------
   💳 Payment Controller — Paiement d'une réservation
------------------------------------------------------- */

import Booking from "../models/Booking.js";
import User from "../models/User.js";

/* ------------------------------------------------------
   💰 Payer une réservation
------------------------------------------------------- */
export const payBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    // 1. Vérifier que la réservation existe
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Réservation introuvable." });
    }

    // 2. Vérifier que l'utilisateur est bien le passager
    if (booking.passenger.toString() !== req.user._id) {
      return res.status(403).json({ message: "Vous ne pouvez payer que vos propres réservations." });
    }

    // 3. Vérifier que la réservation n'est pas déjà payée
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ message: "Cette réservation est déjà payée." });
    }

    // 4. Récupérer le passager et le conducteur
    const passenger = await User.findById(booking.passenger);
    const driver = await User.findById(booking.driver);

    if (!passenger || !driver) {
      return res.status(500).json({ message: "Erreur interne : utilisateurs introuvables." });
    }

    // 5. Vérifier que le passager a assez de crédits
    if (passenger.credits < booking.totalPrice) {
      return res.status(400).json({
        message: "Crédits insuffisants pour effectuer le paiement.",
        creditsActuels: passenger.credits,
        montantRequis: booking.totalPrice
      });
    }

    // 6. Débiter le passager
    passenger.credits -= booking.totalPrice;
    await passenger.save();

    // 7. Créditer le conducteur
    driver.credits += booking.totalPrice;
    await driver.save();

    // 8. Mettre à jour la réservation
    booking.paymentStatus = "paid";
    await booking.save();

    res.json({
      message: "Paiement effectué avec succès.",
      booking,
      passengerCredits: passenger.credits,
      driverCredits: driver.credits
    });

  } catch (error) {
    console.error("Erreur paiement réservation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
