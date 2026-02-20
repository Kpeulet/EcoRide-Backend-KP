/* ------------------------------------------------------
   🔐 Génération de JWT (version professionnelle)
------------------------------------------------------- */

import jwt from "jsonwebtoken";

export const generateToken = (user, expiresIn = "7d") => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }

  try {
    return jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );
  } catch (error) {
    console.error("❌ Error generating JWT:", error.message);
    throw new Error("Token generation failed");
  }
};
