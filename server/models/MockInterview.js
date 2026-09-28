import mongoose from 'mongoose';

const mockInterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    interviewType: {
      type: String,
      enum: [
        'HR Interview',
        'Technical Interview',
        'Aptitude Discussion',
        'Behavioral Interview',
        'System Design Interview',
        'Java Interview',
        'React Interview',
        'Node.js Interview',
        'Database Interview',
        'DSA Interview',
        'Full Stack Interview',
      ],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    domain: {
      type: String,
      default: 'General',
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    actualDuration: {
      type: Number, // actual duration taken in seconds
      default: 0,
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    questionsCount: {
      type: Number,
      default: 0,
    },
    answeredCount: {
      type: Number,
      default: 0,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InterviewQuestion',
      },
    ],
    interviewResult: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewResult',
      default: null,
    },
    startedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

// Index for faster queries
mockInterviewSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('MockInterview', mockInterviewSchema);
