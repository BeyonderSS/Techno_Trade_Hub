import { Transaction } from '../models/Transaction.model.js';
import { User } from '../models/User.model.js';
import { Investment } from '../models/Investment.model.js';

/**
 * @file Admin Reports Controller
 * @description Handles various reporting functionalities for the admin.
 */

/**
 * Retrieves a report of all direct referral bonuses distributed to users.
 * This report is crucial for admins to track the total payout for referral activities.
 * It includes pagination and filtering by date and user.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.query - The request query parameters for filters and pagination.
 * @param {string} [req.query.startDate] - Optional start date for filtering transactions.
 * @param {string} [req.query.endDate] - Optional end date for filtering transactions.
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Number of items per page.
 * @param {string} [req.query.searchUser] - Optional search term to filter by user name or email.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the report is sent.
 */
export const getAdminReferralBonusDistributionReport = async (req, res) => {
    try {
        const { startDate, endDate, page = 1, limit = 10, searchUser } = req.query;

        const query = {
            type: 'direct_referral_bonus',
            status: 'completed'
        };

        if (startDate || endDate) {
            query.transactionDate = {};
            if (startDate) {
                query.transactionDate.$gte = new Date(startDate);
            }
            if (endDate) {
                query.transactionDate.$lte = new Date(endDate);
            }
        }

        if (searchUser) {
            const users = await User.find({
                $or: [
                    { name: { $regex: searchUser, $options: 'i' } },
                    { email: { $regex: searchUser, $options: 'i' } }
                ]
            }).select('_id');

            const userIds = users.map(user => user._id);
            query.userId = { $in: userIds };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalTransactions = await Transaction.countDocuments(query);

        const referralBonusTransactions = await Transaction.find(query)
            .populate('userId', 'name email')
            .populate('relatedEntityId', 'name email')
            .select('amount transactionDate status type txnId userId relatedEntityId')
            .sort({ transactionDate: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        res.status(200).json({
            success: true,
            data: referralBonusTransactions,
            pagination: {
                total: totalTransactions,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalTransactions / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('Error fetching admin referral bonus distribution report:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching admin referral bonus distribution report.', error: error.message });
    }
};

/**
 * Retrieves a report of all weekly bonuses distributed to users.
 * This helps admins monitor the costs associated with the weekly bonus program.
 * It supports pagination and filtering by date and user.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.query - The request query parameters for filters and pagination.
 * @param {string} [req.query.startDate] - Optional start date for filtering transactions.
 * @param {string} [req.query.endDate] - Optional end date for filtering transactions.
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Number of items per page.
 * @param {string} [req.query.searchUser] - Optional search term to filter by user name or email.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the report is sent.
 */
export const getAdminWeeklyBonusDistributionReport = async (req, res) => {
    try {
        const { startDate, endDate, page = 1, limit = 10, searchUser } = req.query;

        const query = {
            type: 'weekly_bonus',
            status: 'completed'
        };

        if (startDate || endDate) {
            query.transactionDate = {};
            if (startDate) {
                query.transactionDate.$gte = new Date(startDate);
            }
            if (endDate) {
                query.transactionDate.$lte = new Date(endDate);
            }
        }

        if (searchUser) {
            const users = await User.find({
                $or: [
                    { name: { $regex: searchUser, $options: 'i' } },
                    { email: { $regex: searchUser, $options: 'i' } }
                ]
            }).select('_id');

            const userIds = users.map(user => user._id);
            query.userId = { $in: userIds };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalTransactions = await Transaction.countDocuments(query);

        const weeklyBonusTransactions = await Transaction.find(query)
            .populate('userId', 'name email')
            .select('amount transactionDate status type txnId userId')
            .sort({ transactionDate: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        res.status(200).json({
            success: true,
            data: weeklyBonusTransactions,
            pagination: {
                total: totalTransactions,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalTransactions / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('Error fetching admin weekly bonus distribution report:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching admin weekly bonus distribution report.', error: error.message });
    }
};

/**
 * Retrieves a report of all completed withdrawal transactions by users.
 * This is vital for financial auditing and tracking the outflow of funds from the platform.
 * It includes pagination and can be filtered by date and user.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.query - The request query parameters for filters and pagination.
 * @param {string} [req.query.startDate] - Optional start date for filtering transactions.
 * @param {string} [req.query.endDate] - Optional end date for filtering transactions.
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Number of items per page.
 * @param {string} [req.query.searchUser] - Optional search term to filter by user name or email.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the report is sent.
 */
export const getAdminWithdrawalDistributionReport = async (req, res) => {
    try {
        const { startDate, endDate, page = 1, limit = 10, searchUser } = req.query;

        const query = {
            type: 'withdrawal',
            status: 'completed'
        };

        if (startDate || endDate) {
            query.transactionDate = {};
            if (startDate) {
                query.transactionDate.$gte = new Date(startDate);
            }
            if (endDate) {
                query.transactionDate.$lte = new Date(endDate);
            }
        }

        if (searchUser) {
            const users = await User.find({
                $or: [
                    { name: { $regex: searchUser, $options: 'i' } },
                    { email: { $regex: searchUser, $options: 'i' } }
                ]
            }).select('_id');

            const userIds = users.map(user => user._id);
            query.userId = { $in: userIds };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalTransactions = await Transaction.countDocuments(query);

        const withdrawalTransactions = await Transaction.find(query)
            .populate('userId', 'name email')
            .select('amount transactionDate status type txnId userId cryptoWalletAddress adminFeeApplied')
            .sort({ transactionDate: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        res.status(200).json({
            success: true,
            data: withdrawalTransactions,
            pagination: {
                total: totalTransactions,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalTransactions / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('Error fetching admin withdrawal distribution report:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching admin withdrawal distribution report.', error: error.message });
    }
};


/**
 * Retrieves a report of all monthly salaries distributed to users.
 * This enables admins to track and audit all salary payouts.
 * It supports pagination and filtering by date and user search.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.query - The request query parameters for filters and pagination.
 * @param {string} [req.query.startDate] - Optional start date for filtering transactions (ISO 8601 format).
 * @param {string} [req.query.endDate] - Optional end date for filtering transactions (ISO 8601 format).
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Number of items per page.
 * @param {string} [req.query.searchUser] - Optional search term to filter by user name or email.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the report is sent.
 */
export const getAdminSalaryDistributionReport = async (req, res) => {
    try {
        const { startDate, endDate, page = 1, limit = 10, searchUser } = req.query;

        const query = {
            type: 'monthly_salary',
            status: 'completed'
        };

        if (startDate || endDate) {
            query.transactionDate = {};
            if (startDate) {
                query.transactionDate.$gte = new Date(startDate);
            }
            if (endDate) {
                query.transactionDate.$lte = new Date(endDate);
            }
        }

        if (searchUser) {
            const users = await User.find({
                $or: [
                    { name: { $regex: searchUser, $options: 'i' } },
                    { email: { $regex: searchUser, $options: 'i' } }
                ]
            }).select('_id');

            const userIds = users.map(user => user._id);
            query.userId = { $in: userIds };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalTransactions = await Transaction.countDocuments(query);

        const salaryTransactions = await Transaction.find(query)
            .populate('userId', 'name email')
            .select('amount transactionDate status type txnId adminActionNotes userId')
            .sort({ transactionDate: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        if (!salaryTransactions.length) {
            return res.status(200).json({
                success: true,
                message: 'No monthly salary transactions found.',
                data: [],
                pagination: {
                    total: 0,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: 0,
                },
            });
        }

        res.status(200).json({
            success: true,
            data: salaryTransactions,
            pagination: {
                total: totalTransactions,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalTransactions / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('Error fetching admin monthly salary distribution report:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching admin monthly salary distribution report.', error: error.message });
    }
};


/**
 * Generates a report of top-performing teams based on specific metrics over a period.
 * This controller identifies all team leaders (users with no referrer), then for each team,
 * calculates a performance score based on either total new investments or the number of new members
 * within the selected timeframe. The teams are then ranked by this score.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.query - The request query parameters for filters and pagination.
 * @param {'monthly' | 'weekly'} [req.query.timeframe='monthly'] - The time period to calculate performance for.
 * @param {'total_investment' | 'new_members'} [req.query.sortBy='total_investment'] - The metric to rank teams by.
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Number of teams per page.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the report is sent.
 * @throws {Error} If there's a server error during report generation.
 */
export const getTopPerformingTeamsReport = async (req, res) => {
    try {
        const { timeframe = 'monthly', sortBy = 'total_investment', page = 1, limit = 10 } = req.query;

        // 1. Define the date range for the report
        const endDate = new Date();
        let startDate;

        if (timeframe === 'weekly') {
            startDate = new Date();
            startDate.setDate(endDate.getDate() - 7);
        } else { // Default to monthly
            startDate = new Date();
            startDate.setMonth(endDate.getMonth() - 1);
        }

        // 2. Find all team leaders (root users who were not referred by anyone)
        const teamLeaders = await User.find({ referredBy: { $exists: false } }).select('_id name email').lean();

        if (!teamLeaders.length) {
            return res.status(200).json({
                success: true,
                message: 'No team leaders found to generate a report.',
                data: [],
            });
        }

        const performanceReports = [];

        // 3. For each team leader, calculate their team's performance
        // Note: For very large user bases, this loop could be resource-intensive.
        // A more advanced implementation might use a scheduled job to pre-calculate these stats.
        for (const leader of teamLeaders) {
            // Find all members in the team using the BFS traversal logic
            const teamMemberIds = new Set([leader._id.toString()]);
            const queue = [leader._id];
            let head = 0;

            while (head < queue.length) {
                const currentUserId = queue[head++];
                const user = await User.findById(currentUserId).select('directReferrals').lean();
                if (user && user.directReferrals) {
                    for (const referredId of user.directReferrals) {
                        if (!teamMemberIds.has(referredId.toString())) {
                            teamMemberIds.add(referredId.toString());
                            queue.push(referredId);
                        }
                    }
                }
            }
            
            const teamIds = Array.from(teamMemberIds);
            let performanceValue = 0;

            // 4. Calculate performance metric based on 'sortBy'
            if (sortBy === 'total_investment') {
                const investmentResult = await Investment.aggregate([
                    { $match: { 
                        userId: { $in: teamIds.map(id => new mongoose.Types.ObjectId(id)) },
                        startDate: { $gte: startDate, $lte: endDate } 
                    }},
                    { $group: { _id: null, total: { $sum: '$amount' } } }
                ]);
                performanceValue = investmentResult.length > 0 ? investmentResult[0].total : 0;
            } else { // sortBy === 'new_members'
                performanceValue = await User.countDocuments({
                    _id: { $in: teamIds.map(id => new mongoose.Types.ObjectId(id)) },
                    createdAt: { $gte: startDate, $lte: endDate }
                });
            }

            // Also, get the total investment from the team for context
            const totalTeamInvestmentResult = await User.aggregate([
                { $match: { _id: { $in: teamIds.map(id => new mongoose.Types.ObjectId(id)) } } },
                { $group: { _id: null, total: { $sum: '$totalInvestment' } } }
            ]);
            const totalTeamInvestment = totalTeamInvestmentResult.length > 0 ? totalTeamInvestmentResult[0].total : 0;


            performanceReports.push({
                teamLeader: leader,
                teamSize: teamIds.length,
                totalTeamInvestment,
                performanceValue
            });
        }

        // 5. Sort teams by the calculated performance value
        performanceReports.sort((a, b) => b.performanceValue - a.performanceValue);

        // 6. Paginate the results
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const paginatedResults = performanceReports.slice(skip, skip + parseInt(limit));
        
        const formattedResults = paginatedResults.map(report => ({
            teamLeader: report.teamLeader,
            teamSize: report.teamSize,
            totalTeamInvestment: report.totalTeamInvestment,
            [`${timeframe}Performance`]: {
                metric: sortBy,
                value: report.performanceValue,
            }
        }));

        res.status(200).json({
            success: true,
            reportMeta: {
                sortBy,
                timeframe,
            },
            data: formattedResults,
            pagination: {
                total: performanceReports.length,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(performanceReports.length / parseInt(limit)),
            },
        });

    } catch (error) {
        console.error('Error fetching top performing teams report:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching top performing teams report.', error: error.message });
    }
};