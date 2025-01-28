import { Request, Response } from 'express';
import { Challenge, IChallenge } from '../models/challenge';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export const challengeController = {
  // Create a new challenge
  async createChallenge(req: Request, res: Response) {
    try {
      const challengeData: IChallenge = req.body;
      challengeData.createdBy = req.user._id;

      const challenge = new Challenge(challengeData);
      await challenge.save();

      res.status(201).json(challenge);
    } catch (error) {
      logger.error('Create challenge error:', error);
      res.status(500).json({ error: 'Error creating challenge' });
    }
  },

  // Get all challenges
  async getAllChallenges(req: Request, res: Response) {
    try {
      const challenges = await Challenge.find()
        .populate('createdBy', 'firstName lastName')
        .sort({ createdAt: -1 });

      res.json(challenges);
    } catch (error) {
      logger.error('Get all challenges error:', error);
      res.status(500).json({ error: 'Error fetching challenges' });
    }
  },

  // Get a single challenge by ID
  async getChallengeById(req: Request, res: Response) {
    try {
      const challenge = await Challenge.findById(req.params.id)
        .populate('createdBy', 'firstName lastName')
        .populate('participants', 'firstName lastName')
        .populate('submissions');

      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }

      res.json(challenge);
    } catch (error) {
      logger.error('Get challenge by ID error:', error);
      res.status(500).json({ error: 'Error fetching challenge' });
    }
  },

  // Update a challenge
  async updateChallenge(req: Request, res: Response) {
    try {
      const challenge = await Challenge.findById(req.params.id);

      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }

      // Check if the user is the creator of the challenge or an admin
      if (challenge.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to update this challenge' });
      }

      const updatedChallenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedChallenge);
    } catch (error) {
      logger.error('Update challenge error:', error);
      res.status(500).json({ error: 'Error updating challenge' });
    }
  },

  // Delete a challenge
  async deleteChallenge(req: Request, res: Response) {
    try {
      const challenge = await Challenge.findById(req.params.id);

      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }

      // Check if the user is the creator of the challenge or an admin
      if (challenge.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to delete this challenge' });
      }

      await Challenge.findByIdAndDelete(req.params.id);
      res.json({ message: 'Challenge deleted successfully' });
    } catch (error) {
      logger.error('Delete challenge error:', error);
      res.status(500).json({ error: 'Error deleting challenge' });
    }
  },

  // Join a challenge
  async joinChallenge(req: Request, res: Response) {
    try {
      const challenge = await Challenge.findById(req.params.id);

      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }

      if (challenge.status !== 'Open') {
        return res.status(400).json({ error: 'This challenge is not open for participation' });
      }

      if (challenge.participants.includes(req.user._id)) {
        return res.status(400).json({ error: 'You have already joined this challenge' });
      }

      challenge.participants.push(req.user._id);
      await challenge.save();

      // Update user's ongoingChallenges
      await User.findByIdAndUpdate(req.user._id, {
        $push: { ongoingChallenges: challenge._id }
      });

      res.json({ message: 'Successfully joined the challenge', challenge });
    } catch (error) {
      logger.error('Join challenge error:', error);
      res.status(500).json({ error: 'Error joining challenge' });
    }
  }
};