import express from "express";
import helloRouter from "./hello.route.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import adminRoutes from './adminRoutes.js';
// Import other route modules here as they are created
// import userRouter from "./user.route.js";
import reportRouter from "./report.routes.js"
import investmentRouter from "./investment.routes.js"
const router = express.Router();

// Mount the routers
router.use("/hello", helloRouter);
router.use("/reports",reportRouter)
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/investments",investmentRouter)
router.use("/investment",investmentRouter)
router.use('/admin', adminRoutes);

// router.use("/users", userRouter);

export default router;
