import { getUserHome } from "../controllers/user.controller.js";
import express from "express";
const router = express.Router();


import {protect} from "../middlewares/auth.middleware.js";


router.get("/home",protect,getUserHome);

export default router;