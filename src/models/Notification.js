import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "new_booking",
        "booking_accepted",
        "booking_refused",
        "booking_cancelled",
        "booking_cancelled_by_passenger",
        "ride_completed",
        "review_received",
        "review_reply",
        "admin_message"
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    payload: {
      type: Object,
      default: {},
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
