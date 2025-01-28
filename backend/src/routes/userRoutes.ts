import express from 'express';
import { userController } from '../controllers/userController';
import { auth } from '../middleware/auth';
import { validateUserProfileUpdate } from '../middleware/validation';
import { upload } from '../middleware/fileUpload';

const router = express.Router();

router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, validateUserProfileUpdate, userController.updateUserProfile);
router.put('/profile/picture', auth, upload.single('profilePicture'), userController.updateProfilePicture);
router.get('/:id/public', userController.getPublicProfile);

export default router;