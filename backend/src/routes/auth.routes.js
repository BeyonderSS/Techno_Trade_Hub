import { registerUser, verifyOtp, loginUser, logoutUser, resendOtp, getUserProfile } from "../controllers/auth.controller.js";
import express from "express";
const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.post("/resend-otp", resendOtp); // Added: Route for resending OTP

// Protected routes (require authentication)
router.get("/logout", logoutUser);
router.post("/profile", getUserProfile); // Added: Route for getting user profile, now protected

export default router;
