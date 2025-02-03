import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
  challenge: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  submission: mongoose.Types.ObjectId;
  score: number;
  feedback: string;
  createdAt: Date;
}

const ratingSchema = new Schema<IRating>({
  challenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submission: {
    type: Schema.Types.ObjectId,
    ref: 'Submission',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Rating = mongoose.model<IRating>('Rating', ratingSchema);