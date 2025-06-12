/**
 * @desc Generate unique transaction ID
 * @param {'deposit' | 'withdrawal' | 'roi_payout' | 'direct_referral_bonus' | 'weekly_bonus' | 'monthly_salary' | 'registration_bonus'} type
 * @returns {string} Unique txnId e.g. TXN_WD_20250612_5K7QX3
 */
export const generateTxnId = (type) => {
  const prefixMap = {
    deposit: "DP",
    withdrawal: "WD",
    roi_payout: "ROI",
    direct_referral_bonus: "DRB",
    weekly_bonus: "WB",
    monthly_salary: "SAL",
    registration_bonus: "RB"
  };

  const prefix = prefixMap[type] || "GEN"; // fallback to GEN
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6-char random

  return `TXN_${prefix}_${datePart}_${randomPart}`;
};
