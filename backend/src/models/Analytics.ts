import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  totalChallenges: number;
  totalParticipants: number;
  completedChallenges: number;
  openChallenges: number;
  ongoingChallenges: number;
  challengeGrowthRate: number;
  participantGrowthRate: number;
  lastUpdated: Date;
  periodStats: {
    period: 'day' | 'week' | 'month';
    challengesCreated: number;
    participantsJoined: number;
    submissionsMade: number;
  }[];
}

const analyticsSchema = new Schema<IAnalytics>({
  totalChallenges: {
    type: Number,
    default: 0
  },
  totalParticipants: {
    type: Number,
    default: 0
  },
  completedChallenges: {
    type: Number,
    default: 0
  },
  openChallenges: {
    type: Number,
    default: 0
  },
  ongoingChallenges: {
    type: Number,
    default: 0
  },
  challengeGrowthRate: {
    type: Number,
    default: 0
  },
  participantGrowthRate: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  periodStats: [{
    period: {
      type: String,
      enum: ['day', 'week', 'month'],
      required: true
    },
    challengesCreated: {
      type: Number,
      default: 0
    },
    participantsJoined: {
      type: Number,
      default: 0
    },
    submissionsMade: {
      type: Number,
      default: 0
    }
  }]
});

export const Analytics = mongoose.model<IAnalytics>('Analytics', analyticsSchema);