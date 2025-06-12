import express from "express";
import {
  getReferralIncomeReport,
  getSalaryIncomeReport,
  getTeamPerformanceReport,
  getLevelIncomeReport,
  getWeeklyBonusReport,
  getTradeHistoryReport,
} from "../controllers/reports.controller.js"; // Adjust path as needed

const router = express.Router();

/**
 * @file Reports Routes
 * @description Defines API routes for various financial and performance reports.
 */

// POST /api/reports/referral-income - Get direct referral income report for a user
router.post("/referral-income", getReferralIncomeReport);

// POST /api/reports/salary-income - Get monthly salary income report for a user
router.post("/salary-income", getSalaryIncomeReport);

// POST /api/reports/team-performance - Get team performance report for a user's downline
router.post("/team-performance", getTeamPerformanceReport);

// POST /api/reports/level-income - Get level income report for a user
router.post("/level-income", getLevelIncomeReport);

// POST /api/reports/weekly-bonus - Get weekly bonus report for a user
router.post("/weekly-bonus", getWeeklyBonusReport);

// POST /api/reports/trade-history - Get trade history (ROI payout) report for a user
router.post("/trade-history", getTradeHistoryReport);

export default router;
