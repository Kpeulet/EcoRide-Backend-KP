import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    brand: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String, required: true },

    energy: {
      type: String,
      enum: ["essence", "diesel", "electrique", "hybride"],
      required: true,
    },

    plate: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    firstRegistration: {
      type: Date,
      required: true,
    },

    seats: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
