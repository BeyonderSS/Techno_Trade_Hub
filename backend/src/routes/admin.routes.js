// routes/adminRoutes.js (Example)
import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js'; // Your auth middlewares
import { getAdminHome, getAllUsers, getParticularUserDetail } from '../controllers/admin.controller.js';

const router = express.Router();

// Protect this route and ensure only 'admin' roles can access it
router.get('/home', protect, authorize('admin'), getAdminHome);
router.get('/all-users', protect, authorize('admin'), getAllUsers);
router.get('/user/:id', protect, authorize('admin'), getParticularUserDetail);

export default router;