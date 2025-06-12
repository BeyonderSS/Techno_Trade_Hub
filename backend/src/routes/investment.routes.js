import express from "express";
import {
  getAllWithdrawals,
  createInvestment,
  raiseWithdrawalRequest,
  getWithdrawalHistory,
  getAllPendingWithdrawalRequests,
  approveWithdrawalRequest,
  rejectWithdrawalRequest,
} from "../controllers/investment.controller.js"; // Adjust path as needed

const router = express.Router();

/**
 * @file Investment Routes
 * @description Defines API routes for investment and withdrawal functionalities.
 */

/**
 * GET /api/investments/withdrawals
 * Retrieves all completed withdrawal transactions.
 * Optional query parameters: userId, startDate, endDate, page, limit.
 */
router.get("/withdrawals", getAllWithdrawals);

/**
 * POST /api/investments/create
 * Creates a new investment document and handles the associated deposit transaction.
 * Automatically determines ROI percentages based on the investment amount.
 * Distributes a 5% direct referral bonus to the user's referrer.
 */
router.post("/create", createInvestment);

/**
 * POST /api/investments/request-withdrawal
 * Allows a user to raise a new withdrawal request.
 * The requested amount is immediately deducted from the user's wallet balance,
 * and a new transaction with 'pending' status is created.
 */
router.post("/request-withdrawal", raiseWithdrawalRequest);

/**
 * GET /api/investments/history/:userId
 * Retrieves the withdrawal history for a specific user, including all statuses.
 * Supports date range filtering and pagination.
 */
router.get("/history", getWithdrawalHistory); // userId will be in query param for consistency

/**
 * GET /api/investments/pending-requests
 * Retrieves all pending withdrawal requests for administrative review.
 * Supports date range filtering and pagination.
 */
router.get("/pending-requests", getAllPendingWithdrawalRequests);

/**
 * POST /api/investments/approve-withdrawal
 * Approves a pending withdrawal request.
 * Sets the transaction status to 'completed'. The amount is NOT credited back.
 */
router.post("/approve-withdrawal", approveWithdrawalRequest);

/**
 * POST /api/investments/reject-withdrawal
 * Rejects a pending withdrawal request.
 * Sets the transaction status to 'failed' and credits the amount back to the user's wallet.
 */
router.post("/reject-withdrawal", rejectWithdrawalRequest);

export default router;
