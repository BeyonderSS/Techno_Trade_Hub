import { User } from "../models/User.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../utils/generateJWTtoken.js";
import { sendOtpToEmail } from "../utils/sendNodeMailerOtp.js";
import { Transaction} from "../models/Transaction.model.js"
import { generateTxnId } from "../utils/generateTxnId.js";

/**
 * Generate random alphanumeric referral code
 */
 const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 chars
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, name, contactNumber, referralCode,roles } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const generatedReferralCode = generateReferralCode();

    let referredByUser = null;

    if (referralCode) {
      referredByUser = await User.findOne({ referralCode });
      if (!referredByUser)
        return res.status(400).json({ message: "Invalid referral code." });
    }

   

    const newUser = new User({
      email,
      password: hashedPassword,
      isEmailVerified: false,
      otpCode,
      otpExpiresAt,
      name,
      contactNumber,
      walletBalance: 10,
      roles: roles||["user"],
      referralCode: generatedReferralCode,
      referredBy: referredByUser ? referredByUser._id : null,
      directReferrals: [],
    });
    
   
    const savedUser = await newUser.save();
const txnId = generateTxnId("registration_bonus");
    new Transaction({
    userId: savedUser._id,
    type: "registration_bonus",
    amount: 10,
    transactionDate: new Date(),
    status: "completed",
    txnId,
   })
   await Transaction.save();

    // Add this user to referrer's directReferrals
    if (referredByUser) {
      referredByUser.directReferrals.push(savedUser._id);
      await referredByUser.save();
    }

    await sendOtpToEmail(email, otpCode);

    const token = generateToken(savedUser._id);

    return res.status(201).json({
      message: "User registered successfully. OTP sent to email.",
      token,
      user: {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
        walletBalance: savedUser.walletBalance,
        isEmailVerified: savedUser.isEmailVerified,
        referralCode: savedUser.referralCode,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.isEmailVerified) return res.status(400).json({ message: "Email already verified." });

    if (!user.otpCode || !user.otpExpiresAt || user.otpExpiresAt < new Date())
      return res.status(400).json({ message: "OTP expired. Please request a new one." });

    if (user.otpCode !== otp)
      return res.status(400).json({ message: "Invalid OTP." });

    user.isEmailVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully." });
  } catch (err) {
    console.error("OTP Verify Error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};


export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.isEmailVerified) return res.status(400).json({ message: "Email already verified." });

    const newOtp = crypto.randomInt(100000, 999999).toString();
    user.otpCode = newOtp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();
    await sendOtpToEmail(email, newOtp); // Reuse the same email utility

    return res.status(200).json({ message: "OTP resent to your email." });
  } catch (err) {
    console.error("Resend OTP Error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};


/**
 * @desc Login user with email and password
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password." });

    if (!user.isEmailVerified)
      return res.status(401).json({ message: "Please verify your email before logging in." });

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles,
        name: user.name,
        walletBalance: user.walletBalance,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};


/**
 * @desc Logs out the user by clearing the JWT cookie
 * @route POST /api/auth/logout
 * @access Private
 */
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // send only over HTTPS in production
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
