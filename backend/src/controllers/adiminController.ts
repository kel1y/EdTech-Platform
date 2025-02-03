import { Request, Response } from 'express';
import { User } from '../models/User';
import { Challenge } from '../models/Challenge';
import { Submission } from '../models/Submission';
import { Analytics } from '../models/Analytics';
import { logger } from '../utils/logger';

export const adminController = {
  async getDashboardStats(req: Request, res: Response) {
    try {
      const [
        totalUsers,
        totalChallenges,
        totalSubmissions,
        recentUsers,
        recentChallenges,
        analytics
      ] = await Promise.all([
        User.countDocuments(),
        Challenge.countDocuments(),
        Submission.countDocuments(),
        User.find().sort({ createdAt: -1 }).limit(5),
        Challenge.find().sort({ createdAt: -1 }).limit(5),
        Analytics.findOne().sort({ lastUpdated: -1 })
      ]);

      res.json({
        stats: {
          totalUsers,
          totalChallenges,
          totalSubmissions
        },
        recentActivity: {
          users: recentUsers,
          challenges: recentChallenges
        },
        analytics
      });
    } catch (error) {
      logger.error('Get dashboard stats error:', error);
      res.status(500).json({ error: 'Error fetching dashboard stats' });
    }
  },

  async manageUsers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, role, searchTerm } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const filter: any = {};
      if (role) filter.role = role;
      if (searchTerm) {
        filter.$or = [
          { firstName: { $regex: searchTerm, $options: 'i' } },
          { lastName: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } }
        ];
      }

      const [users, total] = await Promise.all([
        User.find(filter)
          .select('-password')
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 }),
        User.countDocuments(filter)
      ]);

      res.json({
        users,
        total,
        pages: Math.ceil(total / Number(limit)),
        currentPage: page
      });
    } catch (error) {
      logger.error('Manage users error:', error);
      res.status(500).json({ error: 'Error managing users' });
    }
  }
};