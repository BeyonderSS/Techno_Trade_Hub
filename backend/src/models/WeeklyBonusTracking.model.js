import mongoose from "mongoose";

/**
 * @typedef {Object} WeeklyBonusTracking
 * @property {mongoose.ObjectId} userId - User eligible for weekly bonus.
 * @property {Date} weekStartDate - Start of the bonus week.
 * @property {number} directReferralsCount - Referrals counted in that week.
 * @property {number} bonusAmountEligible - Bonus amount eligible.
 * @property {'pending' | 'paid'} status - Payout status.
 */
const weeklyBonusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  weekStartDate: { type: Date, required: true },
  directReferralsCount: { type: Number, default: 0 },
  bonusAmountEligible: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
}, { timestamps: true });

export const WeeklyBonusTracking = mongoose.model('WeeklyBonusTracking', weeklyBonusSchema);
