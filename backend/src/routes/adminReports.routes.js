import { getAdminReferralBonusDistributionReport,
    getAdminWeeklyBonusDistributionReport,
    getTopPerformingTeamsReport,
    getAdminSalaryDistributionReport,
    getAdminWithdrawalDistributionReport } from "../controllers/adminReport.controller.js";
    import express from "express";
    const router = express.Router();
    

    router.get("/referral-bonus",getAdminReferralBonusDistributionReport);
    router.get("/weekly-bonus",getAdminWeeklyBonusDistributionReport);
    router.get("/monthly-salary",getAdminSalaryDistributionReport);
    router.get("/team-performance",getTopPerformingTeamsReport);
    router.get("/withdrawn-distribution",getAdminWithdrawalDistributionReport);
    // router.post("/referral-bonus-distribution",getAdminReferralBonusDistributionReport);
 export default router;