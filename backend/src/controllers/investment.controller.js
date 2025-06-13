import { Investment } from '../models/Investment.model.js'; // Adjust path as needed
import { Transaction } from '../models/Transaction.model.js'; // Adjust path as needed
import { User } from '../models/User.model.js'; // Adjust path as needed
import { generateTxnId } from "../utils/generateTxnId.js"
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation and potentially sessions

/**
 * @file Investment Controller
 * @description Handles investment-related functionalities, including withdrawals and creating new investments.
 */

/**
 * Retrieves all withdrawal transactions.
 * Allows filtering by `userId`, date range, and includes pagination.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.query - The request query parameters for filters and pagination.
 * @param {string} [req.query.userId] - Optional ID of the user to filter withdrawals.
 * @param {string} [req.query.startDate] - Optional start date for filtering transactions (ISO 8601 format).
 * @param {string} [req.query.endDate] - Optional end date for filtering transactions (ISO 8601 format).
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Number of items per page for pagination.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the report is sent.
 * @throws {Error} If there's a server error.
 */
export const getAllWithdrawals = async (req, res) => {
  try {
    const { userId, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = {
      type: 'withdrawal',
    };

    if (userId) {
      // Validate userId if provided
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid User ID format.' });
      }
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      query.userId = userId;
    }

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
    const totalWithdrawals = await Transaction.countDocuments(query);

    const withdrawals = await Transaction.find(query)
      .populate('userId', 'name email') // Populate user who made the withdrawal
      .select('amount transactionDate status type txnId cryptoWalletAddress adminFeeApplied')
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (!withdrawals || withdrawals.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No withdrawals found.',
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
      data: withdrawals,
      pagination: {
        total: totalWithdrawals,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalWithdrawals / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching withdrawals.', error: error.message });
  }
};

/**
 * Creates a new investment document and handles the associated deposit transaction.
 * roiPercentageMin and roiPercentageMax are automatically determined based on the investment amount.
 * Also, distributes a 5% direct referral bonus to the user's referrer (parent).
 *
 * @param {object} req - The Express request object.
 * @param {object} req.body - The request body containing investment details.
 * @param {string} req.body.userId - The ID of the user making the investment.
 * @param {number} req.body.amount - The investment amount (also the deposit amount).
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the investment and bonus are processed.
 * @throws {Error} If the user is not found, input is invalid, or any transaction fails.
 */
export const createInvestment = async (req, res) => {
  // To ensure atomicity for complex operations like this (multiple document updates/creations),
  // consider using MongoDB transactions if your MongoDB replica set supports them.
  // Example: const session = await mongoose.startSession(); session.startTransaction();
  // Remember to use .session(session) on all Mongoose operations within the transaction,
  // and then commitTransaction() or abortTransaction().

  try {
    const { userId, amount } = req.body;
    let roiPercentageMin, roiPercentageMax;

    // 1. Input Validation
    if (!userId || typeof amount === 'undefined') {
      return res.status(400).json({ success: false, message: 'Missing required fields: userId and amount.' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid User ID format.' });
    }

    const MIN_INVESTMENT_AMOUNT = 30;
    if (amount < MIN_INVESTMENT_AMOUNT) {
      return res.status(400).json({ success: false, message: `Minimum investment amount is ${MIN_INVESTMENT_AMOUNT}.` });
    }

    // Determine ROI percentages based on amount
    if (amount >= 30 && amount <= 4999) {
      roiPercentageMin = 1;
      roiPercentageMax = 3;
    } else if (amount >= 5000 && amount <= 9999) {
      roiPercentageMin = 3;
      roiPercentageMax = 5;
    } else if (amount >= 10000 && amount <= 14999) {
      roiPercentageMin = 5;
      roiPercentageMax = 7;
    } else if (amount >= 15000) {
      roiPercentageMin = 7;
      roiPercentageMax = 10;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid investment amount provided.' });
    }

    // Find the investing user
    const investingUser = await User.findById(userId);
    if (!investingUser) {
      return res.status(404).json({ success: false, message: 'Investing user not found.' });
    }

    // 2. Create Investment Document
    const newInvestment = new Investment({
      userId: investingUser._id,
      amount: amount,
      startDate: new Date(),
      roiPercentageMin: roiPercentageMin,
      roiPercentageMax: roiPercentageMax,
      status: 'active'
    });
    await newInvestment.save();

    // 3. Create Deposit Transaction for the Investment
    const depositTransaction = new Transaction({
      userId: investingUser._id,
      type: 'deposit',
      amount: amount,
      transactionDate: new Date(),
      status: 'completed',
      relatedEntityId: newInvestment._id,
      txnId: generateTxnId("deposit"),
    });
    await depositTransaction.save();

    // Update the investing user's wallet balance
    investingUser.walletBalance += amount;
    await investingUser.save();

    // 4. Distribute 5% Direct Referral Bonus to Parent
    let referralBonusDetails = null;
    if (investingUser.referredBy) {
      const referrerUser = await User.findById(investingUser.referredBy);
      if (referrerUser) {
        const bonusAmount = amount * 0.05;

        // Create Direct Referral Bonus Transaction for the referrer
        const referralBonusTransaction = new Transaction({
          userId: referrerUser._id,
          type: 'direct_referral_bonus',
          amount: bonusAmount,
          transactionDate: new Date(),
          status: 'completed',
          relatedEntityId: newInvestment._id,
          txnId: generateTxnId("direct_referral_bonus"),
          adminActionNotes: `Direct referral bonus for new investment by ${investingUser.name || investingUser.email}`
        });
        await referralBonusTransaction.save();

        // Update referrer's wallet balance
        referrerUser.walletBalance += bonusAmount;
        await referrerUser.save();

        referralBonusDetails = {
          referrerId: referrerUser._id,
          bonusAmount: bonusAmount,
          status: 'credited'
        };
      }
    }

    res.status(201).json({
      success: true,
      message: 'Investment created and deposit processed successfully.',
      investment: newInvestment,
      depositTransaction: depositTransaction,
      referralBonus: referralBonusDetails
    });

  } catch (error) {
    console.error('Error creating investment or processing bonus:', error);
    res.status(500).json({ success: false, message: 'Server error during investment creation.', error: error.message });
  }
};

/**
 * Allows a user to raise a new withdrawal request.
 * The requested amount, minus a 5% transaction fee, is deducted from the user's wallet.
 * A new transaction with 'pending' status is created, recording the fee applied.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.body - The request body containing withdrawal details.
 * @param {string} req.body.userId - The ID of the user requesting the withdrawal.
 * @param {number} req.body.amount - The gross amount the user wishes to withdraw.
 * @param {string} req.body.cryptoWalletAddress - The crypto wallet address for the withdrawal.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the withdrawal request is created.
 * @throws {Error} If the user is not found, insufficient balance, or any transaction fails.
 */
export const raiseWithdrawalRequest = async (req, res) => {
  // Use MongoDB transactions for atomicity for wallet deduction and transaction creation
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    const { userId, amount, cryptoWalletAddress } = req.body;
    const TRANSACTION_FEE_PERCENTAGE = 0.05; // 5% fee

    // Input Validation
    if (!userId || !amount || amount <= 0 || !cryptoWalletAddress) {
      return res.status(400).json({ success: false, message: 'Missing required withdrawal fields (userId, amount, cryptoWalletAddress).' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid User ID format.' });
    }

    const user = await User.findById(userId); // .session(session);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Calculate fee and total amount to deduct
    const adminFeeApplied = amount * TRANSACTION_FEE_PERCENTAGE;
    const totalAmountToDeduct = amount + adminFeeApplied; // User pays the fee on top of withdrawal amount

    // Check for sufficient balance
    if (user.walletBalance < totalAmountToDeduct) {
      return res.status(400).json({ success: false, message: `Insufficient wallet balance. You need $${totalAmountToDeduct.toFixed(2)} (including $${adminFeeApplied.toFixed(2)} fee) to withdraw $${amount.toFixed(2)}.` });
    }

    // Deduct total amount from user's wallet
    user.walletBalance -= totalAmountToDeduct;
    await user.save(); // .session(session);

    // Create a new pending withdrawal transaction
    const withdrawalTransaction = new Transaction({
      userId: user._id,
      type: 'withdrawal',
      amount: amount, // The amount the user requested to withdraw
      transactionDate: new Date(),
      status: 'pending', // Initial status is pending
      cryptoWalletAddress: cryptoWalletAddress,
      txnId: generateTxnId("WDR"),
      adminFeeApplied: adminFeeApplied.toFixed(2), // Store the calculated fee
      adminActionNotes: `Withdrawal request for $${amount.toFixed(2)}. Fee applied: $${adminFeeApplied.toFixed(2)}.`
    });
    await withdrawalTransaction.save(); // .session(session);

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully. Amount deducted from wallet.',
      withdrawalRequest: withdrawalTransaction,
      currentWalletBalance: user.walletBalance
    });

  } catch (error) {
    console.error('Error raising withdrawal request:', error);
    res.status(500).json({ success: false, message: 'Server error while raising withdrawal request.', error: error.message });
  }
};

/**
 * Retrieves the withdrawal history for a specific user.
 * Includes all statuses of withdrawal transactions for that user.
 * Supports date range filtering and pagination.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.query - The request query parameters for filters and pagination.
 * @param {string} req.query.userId - The ID of the user for whom to retrieve the withdrawal history.
 * @param {string} [req.query.startDate] - Optional start date for filtering transactions (ISO 8601 format).
 * @param {string} [req.query.endDate] - Optional end date for filtering transactions (ISO 8601 format).
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Number of items per page for pagination.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the history is sent.
 * @throws {Error} If the user is not found or a server error occurs.
 */
export const getWithdrawalHistory = async (req, res) => {
  try {
    const { userId, startDate, endDate, page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required in query parameters.' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid User ID format.' });
    }
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const query = {
      userId: userId,
      type: 'withdrawal',
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

    const withdrawalHistory = await Transaction.find(query)
      .select('amount transactionDate status type txnId cryptoWalletAddress adminFeeApplied adminActionNotes')
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: withdrawalHistory,
      pagination: {
        total: totalTransactions,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalTransactions / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching withdrawal history:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching withdrawal history.', error: error.message });
  }
};

/**
 * Retrieves all pending withdrawal requests for administrative review.
 * Supports date range filtering and pagination.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.query - The request query parameters for filters and pagination.
 * @param {string} [req.query.startDate] - Optional start date for filtering requests (ISO 8601 format).
 * @param {string} [req.query.endDate] - Optional end date for filtering requests (ISO 8601 format).
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Number of items per page for pagination.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the requests are sent.
 * @throws {Error} If a server error occurs.
 */
export const getAllPendingWithdrawalRequests = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = {
      type: 'withdrawal',
      status: 'pending',
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
    const totalRequests = await Transaction.countDocuments(query);

    const pendingWithdrawals = await Transaction.find(query)
      .populate('userId', 'name email walletBalance') // Populate user details for admin
      .select('amount transactionDate status type txnId cryptoWalletAddress adminFeeApplied adminActionNotes')
      .sort({ transactionDate: 1 }) // Oldest pending requests first
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: pendingWithdrawals,
      pagination: {
        total: totalRequests,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalRequests / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching all pending withdrawal requests:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching pending withdrawal requests.', error: error.message });
  }
};

/**
 * Approves a pending withdrawal request.
 * Sets the transaction status to 'completed'. The amount is NOT credited back
 * to the user's wallet as it was already deducted upon request.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.body - The request body.
 * @param {string} req.body.transactionId - The ID of the withdrawal transaction to approve.
 * @param {string} [req.body.adminNotes] - Optional notes from the admin.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the request is approved.
 * @throws {Error} If the transaction is not found, not pending, or a server error occurs.
 */
export const approveWithdrawalRequest = async (req, res) => {
  try {
    const { transactionId, adminNotes } = req.body;

    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Transaction ID is required.' });
    }
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ success: false, message: 'Invalid Transaction ID format.' });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Withdrawal transaction not found.' });
    }
    if (transaction.type !== 'withdrawal') {
      return res.status(400).json({ success: false, message: 'Transaction is not a withdrawal request.' });
    }
    if (transaction.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Withdrawal request status is '${transaction.status}', cannot be approved.` });
    }

    transaction.status = 'completed';
    transaction.adminActionNotes = adminNotes || 'Approved by admin.';
    await transaction.save();

    res.status(200).json({
      success: true,
      message: 'Withdrawal request approved successfully.',
      approvedTransaction: transaction
    });

  } catch (error) {
    console.error('Error approving withdrawal request:', error);
    res.status(500).json({ success: false, message: 'Server error while approving withdrawal request.', error: error.message });
  }
};

/**
 * Rejects a pending withdrawal request.
 * Sets the transaction status to 'failed' and credits the amount back to the user's wallet.
 *
 * @param {object} req - The Express request object.
 * @param {object} req.body - The request body.
 * @param {string} req.body.transactionId - The ID of the withdrawal transaction to reject.
 * @param {string} [req.body.adminNotes] - Optional notes from the admin.
 * @param {object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the request is rejected and amount credited.
 * @throws {Error} If the transaction is not found, not pending, or a server error occurs.
 */
export const rejectWithdrawalRequest = async (req, res) => {
  // Use MongoDB transactions for atomicity for wallet credit and transaction status update
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    const { transactionId, adminNotes } = req.body;

    if (!transactionId) {
      // await session.abortTransaction(); session.endSession();
      return res.status(400).json({ success: false, message: 'Transaction ID is required.' });
    }
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      // await session.abortTransaction(); session.endSession();
      return res.status(400).json({ success: false, message: 'Invalid Transaction ID format.' });
    }

    const transaction = await Transaction.findById(transactionId); // .session(session);
    if (!transaction) {
      // await session.abortTransaction(); session.endSession();
      return res.status(404).json({ success: false, message: 'Withdrawal transaction not found.' });
    }
    if (transaction.type !== 'withdrawal') {
      // await session.abortTransaction(); session.endSession();
      return res.status(400).json({ success: false, message: 'Transaction is not a withdrawal request.' });
    }
    if (transaction.status !== 'pending') {
      // await session.abortTransaction(); session.endSession();
      return res.status(400).json({ success: false, message: `Withdrawal request status is '${transaction.status}', cannot be rejected.` });
    }

    const user = await User.findById(transaction.userId); // .session(session);
    if (!user) {
      // await session.abortTransaction(); session.endSession();
      // This is a critical error: user associated with transaction not found.
      console.error(`User with ID ${transaction.userId} not found for transaction ${transactionId}`);
      return res.status(500).json({ success: false, message: 'Associated user not found for this withdrawal request.' });
    }

    // Credit amount back to user's wallet
    user.walletBalance += transaction.amount;
    await user.save(); // .session(session);

    // Update transaction status
    transaction.status = 'failed'; // Or 'cancelled', based on your preference
    transaction.adminActionNotes = adminNotes || 'Rejected by admin. Amount credited back to wallet.';
    await transaction.save(); // .session(session);

    // await session.commitTransaction();
    // session.endSession();

    res.status(200).json({
      success: true,
      message: 'Withdrawal request rejected successfully. Amount credited back to user wallet.',
      rejectedTransaction: transaction,
      currentWalletBalance: user.walletBalance
    });

  } catch (error) {
    // await session.abortTransaction(); session.endSession();
    console.error('Error rejecting withdrawal request:', error);
    res.status(500).json({ success: false, message: 'Server error while rejecting withdrawal request.', error: error.message });
  }
};
