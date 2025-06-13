// controllers/admin.controller.js
import { User } from '../models/User.model.js';
import { Investment } from '../models/Investment.model.js';
import { getAllDownlineUsersOptimized, getMaxDownlineDepth } from '../utils/userTreeHelpers.js';
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


export const getAllUsers = async (req, res) => {
    try {
        const {
            page = 1,                 // Current page number, default to 1
            limit = 10,               // Number of documents per page, default to 10
            search = '',              // Search query string
            sortBy = 'createdAt',     // Field to sort by, default to 'createdAt'
            sortOrder = -1,           // Sort order: -1 for descending (newest first), 1 for ascending
            isEmailVerified,          // Filter by email verification status (true/false)
            minWalletBalance,         // Filter by minimum wallet balance
            maxWalletBalance,         // Filter by maximum wallet balance
            minMonthlyTrades,         // Filter by minimum monthly trades
            maxMonthlyTrades,         // Filter by maximum monthly trades
            startDate,                // Filter by user creation date (start range)
            endDate                   // Filter by user creation date (end range)
        } = req.query; // Get parameters from query string

        // Build the query object
        const query = { roles: 'user' }; // Always filter by role 'user'

        // 1. Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },  // Case-insensitive search on name
                { email: { $regex: search, $options: 'i' } }, // Case-insensitive search on email
                { contactNumber: { $regex: search, $options: 'i' } }, // Case-insensitive search on contactNumber
                { referralCode: { $regex: search, $options: 'i' } } // Case-insensitive search on referralCode
            ];
        }

        // 2. Filter functionality
        if (isEmailVerified !== undefined) {
            // Convert string 'true'/'false' to boolean true/false
            query.isEmailVerified = isEmailVerified === 'true';
        }

        if (minWalletBalance) {
            query.walletBalance = { ...query.walletBalance, $gte: parseFloat(minWalletBalance) };
        }
        if (maxWalletBalance) {
            query.walletBalance = { ...query.walletBalance, $lte: parseFloat(maxWalletBalance) };
        }

        if (minMonthlyTrades) {
            query.monthlyTradesCompleted = { ...query.monthlyTradesCompleted, $gte: parseInt(minMonthlyTrades) };
        }
        if (maxMonthlyTrades) {
            query.monthlyTradesCompleted = { ...query.monthlyTradesCompleted, $lte: parseInt(maxMonthlyTrades) };
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                // Set end date to end of the day for inclusive range
                const endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999);
                query.createdAt.$lte = endOfDay;
            }
        }

        // 3. Pagination setup
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Count total documents matching the query (for pagination metadata)
        const totalUsers = await User.countDocuments(query);

        // Define sort options
        const sortOptions = {};
        sortOptions[sortBy] = parseInt(sortOrder); // Ensure sortOrder is a number (-1 or 1)

        // Execute the query
        const users = await User.find(query)
            .select("name email contactNumber walletBalance createdAt monthlyTradesCompleted directReferrals referralCode isEmailVerified") // Added referralCode, isEmailVerified to selected fields
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        return res.status(200).json({
            success: true,
            count: users.length,          // Count of users in the current page
            totalUsers: totalUsers,       // Total users matching the filters
            currentPage: pageNum,
            totalPages: Math.ceil(totalUsers / limitNum),
            users
        });

    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ message: "Server error", error: error.message }); // Send error.message for better debugging
    }
};








/**
 * @desc Get details for a particular user (admin view)
 * @route GET /api/admin/users/:id
 * @access Admin
 */
export const getParticularUserDetail = async (req, res) => {
    try {
        const { id } = req.params; // Get user ID from URL parameters

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid User ID format.' });
        }

        const userId = new mongoose.Types.ObjectId(id);

        // --- 1. Fetch User Details ---
        const user = await User.findById(userId).select(
            'name email contactNumber walletBalance referralCode isEmailVerified createdAt directReferrals totalInvestment'
        );

        if (!user || user.roles !== 'user') {
            return res.status(404).json({ message: 'User not found or is not a standard user account.' });
        }

        // --- Prepare date ranges for 'today' and 'this month' (IST) ---
        const { start: todayStartIST, end: todayEndIST } = getISTTodayRange();
        const startOfMonthIST = new Date(todayStartIST.getFullYear(), todayStartIST.getMonth(), 1);
        const endOfMonthIST = new Date(todayEndIST.getFullYear(), todayEndIST.getMonth() + 1, 0, 23, 59, 59, 999);


        // --- 2. User's Investments ---
        const allInvestments = await Investment.find({ userId: userId }).sort({ startDate: -1 }).lean();

        // --- 3. Total ROI Earned by this User (from transactions) ---
        const totalRoiEarnedResult = await Transaction.aggregate([
            { $match: { userId: userId, type: 'roi_payout', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRoiEarned = totalRoiEarnedResult.length > 0 ? totalRoiEarnedResult[0].total : 0;

        // --- 4. Direct Referrals ---
        const directReferralsCount = user.directReferrals ? user.directReferrals.length : 0;
        const directReferralUsers = await User.find({ _id: { $in: user.directReferrals || [] } })
            .select('name email contactNumber walletBalance createdAt')
            .limit(5); // Show top 5 direct referrals for a quick view

        // --- 5. Team Size (All Downline) ---
        const allDownlineUsersSet = await getAllDownlineUsersOptimized(userId);
        const teamSize = allDownlineUsersSet.size;

        // --- 6. Total Monthly Salary this User received ---
        const totalMonthlySalaryReceivedResult = await Transaction.aggregate([
            { $match: { userId: userId, type: 'monthly_salary', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalMonthlySalaryReceived = totalMonthlySalaryReceivedResult.length > 0 ? totalMonthlySalaryReceivedResult[0].total : 0;

        // --- 7. Total Weekly Bonus this User received ---
        const totalWeeklyBonusReceivedResult = await Transaction.aggregate([
            { $match: { userId: userId, type: 'weekly_bonus', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalWeeklyBonusReceived = totalWeeklyBonusReceivedResult.length > 0 ? totalWeeklyBonusReceivedResult[0].total : 0;

        // --- 8. Referral Growth Data (Counts for today/month & graph data for last 12 months) ---
        const referralsAddedTodayCount = await User.countDocuments({
            referredBy: userId,
            roles: 'user',
            createdAt: { $gte: todayStartIST, $lte: todayEndIST }
        });

        const referralsAddedThisMonthCount = await User.countDocuments({
            referredBy: userId,
            roles: 'user',
            createdAt: { $gte: startOfMonthIST, $lte: endOfMonthIST }
        });

        const referralGrowthGraphData = await getReferralGraphData(userId, 12); // Last 12 months

        // --- 9. Investment Amount Graph Data (Proxy: ROI Earned Over Time - Last 12 months) ---
        // This will show how much ROI was earned in each month.
        const roiEarnedGraphData = await getROIGraphData(userId, 12);

        // --- 10. User's Level (Max Downline Depth) ---
        const maxDownlineDepth = await getMaxDownlineDepth(userId);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                contactNumber: user.contactNumber,
                walletBalance: user.walletBalance.toFixed(2),
                referralCode: user.referralCode,
                isEmailVerified: user.isEmailVerified,
                memberSince: user.createdAt,
                totalPrincipalInvested: user.totalInvestment.toFixed(2), // From user model's totalInvestment
            },
            investments: allInvestments.map(inv => ({
                id: inv._id,
                amount: inv.amount.toFixed(2),
                startDate: inv.startDate,
                roiPercentageMin: inv.roiPercentageMin,
                roiPercentageMax: inv.roiPercentageMax,
                totalRoiEarned: inv.totalRoiEarned.toFixed(2),
                status: inv.status,
                lastUpdated: inv.updatedAt // Useful for tracking compounding history
            })),
            financialSummary: {
                totalRoiEarned: totalRoiEarned.toFixed(2),
                totalMonthlySalaryReceived: totalMonthlySalaryReceived.toFixed(2),
                totalWeeklyBonusReceived: totalWeeklyBonusReceived.toFixed(2),
            },
            referralSummary: {
                directReferralsCount,
                directReferralUsers, // Limited list of direct referrals
                teamSize,
                userLevel: maxDownlineDepth, // Max depth of their downline
                referralsAddedToday: referralsAddedTodayCount,
                referralsAddedThisMonth: referralsAddedThisMonthCount,
            },
            graphsData: {
                referralAdditionRate: referralGrowthGraphData, // Monthly data for graph
                roiEarnedOverTime: roiEarnedGraphData, // Monthly ROI data for graph
            }
        });

    } catch (error) {
        console.error("Error fetching particular user details:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// --- Helper functions for graph data ---

/**
 * Generates monthly data for referrals added by a specific user.
 * @param {mongoose.ObjectId} userId - The user's ID.
 * @param {number} numMonths - Number of months to go back.
 * @returns {Promise<Array<{month: string, count: number}>>}
 */
async function getReferralGraphData(userId, numMonths = 12) {
    const endDate = moment().tz('Asia/Kolkata').endOf('month');
    const startDate = moment(endDate).subtract(numMonths - 1, 'months').startOf('month');

    const result = await User.aggregate([
        {
            $match: {
                referredBy: userId,
                createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1 }
        }
    ]);

    // Fill in months with zero if no referrals were added
    const graphDataMap = new Map();
    result.forEach(item => {
        graphDataMap.set(`${item._id.year}-${String(item._id.month).padStart(2, '0')}`, item.count);
    });

    const formattedGraphData = [];
    let currentMonth = moment(startDate);
    while (currentMonth.isSameOrBefore(endDate)) {
        const monthKey = `${currentMonth.year()}-${String(currentMonth.month() + 1).padStart(2, '0')}`;
        formattedGraphData.push({
            month: currentMonth.format('YYYY-MM'),
            count: graphDataMap.get(monthKey) || 0
        });
        currentMonth.add(1, 'month');
    }

    return formattedGraphData;
}

/**
 * Generates monthly data for ROI earned by a specific user.
 * @param {mongoose.ObjectId} userId - The user's ID.
 * @param {number} numMonths - Number of months to go back.
 * @returns {Promise<Array<{month: string, amount: number}>>}
 */
async function getROIGraphData(userId, numMonths = 12) {
    const endDate = moment().tz('Asia/Kolkata').endOf('month');
    const startDate = moment(endDate).subtract(numMonths - 1, 'months').startOf('month');

    const result = await Transaction.aggregate([
        {
            $match: {
                userId: userId,
                type: 'roi_payout',
                status: 'completed',
                transactionDate: { $gte: startDate.toDate(), $lte: endDate.toDate() }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$transactionDate" },
                    month: { $month: "$transactionDate" }
                },
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1 }
        }
    ]);

    // Fill in months with zero if no ROI was earned
    const graphDataMap = new Map();
    result.forEach(item => {
        graphDataMap.set(`${item._id.year}-${String(item._id.month).padStart(2, '0')}`, item.totalAmount);
    });

    const formattedGraphData = [];
    let currentMonth = moment(startDate);
    while (currentMonth.isSameOrBefore(endDate)) {
        const monthKey = `${currentMonth.year()}-${String(currentMonth.month() + 1).padStart(2, '0')}`;
        formattedGraphData.push({
            month: currentMonth.format('YYYY-MM'),
            amount: (graphDataMap.get(monthKey) || 0).toFixed(2)
        });
        currentMonth.add(1, 'month');
    }

    return formattedGraphData;
}