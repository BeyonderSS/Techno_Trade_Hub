// controllers/admin.controller.js
import { User } from '../models/User.model.js';
import { Investment } from '../models/Investment.model.js';
import { Transaction } from '../models/Transaction.model.js';
import { WeeklyBonusTracking } from '../models/WeeklyBonusTracking.model.js';
// import { ReferralBonus } from '../models/ReferralBonus.model.js'; // Not directly used in requested metrics, but good to keep in mind
import { getISTTodayRange } from '../utils/timezoneHelper.js'; // Import the timezone helper

/**
 * @desc Get Admin Home Dashboard Data
 * @route GET /api/admin/home
 * @access Admin
 */
export const getAdminHome = async (req, res) => {
    try {
        // Assuming req.user is populated by your authentication middleware
        // and contains the admin user's details.
        const adminUser = await User.findById(req.user._id).select('name contactNumber email roles');

        if (!adminUser || adminUser.roles !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin role required.' });
        }

        const { start: todayStartIST, end: todayEndIST } = getISTTodayRange();

        // --- 1. Admin's total payout (all non-deposit transactions) ---
        const totalPayoutResult = await Transaction.aggregate([
            { $match: { type: { $nin: ['deposit', 'registration_bonus'] }, status: 'completed' } }, // Exclude deposits and registration bonus from payout
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalPayout = totalPayoutResult.length > 0 ? totalPayoutResult[0].total : 0;

        // --- 2. Today's Investment (Investment documents updated today in IST) ---
        // 'amount' here refers to the principal value of the investment, which gets updated daily
        const todayInvestmentResult = await Investment.aggregate([
            { $match: { updatedAt: { $gte: todayStartIST, $lte: todayEndIST } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const todayInvestment = todayInvestmentResult.length > 0 ? todayInvestmentResult[0].total : 0;

        // --- 3. Total Investment (All time, all Investment documents) ---
        const overallTotalInvestmentResult = await Investment.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const overallTotalInvestment = overallTotalInvestmentResult.length > 0 ? overallTotalInvestmentResult[0].total : 0;

        // --- 4. Total Weekly Bonus Distributed (from WeeklyBonusTracking where status is 'paid') ---
        const totalWeeklyDistributedResult = await WeeklyBonusTracking.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$bonusAmountEligible' } } }
        ]);
        const totalWeeklyDistributed = totalWeeklyDistributedResult.length > 0 ? totalWeeklyDistributedResult[0].total : 0;

        // --- 5. Total Monthly Salary Distributed (from Transaction type 'monthly_salary') ---
        const totalMonthlySalaryDistributedResult = await Transaction.aggregate([
            { $match: { type: 'monthly_salary', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalMonthlySalaryDistributed = totalMonthlySalaryDistributedResult.length > 0 ? totalMonthlySalaryDistributedResult[0].total : 0;

        // --- 6. Total ROI Distributed (from Transaction type 'roi_payout') ---
        const totalRoiDistributedResult = await Transaction.aggregate([
            { $match: { type: 'roi_payout', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRoiDistributed = totalRoiDistributedResult.length > 0 ? totalRoiDistributedResult[0].total : 0;

        // --- 7. Total Income (All deposit transactions) ---
        const totalIncomeResult = await Transaction.aggregate([
            { $match: { type: 'deposit', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalIncome = totalIncomeResult.length > 0 ? totalIncomeResult[0].total : 0;

        // --- 8. Total Users (Count of documents in User model where roles is 'user') ---
        const totalUsers = await User.countDocuments({ roles: 'user' });

        res.status(200).json({
            admin: {
                name: adminUser.name,
                contactNumber: adminUser.contactNumber,
                email: adminUser.email
            },
            dashboardData: {
                totalPayout: totalPayout.toFixed(2),
                todayInvestment: todayInvestment.toFixed(2),
                overallTotalInvestment: overallTotalInvestment.toFixed(2),
                totalWeeklyDistributed: totalWeeklyDistributed.toFixed(2),
                totalMonthlySalaryDistributed: totalMonthlySalaryDistributed.toFixed(2),
                totalRoiDistributed: totalRoiDistributed.toFixed(2),
                totalIncome: totalIncome.toFixed(2),
                totalUsers
            }
        });

    } catch (error) {
        console.error('Error fetching admin home data:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};