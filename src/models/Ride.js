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

    startAddress: {
      type: String,
      required: true
    },

    endAddress: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    finalPrice: {
      type: Number,
      required: true
    },

    passengers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    // 🆕 US11 — Statut du trajet
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "scheduled"
    },

    // 🆕 US11 — Validation des passagers après trajet
    passengerValidations: [
      {
        passenger: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        status: {
          type: String,
          enum: ["pending", "ok", "issue"],
          default: "pending"
        },
        comment: String
      }
    ]
  },
  {
    timestamps: true
  }
);


export default mongoose.model("Ride", rideSchema);
