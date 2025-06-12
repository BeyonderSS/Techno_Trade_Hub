import { Transaction } from '../models/Transaction.model.js'; // Adjust path as needed
import { User } from '../models/User.model.js'; // Adjust path as needed
import { Investment } from '../models/Investment.model.js'; // Import Investment model for ROI payout related entity

/**
 * @file Reports Controller
 * @description Handles various reporting functionalities for the application.
 */

/**
 * Retrieves the direct referral income report for a specific user.
 * It fetches transactions of type 'direct_referral_bonus' for the given user.
 * The `relatedEntityId` in these transactions is conditionally populated,
 * first attempting to populate as a 'User' (the referred user), and then if not found,
 * it attempts to populate as an 'Investment' (the investment that triggered the bonus).
 *
 * @param {object} req - The Express request object.
 * @param {object} req.body - The request body.
 * @param {string} req.body.userId - The ID of the user for whom to retrieve the referral income report.
 * @param {object} req.query - The request query parameters for filters and pagination.
 * @param {string} [req.query.startDate] - Optional start date for filtering transactions (ISO 8601 format).
 * @param {string} [req.query.endDate] - Optional end date for filtering transactions (ISO 8601 format).
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Number of items per page for pagination.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the report is sent.
 * @throws {Error} If the user is not found or if there's a server error.
 */
export const getReferralIncomeReport = async (req, res) => {
  try {
    const { userId } = req.body;
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required in the request body.' });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const query = {
      userId: userId,
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

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalTransactions = await Transaction.countDocuments(query);

    const referralTransactions = await Transaction.find(query)
      .populate('userId', 'name email')
      .select('amount transactionDate status type txnId relatedEntityId adminFeeApplied')
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (!referralTransactions || referralTransactions.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No direct referral income transactions found for this user.',
        data: [],
        pagination: {
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0,
        },
      });
    }

    const populatedTransactions = await Promise.all(referralTransactions.map(async (transaction) => {
      if (transaction.relatedEntityId) {
        // Attempt to populate as a User (the referred user)
        let relatedDoc = await User.findById(transaction.relatedEntityId).select('name email').lean();
        if (relatedDoc) {
          transaction.relatedEntityDetails = { type: 'User', ...relatedDoc };
        } else {
          // If not a User, attempt to populate as an Investment
          relatedDoc = await Investment.findById(transaction.relatedEntityId).select('amount startDate status').lean();
          if (relatedDoc) {
            transaction.relatedEntityDetails = { type: 'Investment', ...relatedDoc };
          }
        }
      }
      return transaction;
    }));

    res.status(200).json({
      success: true,
      data: populatedTransactions,
      pagination: {
        total: totalTransactions,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalTransactions / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching referral income report:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching referral income report.', error: error.message });
  }
};

/**
 * Retrieves the monthly salary income report for a specific user.
 * Includes pagination and date range filtering.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.body - The request body.
 * @param {string} req.body.userId - The ID of the user for whom to retrieve the salary income report.
 * @param {object} req.query - The request query parameters for filters and pagination.
 * @param {string} [req.query.startDate] - Optional start date for filtering transactions (ISO 8601 format).
 * @param {string} [req.query.endDate] - Optional end date for filtering transactions (ISO 8601 format).
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Number of items per page for pagination.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the report is sent.
 * @throws {Error} If the user is not found or if there's a server error.
 */
export const getSalaryIncomeReport = async (req, res) => {
  try {
    const { userId } = req.body;
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required in the request body.' });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const query = {
      userId: userId,
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

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalTransactions = await Transaction.countDocuments(query);

    const salaryTransactions = await Transaction.find(query)
      .populate('userId', 'name email')
      .select('amount transactionDate status type txnId adminActionNotes')
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (!salaryTransactions || salaryTransactions.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No monthly salary income transactions found for this user.',
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
    console.error('Error fetching monthly salary report:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching monthly salary report.', error: error.message });
  }
};

/**
 * Retrieves the team performance report, showing direct referrals made by each team member
 * under a specified user. This involves traversing the referral tree.
 * Includes pagination and filtering.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.body - The request body.
 * @param {string} req.body.userId - The ID of the root user for whom to generate the team performance report.
 * @param {object} req.query - The request query parameters for filters and pagination.
 * @param {number} [req.query.page=1] - Page number for pagination of team members.
 * @param {number} [req.query.limit=10] - Number of team members per page for pagination.
 * @param {string} [req.query.memberSearch] - Optional search string to filter team members by name or email.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the report is sent.
 * @throws {Error} If the user is not found or if there's a server error.
 */
export const getTeamPerformanceReport = async (req, res) => {
  try {
    const { userId } = req.body;
    const { page = 1, limit = 10, memberSearch } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required in the request body.' });
    }

    const rootUser = await User.findById(userId).lean();
    if (!rootUser) {
      return res.status(404).json({ success: false, message: 'Root user for team performance not found.' });
    }

    const teamMembers = new Set();
    const queue = [userId]; // Start BFS with the root user ID

    // BFS to traverse the referral tree and find all team members
    // Iteratively fetch users to avoid deep recursion for large trees
    let head = 0;
    while (head < queue.length) {
        const currentUserId = queue[head++];
        if (teamMembers.has(currentUserId.toString())) continue; // Skip if already processed
        
        teamMembers.add(currentUserId.toString());

        const user = await User.findById(currentUserId).select('directReferrals').lean();
        if (user && user.directReferrals && user.directReferrals.length > 0) {
            user.directReferrals.forEach(referredId => {
                if (!teamMembers.has(referredId.toString())) {
                    queue.push(referredId);
                }
            });
        }
    }
    
    // Convert Set to Array and remove the root user if desired in the report
    const allTeamMemberIds = Array.from(teamMembers).filter(id => id !== userId); // Exclude root user from the report list

    // Build query for team members based on search filter
    const memberQuery = {
      _id: { $in: allTeamMemberIds },
      ...(memberSearch && {
        $or: [
          { name: { $regex: memberSearch, $options: 'i' } },
          { email: { $regex: memberSearch, $options: 'i' } },
        ],
      }),
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalTeamMembers = await User.countDocuments(memberQuery);

    const teamPerformanceData = await User.find(memberQuery)
      .select('name email walletBalance directReferrals')
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const formattedTeamPerformance = teamPerformanceData.map(member => ({
      userId: member._id,
      name: member.name,
      email: member.email,
      walletBalance: member.walletBalance,
      directReferralCount: member.directReferrals ? member.directReferrals.length : 0,
    }));

    res.status(200).json({
      success: true,
      data: formattedTeamPerformance,
      pagination: {
        total: totalTeamMembers,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalTeamMembers / parseInt(limit)),
      },
    });

  } catch (error) {
    console.error('Error fetching team performance report:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching team performance report.', error: error.message });
  }
};

/**
 * Retrieves the level income report for a specific user.
 * Includes pagination and date range filtering.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.body - The request body.
 * @param {string} req.body.userId - The ID of the user for whom to retrieve the level income report.
 * @param {object} req.query - The request query parameters for filters and pagination.
 * @param {string} [req.query.startDate] - Optional start date for filtering transactions (ISO 8601 format).
 * @param {string} [req.query.endDate] - Optional end date for filtering transactions (ISO 8601 format).
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Number of items per page for pagination.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the report is sent.
 * @throws {Error} If the user is not found or if there's a server error.
 */
export const getLevelIncomeReport = async (req, res) => {
  try {
    const { userId } = req.body;
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required in the request body.' });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const query = {
      userId: userId,
      type: 'level_income',
      status: 'completed' // Assuming only completed transactions are relevant for reports
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

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalTransactions = await Transaction.countDocuments(query);

    const levelTransactions = await Transaction.find(query)
      .populate('userId', 'name email')
      .select('amount transactionDate status type txnId relatedEntityId adminActionNotes')
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: levelTransactions,
      pagination: {
        total: totalTransactions,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalTransactions / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching level income report:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching level income report.', error: error.message });
  }
};

/**
 * Retrieves the weekly bonus report for a specific user.
 * Includes pagination and date range filtering.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.body - The request body.
 * @param {string} req.body.userId - The ID of the user for whom to retrieve the weekly bonus report.
 * @param {object} req.query - The request query parameters for filters and pagination.
 * @param {string} [req.query.startDate] - Optional start date for filtering transactions (ISO 8601 format).
 * @param {string} [req.query.endDate] - Optional end date for filtering transactions (ISO 8601 format).
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Number of items per page for pagination.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the report is sent.
 * @throws {Error} If the user is not found or if there's a server error.
 */
export const getWeeklyBonusReport = async (req, res) => {
  try {
    const { userId } = req.body;
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required in the request body.' });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const query = {
      userId: userId,
      type: 'weekly_bonus',
      status: 'completed' // Assuming only completed transactions are relevant for reports
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

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalTransactions = await Transaction.countDocuments(query);

    const weeklyBonusTransactions = await Transaction.find(query)
      .populate('userId', 'name email')
      .select('amount transactionDate status type txnId relatedEntityId adminActionNotes')
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
    console.error('Error fetching weekly bonus report:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching weekly bonus report.', error: error.message });
  }
};

/**
 * Retrieves the trade history report, specifically for ROI payouts, for a specific user.
 * Includes pagination and date range filtering. The `relatedEntityId` for ROI payouts
 * is populated as an 'Investment'.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.body - The request body.
 * @param {string} req.body.userId - The ID of the user for whom to retrieve the trade history report.
 * @param {object} req.query - The request query parameters for filters and pagination.
 * @param {string} [req.query.startDate] - Optional start date for filtering transactions (ISO 8601 format).
 * @param {string} [req.query.endDate] - Optional end date for filtering transactions (ISO 8601 format).
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Number of items per page for pagination.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the report is sent.
 * @throws {Error} If the user is not found or if there's a server error.
 */
export const getTradeHistoryReport = async (req, res) => {
  try {
    const { userId } = req.body;
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required in the request body.' });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const query = {
      userId: userId,
      type: 'roi_payout',
      status: 'completed' // Assuming only completed transactions are relevant for reports
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

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalTransactions = await Transaction.countDocuments(query);

    const roiPayoutTransactions = await Transaction.find(query)
      .populate('userId', 'name email') // Populate the user who received the ROI
      .populate('relatedEntityId', 'amount startDate status') // For ROI, relatedEntityId should be the Investment
      .select('amount transactionDate status type txnId relatedEntityId adminFeeApplied')
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: roiPayoutTransactions,
      pagination: {
        total: totalTransactions,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalTransactions / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching ROI payout report:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching ROI payout report.', error: error.message });
  }
};
