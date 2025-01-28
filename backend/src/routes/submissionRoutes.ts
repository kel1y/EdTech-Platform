import express from 'express';
import { submissionController } from '../controllers/submissionController';
import { auth, adminAuth } from '../middleware/auth';
import { validateSubmission, validateSubmissionUpdate } from '../middleware/validation';

const router = express.Router();

router.post('/:challengeId', auth, validateSubmission, submissionController.createSubmission);
router.get('/challenge/:challengeId', auth, submissionController.getSubmissionsByChallenge);
router.get('/:id', auth, submissionController.getSubmissionById);
router.put('/:id', auth, validateSubmissionUpdate, submissionController.updateSubmission);
router.delete('/:id', auth, adminAuth, submissionController.deleteSubmission);

export default router;