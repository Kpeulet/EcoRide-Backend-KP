import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/userController.js";

import {
  refreshAccessToken,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

/* ------------------------------------------------------
   🟢 Inscription
------------------------------------------------------- */
router.post("/register", registerUser);

/* ------------------------------------------------------
   🟢 Connexion
------------------------------------------------------- */
router.post("/login", loginUser);

/* ------------------------------------------------------
   🔄 Rafraîchir l'access token
------------------------------------------------------- */
router.post("/refresh", refreshAccessToken);

/* ------------------------------------------------------
   🚪 Déconnexion utilisateur
------------------------------------------------------- */
router.post("/logout", logoutUser);

export default router;
