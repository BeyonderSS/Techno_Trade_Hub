import mongoose from "mongoose";

/**
 * @typedef {Object} ReferralBonus
 * @property {mongoose.ObjectId} referrerId - User who referred.
 * @property {mongoose.ObjectId} referredUserId - New user joined.
 * @property {mongoose.ObjectId} referredInvestmentId - Investment done by referred user.
 * @property {number} bonusAmount - Bonus earned by referrer.
 * @property {Date} bonusDate - Date of bonus reward.
 * @property {'credited' | 'pending_payout'} status - Bonus status.
 */
const referralBonusSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referredInvestmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Investment', required: true },
  bonusAmount: { type: Number, required: true },
  bonusDate: { type: Date, required: true, index: true },
  status: { type: String, enum: ['credited', 'pending_payout'], default: 'pending_payout' }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

export const ReferralBonus = mongoose.model('ReferralBonus', referralBonusSchema);
