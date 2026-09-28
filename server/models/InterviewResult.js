import mongoose from 'mongoose';

const interviewResultSchema = new mongoose.Schema(
  {
    mockInterviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MockInterview',
      required: true,
      index: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    interviewType: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    answeredQuestions: {
      type: Number,
      default: 0,
    },
    skippedQuestions: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: Number, // in seconds
      default: 0,
    },
    scores: {
      overall: {
        type: Number, // 0-100
        default: 0,
      },
      technical: {
        type: Number, // 0-100
        default: 0,
      },
      communication: {
        type: Number, // 0-100
        default: 0,
      },
      confidence: {
        type: Number, // 0-100
        default: 0,
      },
      fluency: {
        type: Number, // 0-100
        default: 0,
      },
      clarity: {
        type: Number, // 0-100
        default: 0,
      },
      problemSolving: {
        type: Number, // 0-100
        default: 0,
      },
    },
    recommendation: {
      type: String,
      enum: ['Excellent', 'Good', 'Needs Improvement', 'Poor'],
      default: 'Needs Improvement',
    },
    summary: {
      type: String,
      default: '',
    },
    strengths: [String],
    weaknesses: [String],
    improvementAreas: [String],
    improvementTips: [String],
    questionPerformance: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        score: Number,
        status: {
          type: String,
          enum: ['excellent', 'good', 'average', 'poor'],
        },
      },
    ],
    certificateData: {
      certificateId: String,
      certificateUrl: String,
      percentile: Number,
      badge: String,
    },
    completedAt: Date,
  },
  { timestamps: true }
);

interviewResultSchema.index({ userId: 1, createdAt: -1 });
interviewResultSchema.index({ interviewType: 1, difficulty: 1 });

export default mongoose.model('InterviewResult', interviewResultSchema);
