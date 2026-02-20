/* ------------------------------------------------------
   🛡️ Rate Limiter configurable
------------------------------------------------------- */

import rateLimit from "express-rate-limit";

export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000, // 15 minutes
  max = 100,                 // 100 requêtes par fenêtre
  message = "Trop de requêtes, veuillez réessayer plus tard."
} = {}) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message }
  });
};
