import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: 'challenge' | 'submission' | 'system';
  title: string;
  message: string;
  read: boolean;
  relatedChallenge?: mongoose.Types.ObjectId;
  relatedSubmission?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['challenge', 'submission', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedChallenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  relatedSubmission: {
    type: Schema.Types.ObjectId,
    ref: 'Submission'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);