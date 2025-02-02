import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';
import { logger } from '../utils/logger';

export const analyticsController = {
  async getAnalytics(req: Request, res: Response) {
    try {
      const analytics = await analyticsService.getAnalytics();
      res.json(analytics);
    } catch (error) {
      logger.error('Get analytics error:', error);
      res.status(500).json({ error: 'Error fetching analytics' });
    }
  },

  async updateAnalytics(req: Request, res: Response) {
    try {
      await analyticsService.updateAnalytics();
      res.json({ message: 'Analytics updated successfully' });
    } catch (error) {
      logger.error('Update analytics error:', error);
      res.status(500).json({ error: 'Error updating analytics' });
    }
  }
};