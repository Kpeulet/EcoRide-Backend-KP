import jwt from "jsonwebtoken";

/* ------------------------------------------------------
   🔑 Générer un Access Token (durée courte)
------------------------------------------------------- */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,   // ← CORRECTION ICI
    { expiresIn: "15m" }
  );
};

/* ------------------------------------------------------
   🔄 Générer un Refresh Token (durée longue)
------------------------------------------------------- */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,  // ← CORRECTION ICI
    { expiresIn: "30d" }
  );
};
