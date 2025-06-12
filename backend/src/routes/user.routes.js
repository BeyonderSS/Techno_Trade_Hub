import { getUserHome } from "../controllers/user.controller";
import express from "express";
const router = express.Router();


import {protect} from "../middlewares/auth.middleware";


router.get("/home",protect,getUserHome);

export default router;