import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { logger } from '../utils/logger';

export const userController = {
  // Get user profile
  async getUserProfile(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user._id)
        .select('-password')
        .populate('completedChallenges', 'title company')
        .populate('ongoingChallenges', 'title company');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      logger.error('Get user profile error:', error);
      res.status(500).json({ error: 'Error fetching user profile' });
    }
  },

  // Update user profile
  async updateUserProfile(req: Request, res: Response) {
    try {
      const updates: Partial<IUser> = req.body;
      const allowedUpdates = ['firstName', 'lastName', 'bio', 'skills', 'education', 'experience', 'socialLinks'];

      // Filter out any fields that are not allowed to be updated
      const filteredUpdates = Object.keys(updates)
        .filter(key => allowedUpdates.includes(key))
        .reduce((obj, key) => {
          obj[key] = updates[key as keyof IUser];
          return obj;
        }, {} as Partial<IUser>);

      const user = await User.findByIdAndUpdate(req.user._id, filteredUpdates, {
        new: true,
        runValidators: true
      }).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      logger.error('Update user profile error:', error);
      res.status(500).json({ error: 'Error updating user profile' });
    }
  },

  // Update profile picture
  async updateProfilePicture(req: Request, res: Response) {
    try {
      // Assuming the file upload middleware has saved the file and added its path to req.file
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { profilePicture: req.file.path },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'Profile picture updated successfully', user });
    } catch (error) {
      logger.error('Update profile picture error:', error);
      res.status(500).json({ error: 'Error updating profile picture' });
    }
  },

  // Get public profile of a user
  async getPublicProfile(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id)
        .select('firstName lastName profilePicture bio skills education experience socialLinks')
        .populate('completedChallenges', 'title company');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      logger.error('Get public profile error:', error);
      res.status(500).json({ error: 'Error fetching public profile' });
    }
  }
};