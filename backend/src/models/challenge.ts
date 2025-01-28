import mongoose, { Document, Schema } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  description: string;
  company: string;
  skillsNeeded: string[];
  seniorityLevel: 'Junior' | 'Intermediate' | 'Senior';
  duration: number; // in days
  prize: {
    min: number;
    max: number;
  };
  status: 'Open' | 'Closed' | 'Completed';
  participants: mongoose.Types.ObjectId[];
  submissions: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const challengeSchema = new Schema<IChallenge>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  skillsNeeded: [{
    type: String,
    required: true
  }],
  seniorityLevel: {
    type: String,
    enum: ['Junior', 'Intermediate', 'Senior'],
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  prize: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Completed'],
    default: 'Open'
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  submissions: [{
    type: Schema.Types.ObjectId,
    ref: 'Submission'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const Challenge = mongoose.model<IChallenge>('Challenge', challengeSchema);