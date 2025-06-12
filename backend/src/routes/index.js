import express from "express";
import helloRouter from "./hello.route.js";
// Import other route modules here as they are created
// import userRouter from "./user.route.js";
import reportRouter from "./report.routes.js"
const router = express.Router();

// Mount the routers
router.use("/hello", helloRouter);
router.use("/reports",reportRouter)
// router.use("/users", userRouter);

export default router;
