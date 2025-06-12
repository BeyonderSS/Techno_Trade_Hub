import mongoose from "mongoose";

/**
 * @typedef {Object} Investment
 * @property {mongoose.ObjectId} userId - Reference to investor (User).
 * @property {number} amount - Invested amount.
 * @property {Date} startDate - Start date of investment.
//  * @property {number} minDurationDays - Minimum locking period.
 * @property {number} roiPercentageMin - Minimum ROI %.
 * @property {number} roiPercentageMax - Maximum ROI %.
 * @property {number} [totalRoiEarned] - ROI earned so far.
 * @property {'active' | 'completed' | 'withdrawn' | 'cancelled'} status - Investment status.
//  * @property {Object} metadata - Optional fields for expansion.
 */
const investmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },

//   minDurationDays: { type: Number, required: true },
  roiPercentageMin: { type: Number, required: true },
  roiPercentageMax: { type: Number, required: true },
  totalRoiEarned: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ['active',  'withdrawn'],
    default: 'active',
    index: true
  },
//   metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export const Investment = mongoose.model('Investment', investmentSchema);
