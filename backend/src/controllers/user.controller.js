import { User } from '../models/User.model.js';
import { Transaction } from '../models/Transaction.model.js';
import { Investment } from '../models/Investment.model.js';
import mongoose from 'mongoose';

/**
 * @description Controller to fetch aggregated data for the user's home dashboard using optimized aggregation pipelines.
 * @param {object} req - Express request object, expecting `req.user.id` from auth middleware.
 * @param {object} res - Express response object.
 */
export const getUserHome = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Concurrently fetch primary user data and first investment
    const [user, firstInvestment] = await Promise.all([
      User.findById(userId)
        .populate('directReferrals', 'name email contactNumber createdAt')
        .lean(),
      Investment.findOne({ userId }).sort({ createdAt: 'asc' }).lean(),
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Run aggregations for financial calculations and referral data in parallel
    // NOTE: Total investment is now read directly from the user object, so the aggregation for it is removed.
    const [transactionalData, referralHistoryData] = await Promise.all([
      // Aggregation pipeline for all transaction-based calculations
      Transaction.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: { $cond: [{ $not: { $in: ['$type', ['deposit', 'withdrawal']] } }, '$amount', 0] },
            },
            totalReferralIncome: {
              $sum: { $cond: [{ $eq: ['$type', 'direct_referral_bonus'] }, '$amount', 0] },
            },
            tradeIncome: {
              $sum: { $cond: [{ $eq: ['$type', 'roi_payout'] }, '$amount', 0] },
            },
            levelIncome: {
              $sum: { $cond: [{ $eq: ['$type', 'level_income'] }, '$amount', 0] },
            },
            totalMonthlySalary: {
              $sum: { $cond: [{ $eq: ['$type', 'monthly_salary'] }, '$amount', 0] },
            },
            totalWeeklyReward: {
              $sum: { $cond: [{ $eq: ['$type', 'weekly_bonus'] }, '$amount', 0] },
            },
            totalWithdrawal: {
              $sum: { $cond: [{ $eq: ['$type', 'withdrawal'] }, '$amount', 0] },
            },
            registrationBonus: {
              $sum: { $cond: [{ $eq: ['$type', 'registration_bonus'] }, '$amount', 0] },
            },
          },
        },
      ]),

      // Fetch optimized referral history data if referrals exist
      getOptimizedReferralHistory(user.directReferrals),
    ]);
    
    // 3. Process and assemble the results from aggregations
    const financials = transactionalData[0] || {};
    
    const totalPayout = (financials.totalWeeklyReward || 0) + (financials.registrationBonus || 0) + (financials.totalReferralIncome || 0);

    // 4. Construct the final response object
    const responseData = {
      name: user.name,
      email: user.email,
      referralCode: user._id,
      contactNumber: user.contactNumber,
      totalIncome: financials.totalIncome || 0,
      walletBalance: user.walletBalance,
      totalInvestment: user.totalInvestment || 0, // Read directly from user object
      totalReferralIncome: financials.totalReferralIncome || 0,
      tradeIncome: financials.tradeIncome || 0,
      levelIncome: financials.levelIncome || 0,
      totalPayout,
      referralMemberCount: user.directReferrals?.length || 0,
      dateOfJoining: user.createdAt,
      activeDate: firstInvestment?.createdAt || null,
      totalMonthlySalary: financials.totalMonthlySalary || 0,
      totalWeeklyReward: financials.totalWeeklyReward || 0,
      totalWithdrawal: financials.totalWithdrawal || 0,
      directReferralHistory: referralHistoryData,
    };

    // 5. Send the final response
    res.status(200).json({
      success: true,
      message: 'User home data fetched successfully',
      data: responseData,
    });
  } catch (error) {
    console.error('Error in getUserHome controller:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * @description Fetches investment and payout data for a list of referred users efficiently.
 * This function avoids the N+1 query problem by using aggregations.
 * @param {Array} referrals - The populated directReferrals array from the user object.
 * @returns {Promise<Array>} A promise that resolves to an array of referral history objects.
 */
async function getOptimizedReferralHistory(referrals = []) {
  if (!referrals || referrals.length === 0) {
    return [];
  }

  const referralIds = referrals.map(r => r._id);

  const [referralInvestments, referralPayouts] = await Promise.all([
    // Aggregate total investment for all referrals at once
    Investment.aggregate([
      { $match: { userId: { $in: referralIds } } },
      { $group: { _id: '$userId', totalInvestment: { $sum: '$amount' } } },
    ]),
    // Aggregate total payout for all referrals at once
    Transaction.aggregate([
      { $match: { userId: { $in: referralIds }, type: { $in: ['weekly_bonus', 'registration_bonus', 'direct_referral_bonus'] } } },
      { $group: { _id: '$userId', totalPayout: { $sum: '$amount' } } },
    ]),
  ]);

  // Map the aggregated data into easily accessible objects
  const investmentMap = new Map(referralInvestments.map(item => [item._id.toString(), item.totalInvestment]));
  const payoutMap = new Map(referralPayouts.map(item => [item._id.toString(), item.totalPayout]));

  // Combine the data for the final history list
  return referrals.map(ref => ({
    name: ref.name,
    email: ref.email,
    phone: ref.contactNumber,
    joiningDate: ref.createdAt,
    investmentAmount: investmentMap.get(ref._id.toString()) || 0,
    totalPayout: payoutMap.get(ref._id.toString()) || 0,
  }));
}
