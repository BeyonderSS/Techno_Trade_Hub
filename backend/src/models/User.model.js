import mongoose from "mongoose";

/**
 * @typedef {Object} User
 * @property {string} email - Unique email of the user.
 * @property {string} [passwordHash] - Hashed password (hidden from default queries).
 * @property {boolean} isEmailVerified - Email verification status.
 * @property {string} [otpCode] - OTP code for email verification.
 * @property {Date} [otpExpiresAt] - Expiration date/time of the current OTP.
//  * @property {number} [otpAttemptCount] - Number of incorrect OTP attempts.
 * @property {'user' | 'admin'} role - Role of the user in the system.
 * @property {string} [name] - User's full name.
 * @property {string} [contactNumber] - Contact phone number.
 * @property {number} walletBalance - Amount of funds in wallet.
 * @property {mongoose.ObjectId} [referredBy] - Referrer user ID.
 * @property {number} monthlyTradesCompleted - Trades done in the current month.
//  * @property {Object} metadata - Optional expandable metadata.
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    // select: false
  },
  isEmailVerified: { type: Boolean, default: false },
  otpCode: { type: String },
  otpExpiresAt: { type: Date },
//   otpAttemptCount: { type: Number, default: 0 },

  roles: { type: String, enum: ['user', 'admin'], default: 'user' },
  name: { type: String, index: 'text' },
  contactNumber: { type: String },
  walletBalance: { type: Number, default: 0 },

  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  directReferrals:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  monthlyTradesCompleted: { type: Number, default: 0 },
totalInvestment: { type: Number, default: 0 },
//   metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
