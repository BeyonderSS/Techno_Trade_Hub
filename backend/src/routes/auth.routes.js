import { registerUser,verifyOtp,loginUser,logoutUser } from "../controllers/auth.controller";
import express from "express";
import { protect } from "../middlewares/auth.middleware";
const router = express.Router();



router.post("/register",registerUser);
router.post("/verify-otp",verifyOtp);
router.post("/login",loginUser);
router.get("/logout",protect,logoutUser);

export default router;