import { User } from "../models/User.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../utils/generateJWTtoken.js";
import { sendOtpToEmail } from "../utils/sendNodeMailerOtp.js";
import { Transaction } from "../models/Transaction.model.js"
import { generateTxnId } from "../utils/generateTxnId.js";

/**
 * Generate random alphanumeric referral code
 */
 const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 chars
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, name, contactNumber, referralCode, roles } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists." });

    const generateReferralCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 chars
    };

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
      passwordHash: hashedPassword,
      isEmailVerified: false,
      otpCode,
      otpExpiresAt,
      name,
      contactNumber,
      walletBalance: 10,
      roles: roles || "user",
      referralCode: generatedReferralCode,
      referredBy: referredByUser ? referredByUser._id : null,
      directReferrals: [],
    });


    const savedUser = await newUser.save();
    const txnId = generateTxnId("registration_bonus");

    // --- FIX STARTS HERE ---
    const newTransaction = new Transaction({ // Assign the new instance to a variable
      userId: savedUser._id,
      type: "registration_bonus",
      amount: 10,
      transactionDate: new Date(),
      status: "completed",
      txnId,
    });
    await newTransaction.save(); // Call .save() on the instance
    // --- FIX ENDS HERE ---

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

    // 1. Input Validation (Basic) - Client-side validation is better but server-side is crucial for security
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // 2. Find User by Email
    // .select("+password") is essential to retrieve the hashed password for comparison
    const user = await User.findOne({ email });

    // If user is not found, return 404. Avoid giving specific "email not found"
    // to prevent enumeration attacks; "Invalid credentials" is more generic.
    // However, your current message "User not found." is fine if you're okay with that detail.
    // I'll keep your original message for consistency with your existing code.
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
console.log(user)
    // 3. Password Comparison
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    // If passwords don't match, return 401 Unauthorized.
    // Again, avoid specific "invalid password" to prevent enumeration.
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." }); // Changed message for better security
    }

    // 4. Email Verification Check
    // If email is not verified, return 401 Unauthorized and prompt for verification.
    if (!user.isEmailVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in. OTP sent to your email.",
        needsEmailVerification: true, // Optional: Add a flag for frontend to handle
        email: user.email // Optional: Send email back to frontend for OTP screen
      });
    }

    // 5. Generate JWT Token
    const token = generateToken(user._id);

    // 6. Successful Login Response
    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles, // Corrected from 'role' to 'roles' based on register controller
        name: user.name,
        walletBalance: user.walletBalance,
        isEmailVerified: user.isEmailVerified, // Good to include for frontend state
        referralCode: user.referralCode, // Good to include for frontend state
      },
    });

  } catch (err) {
    // 7. Catch All Server Errors
    // This catches any unexpected errors during the process (e.g., database connection issues).
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error. Please try again later." });
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


// Assuming you have access to your User model (e.g., const User = require('../models/User');)

/**
 * @desc Get user profile
 * @route POST /api/auth/profile
 * @access Private (assuming a protect middleware will be applied to this route)
 * OR Public if userId is always explicitly sent in the body.
 */
export const getUserProfile = async (req, res) => {
  try {
    // For a protected route, req.user.id would be set by your authentication middleware.
    // However, your frontend API for getUserProfile sends userId in the body.
    // So, we'll retrieve it from req.body.
    const { userId } = req.body; // Assuming userId is passed in the request body

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Find the user by ID
    // .select("-password") is used to exclude the password hash from the returned user object
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return the user's profile data
    return res.status(200).json({
      message: "User profile fetched successfully.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        contactNumber: user.contactNumber,
        walletBalance: user.walletBalance,
        isEmailVerified: user.isEmailVerified,
        referralCode: user.referralCode,
        referredBy: user.referredBy, // This might be an ID, consider populating if needed
        roles: user.roles, // Assuming roles is an array
      },
    });
  } catch (err) {
    console.error("Get User Profile Error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};