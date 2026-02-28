import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true
    },

    departureCity: {
      type: String,
      required: true
    },

    arrivalCity: {
      type: String,
      required: true
    },

    date: {
      type: String, // format YYYY-MM-DD
      required: true
    },

    time: {
      type: String, // format HH:mm
      required: true
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 1
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    // 🆕 Durée du trajet (en minutes) — nécessaire pour l’US 4
    duration: {
      type: Number,
      required: true,
      min: 1
    },

    isEco: { type: Boolean, default: false },

    passengers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Ride", rideSchema);
