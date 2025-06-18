// models/WeeklyBonusTracking.model.js (FOR PRODUCTION)
import mongoose from "mongoose";

const weeklyBonusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  weekStartDate: { type: Date, required: true },
  directReferralsCount: { type: Number, default: 0 },
  bonusAmountEligible: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paidAt: { type: Date }
}, { timestamps: true });

// FOR PRODUCTION: This compound unique index is CRITICAL to prevent duplicate entries for the same user in the same week.
weeklyBonusSchema.index({ userId: 1, weekStartDate: 1 }, { unique: true });

export const WeeklyBonusTracking = mongoose.model('WeeklyBonusTracking', weeklyBonusSchema);