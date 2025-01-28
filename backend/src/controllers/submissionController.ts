import { Request, Response } from 'express';
import { Submission, ISubmission } from '../models/Submission';
import { Challenge } from '../models/Challenge';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export const submissionController = {
  // Create a new submission
  async createSubmission(req: Request, res: Response) {
    try {
      const { challengeId } = req.params;
      const submissionData: Partial<ISubmission> = req.body;
      submissionData.challenge = challengeId;
      submissionData.user = req.user._id;

      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }

      if (challenge.status !== 'Open') {
        return res.status(400).json({ error: 'This challenge is not open for submissions' });
      }

      const submission = new Submission(submissionData);
      await submission.save();

      // Update challenge with the new submission
      await Challenge.findByIdAndUpdate(challengeId, {
        $push: { submissions: submission._id }
      });

      res.status(201).json(submission);
    } catch (error) {
      logger.error('Create submission error:', error);
      res.status(500).json({ error: 'Error creating submission' });
    }
  },

  // Get all submissions for a challenge
  async getSubmissionsByChallenge(req: Request, res: Response) {
    try {
      const { challengeId } = req.params;
      const submissions = await Submission.find({ challenge: challengeId })
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 });

      res.json(submissions);
    } catch (error) {
      logger.error('Get submissions by challenge error:', error);
      res.status(500).json({ error: 'Error fetching submissions' });
    }
  },

  // Get a single submission by ID
  async getSubmissionById(req: Request, res: Response) {
    try {
      const submission = await Submission.findById(req.params.id)
        .populate('user', 'firstName lastName email')
        .populate('challenge', 'title company');

      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      res.json(submission);
    } catch (error) {
      logger.error('Get submission by ID error:', error);
      res.status(500).json({ error: 'Error fetching submission' });
    }
  },

  // Update a submission (only allowed for admins or mentors)
  async updateSubmission(req: Request, res: Response) {
    try {
      const { status, feedback } = req.body;
      const submission = await Submission.findById(req.params.id);

      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      if (req.user.role !== 'admin' && req.user.role !== 'mentor') {
        return res.status(403).json({ error: 'Not authorized to update submissions' });
      }

      submission.status = status || submission.status;
      submission.feedback = feedback || submission.feedback;
      await submission.save();

      // If the submission is approved, update the user's completedChallenges
      if (status === 'Approved') {
        await User.findByIdAndUpdate(submission.user, {
          $addToSet: { completedChallenges: submission.challenge },
          $pull: { ongoingChallenges: submission.challenge }
        });
      }

      res.json(submission);
    } catch (error) {
      logger.error('Update submission error:', error);
      res.status(500).json({ error: 'Error updating submission' });
    }
  },

  // Delete a submission (only allowed for admins)
  async deleteSubmission(req: Request, res: Response) {
    try {
      const submission = await Submission.findById(req.params.id);

      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to delete submissions' });
      }

      await Submission.findByIdAndDelete(req.params.id);

      // Remove the submission from the challenge
      await Challenge.findByIdAndUpdate(submission.challenge, {
        $pull: { submissions: submission._id }
      });

      res.json({ message: 'Submission deleted successfully' });
    } catch (error) {
      logger.error('Delete submission error:', error);
      res.status(500).json({ error: 'Error deleting submission' });
    }
  }
};