import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Le nom d'utilisateur est obligatoire"],
      unique: true,
      trim: true,
    },

    firstname: {
      type: String,
      required: [true, "Le prénom est obligatoire"],
    },

    lastname: {
      type: String,
      required: [true, "Le nom est obligatoire"],
    },

    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      required: [true, "Le numéro de téléphone est obligatoire"],
    },

    role: {
      type: String,
      enum: ["admin", "employee", "driver", "passenger"],
      default: "passenger",
    },

    modes: {
      type: [String],
      enum: ["passenger", "driver"],
      default: ["passenger"],
    },

    preferences: {
      smoker: { type: Boolean, default: false },
      animals: { type: Boolean, default: false },
      custom: { type: [String], default: [] },
    },

    credits: {
      type: Number,
      default: 20,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isSuspended: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ------------------------------------------------------
   🔐 Hash du mot de passe AVANT sauvegarde
------------------------------------------------------- */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("User", userSchema);
