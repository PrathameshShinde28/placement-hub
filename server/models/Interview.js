import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    interviewType: {
      type: String,
      enum: ['technical', 'behavioral', 'hr'],
      default: 'technical',
    },
    questionCategory: String,
    question: String,
    userAnswer: String,
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive'
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    aiEvaluation: {
      score: Number,
      feedback: String,
      suggestions: [String],
    },
    duration: Number, // in seconds
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Interview', interviewSchema);
