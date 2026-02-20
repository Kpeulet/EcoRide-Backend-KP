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
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // durée courte recommandée
  );
};

/* ------------------------------------------------------
   🔄 Générer un Refresh Token (durée longue)
------------------------------------------------------- */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );
};
