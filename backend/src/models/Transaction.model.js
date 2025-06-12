import mongoose from "mongoose";

/**
 * @typedef {Object} Transaction
 * @property {mongoose.ObjectId} userId - The user involved in transaction.
 * @property {'deposit' | 'withdrawal' | 'roi_payout' | 'direct_referral_bonus' | 'weekly_bonus' | 'monthly_salary' | 'registration_bonus'} type - Transaction type.
 * @property {number} amount - Transaction amount.
 * @property {Date} transactionDate - Date of the transaction.
 * @property {'pending' | 'completed' | 'failed' | 'cancelled'} status - Status of transaction.
 * @property {mongoose.ObjectId} [relatedEntityId] - Optional linked object (e.g., investment ID).
 * @property {number} [adminFeeApplied] - Fee deducted by admin (if any).
 * @property {string} [cryptoWalletAddress] - Required for withdrawals.
 * @property {string} [adminActionNotes] - Admin comments on this transaction.
//  * @property {Object} metadata - Expandable.
 */
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'roi_payout', 'direct_referral_bonus', 'weekly_bonus', 'monthly_salary', 'registration_bonus'],
    required: true,
    index: true
  },
  amount: { type: Number, required: true },
  transactionDate: { type: Date, required: true, index: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'cancelled'], default: 'pending' },
 txnId: { type: String, unique: true, sparse: true }, // Unique transaction ID for tracking
  relatedEntityId: { type: mongoose.Schema.Types.ObjectId },
  adminFeeApplied: { type: Number },
  cryptoWalletAddress: { type: String },
  adminActionNotes: { type: String },
//   metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

export const Transaction = mongoose.model('Transaction', transactionSchema);
