import express from 'express';
import { authController } from '../controllers/authController';
import { auth } from '../middleware/auth';
import { validateRegistration, validateLogin } from '../middleware/validation';

const router = express.Router();

router.post('/register',validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', auth, authController.getCurrentUser);

export default router;