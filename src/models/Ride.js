import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    departureCity: { type: String, required: true },
    arrivalCity: { type: String, required: true },

    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm

    availableSeats: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },

    passengers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Ride", rideSchema);
