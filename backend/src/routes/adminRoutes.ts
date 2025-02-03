import express from 'express';
import { adminController } from '../controllers/adiminController';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', auth, adminAuth, adminController.getDashboardStats);
router.get('/users', auth, adminAuth, adminController.manageUsers);

export default router;