import express from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, analyticsController.getAnalytics);
router.post('/update', auth, adminAuth, analyticsController.updateAnalytics);

export default router;