import express from "express";
import {
  refreshAccessToken,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

/* ------------------------------------------------------
   🔄 Rafraîchir l'access token
------------------------------------------------------- */
router.post("/refresh", refreshAccessToken);

/* ------------------------------------------------------
   🚪 Déconnexion utilisateur
------------------------------------------------------- */
router.post("/logout", logoutUser);

export default router;
