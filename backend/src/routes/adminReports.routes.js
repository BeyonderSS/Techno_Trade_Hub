import { getAdminReferralBonusDistributionReport,
    getAdminWeeklyBonusDistributionReport,
    getTopPerformingTeamsReport,
    getAdminSalaryDistributionReport,
    getAdminWithdrawalDistributionReport } from "../controllers/adminReport.controller.js";
    import express from "express";
    const router = express.Router();
    

    router.post("/referral-bonus",getAdminReferralBonusDistributionReport);
    router.post("/weekly-bonus",getAdminWeeklyBonusDistributionReport);
    router.post("/monthly-salary",getAdminSalaryDistributionReport);
    router.post("/team-performance",getTopPerformingTeamsReport);
    router.post("/withdrawn-distribution",getAdminWithdrawalDistributionReport);
    // router.post("/referral-bonus-distribution",getAdminReferralBonusDistributionReport);
 export default router;