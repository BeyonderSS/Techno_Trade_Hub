import { getAllTransactionsForAdmin,getUserTransactions } from "../controllers/transaction.controller";
import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
const router = express.Router();


router.get("/admin", protect, authorize, getAllTransactionsForAdmin);
router.get("/user", protect, getUserTransactions);