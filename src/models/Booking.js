/* ------------------------------------------------------
   📦 Booking Model (version professionnelle)
------------------------------------------------------- */

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
      index: true
    },

    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    seatsBooked: {
      type: Number,
      required: true,
      min: 1
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed"
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid"
    },

    cancelledBy: {
      type: String,
      enum: ["passenger", "driver", "system", null],
      default: null
    },

    bookedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
