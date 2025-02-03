import { Challenge } from '../models/Challenge';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export const searchService = {
  async searchChallenges(query: any) {
    try {
      const {
        searchTerm,
        skills,
        seniorityLevel,
        status,
        duration,
        page = 1,
        limit = 10
      } = query;

      const filter: any = {};

      if (searchTerm) {
        filter.$or = [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ];
      }

      if (skills) {
        filter.skillsNeeded = { $in: Array.isArray(skills) ? skills : [skills] };
      }

      if (seniorityLevel) {
        filter.seniorityLevel = seniorityLevel;
      }

      if (status) {
        filter.status = status;
      }

      if (duration) {
        filter.duration = { $lte: parseInt(duration) };
      }

      const skip = (page - 1) * limit;

      const challenges = await Challenge.find(filter)
        .populate('createdBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Challenge.countDocuments(filter);

      return {
        challenges,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      };
    } catch (error) {
      logger.error('Search challenges error:', error);
      throw error;
    }
  }
};