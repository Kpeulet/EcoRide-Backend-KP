import express from "express";
import { register, login, getMe, refreshToken } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken); // ← AJOUT IMPORTANT
router.get("/me", protect, getMe);

export default router;
