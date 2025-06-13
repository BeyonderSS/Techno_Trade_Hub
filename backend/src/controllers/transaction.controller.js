// controllers/transaction.controller.js
import { Transaction } from "../models/Transaction.model.js";
import { User } from "../models/User.model.js"; // Needed for user-specific queries
import mongoose from "mongoose";

/**
 * @desc Get all transactions for admin with optional date filters
 * @route GET /api/admin/transactions
 * @access Private/Admin
 */
export const getAllTransactionsForAdmin = async (req, res) => {
  try {
    const { filter } = req.query; // 'today', 'weekly', 'monthly', or undefined

    let query = {};
    const now = new Date();

    if (filter === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      query.createdAt = { $gte: startOfDay, $lte: now };
    } else if (filter === 'weekly') {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);
      query.createdAt = { $gte: startOfWeek, $lte: new Date() };
    } else if (filter === 'monthly') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      query.createdAt = { $gte: startOfMonth, $lte: new Date() };
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    console.error("Error fetching all transactions for admin:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc Get transactions for a particular user with optional date filters
 * @route GET /api/user/transactions
 * @access Private
 */
export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user._id; // User ID from the protect middleware
    const { filter } = req.query; // 'today', 'weekly', 'monthly', or undefined

    let query = { userId };
    const now = new Date();

    if (filter === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      query.createdAt = { $gte: startOfDay, $lte: now };
    } else if (filter === 'weekly') {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);
      query.createdAt = { $gte: startOfWeek, $lte: new Date() };
    } else if (filter === 'monthly') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      query.createdAt = { $gte: startOfMonth, $lte: new Date() };
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    res.status(500).json({ message: "Server Error" });
  }
};