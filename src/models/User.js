console.log(">>> User.js chargé depuis :", import.meta.url);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
  type: String,
  enum: ["user", "admin", "employee"], // ✔️ Ajout de employee
  default: "user"
},

    phone: { type: String },

    credits: {
      type: Number,
      default: 0,
    },

    photo: { type: String },

    driverRating: {
      type: Number,
      default: 0,
    },

    driverReviewsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/* -------------------------------------------------------
   🔐 Hash du mot de passe avant sauvegarde
------------------------------------------------------- */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* -------------------------------------------------------
   🔐 Méthode pour comparer les mots de passe
------------------------------------------------------- */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
