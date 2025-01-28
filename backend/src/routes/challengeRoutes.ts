import express from 'express';
import { challengeController } from '../controllers/challengeController';
import { auth, adminAuth } from '../middleware/auth';
import { validateChallenge } from '../middleware/validation';

const router = express.Router();

router.post('/', auth, adminAuth, validateChallenge, challengeController.createChallenge);
router.get('/', challengeController.getAllChallenges);
router.get('/:id', challengeController.getChallengeById);
router.put('/:id', auth, adminAuth, validateChallenge, challengeController.updateChallenge);
router.delete('/:id', auth, adminAuth, challengeController.deleteChallenge);
router.post('/:id/join', auth, challengeController.joinChallenge);

export default router;