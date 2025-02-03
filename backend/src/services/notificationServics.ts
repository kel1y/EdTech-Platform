import { Notification, INotification } from '../models/Notification';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export const notificationService = {
  async createNotification(data: Partial<INotification>) {
    try {
      const notification = new Notification(data);
      await notification.save();

      // Here you would typically emit a WebSocket event
      // this.emitNotification(notification);

      return notification;
    } catch (error) {
      logger.error('Create notification error:', error);
      throw error;
    }
  },

  async getUserNotifications(userId: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const notifications = await Notification.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('relatedChallenge', 'title')
        .populate('relatedSubmission');

      const total = await Notification.countDocuments({ user: userId });

      return {
        notifications,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      };
    } catch (error) {
      logger.error('Get user notifications error:', error);
      throw error;
    }
  },

  async markAsRead(notificationId: string, userId: string) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { read: true },
        { new: true }
      );

      return notification;
    } catch (error) {
      logger.error('Mark notification as read error:', error);
      throw error;
    }
  }
};