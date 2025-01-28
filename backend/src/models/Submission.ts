import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  challenge: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  attachments: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
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
  content: {
    type: String,
    required: true
  },
  attachments: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  feedback: {
    type: String
  }
}, {
  timestamps: true
});

export const Submission = mongoose.model<ISubmission>('Submission', submissionSchema);