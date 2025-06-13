// routes/adminRoutes.js (Example)
import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js'; // Your auth middlewares
import { getAdminHome } from '../controllers/admin.controller.js';

const router = express.Router();

// Protect this route and ensure only 'admin' roles can access it
router.get('/home', protect, authorize('admin'), getAdminHome);

export default router;