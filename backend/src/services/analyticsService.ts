import { Analytics } from '../models/Analytics';
import { Challenge } from '../models/Challenge';
import { User } from '../models/User';
import { Submission } from '../models/Submission';
import { logger } from '../utils/logger';

export const analyticsService = {
  async updateAnalytics() {
    try {
      const now = new Date();
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

      // Get current counts
      const [
        totalChallenges,
        totalParticipants,
        completedChallenges,
        openChallenges,
        ongoingChallenges,
        lastMonthChallenges,
        lastMonthParticipants
      ] = await Promise.all([
        Challenge.countDocuments(),
        User.countDocuments({ role: 'user' }),
        Challenge.countDocuments({ status: 'Completed' }),
        Challenge.countDocuments({ status: 'Open' }),
        Challenge.countDocuments({ status: 'Ongoing' }),
        Challenge.countDocuments({ createdAt: { $gte: lastMonth } }),
        User.countDocuments({ role: 'user', createdAt: { $gte: lastMonth } })
      ]);

      // Calculate growth rates
      const challengeGrowthRate = ((lastMonthChallenges / totalChallenges) * 100) - 100;
      const participantGrowthRate = ((lastMonthParticipants / totalParticipants) * 100) - 100;

      // Get period stats
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const [dailyStats, weeklyStats, monthlyStats] = await Promise.all([
        this.getPeriodStats(dayAgo),
        this.getPeriodStats(weekAgo),
        this.getPeriodStats(monthAgo)
      ]);

      // Update analytics
      await Analytics.findOneAndUpdate(
        {},
        {
          totalChallenges,
          totalParticipants,
          completedChallenges,
          openChallenges,
          ongoingChallenges,
          challengeGrowthRate,
          participantGrowthRate,
          lastUpdated: new Date(),
          periodStats: [
            { period: 'day', ...dailyStats },
            { period: 'week', ...weeklyStats },
            { period: 'month', ...monthlyStats }
          ]
        },
        { upsert: true, new: true }
      );

      logger.info('Analytics updated successfully');
    } catch (error) {
      logger.error('Error updating analytics:', error);
      throw error;
    }
  },

  async getPeriodStats(since: Date) {
    const [challengesCreated, participantsJoined, submissionsMade] = await Promise.all([
      Challenge.countDocuments({ createdAt: { $gte: since } }),
      User.countDocuments({ role: 'user', createdAt: { $gte: since } }),
      Submission.countDocuments({ createdAt: { $gte: since } })
    ]);

    return {
      challengesCreated,
      participantsJoined,
      submissionsMade
    };
  },

  async getAnalytics() {
    try {
      const analytics = await Analytics.findOne().sort({ lastUpdated: -1 });
      if (!analytics) {
        await this.updateAnalytics();
        return await Analytics.findOne();
      }
      return analytics;
    } catch (error) {
      logger.error('Error getting analytics:', error);
      throw error;
    }
  }
};