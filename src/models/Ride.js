import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "refused",
        "cancelled",
        "completed",
        "problem" // ⭐ US 12
      ],
      default: "pending",
    },
    validated: {
      type: Boolean,
      default: false, // ⭐ US 11
    },
  },
  { _id: false }
);

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

    origin: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    seats: {
      type: Number,
      required: true,
      min: 1,
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    passengers: [passengerSchema], // ⭐ US 6, 10, 11, 12

    status: {
      type: String,
      enum: ["active", "started", "completed", "cancelled"],
      default: "active",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ride", rideSchema);
