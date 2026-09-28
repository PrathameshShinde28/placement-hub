import mongoose from 'mongoose';

const interviewQuestionSchema = new mongoose.Schema(
  {
    mockInterviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MockInterview',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questionNumber: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    expectedAnswer: {
      type: String,
      default: '',
    },
    studentVoiceUrl: {
      type: String,
      default: null,
    },
    studentTranscription: {
      type: String,
      default: '',
    },
    studentAnswer: {
      type: String,
      default: '',
    },
    recordingDuration: {
      type: Number, // in seconds
      default: 0,
    },
    answered: {
      type: Boolean,
      default: false,
    },
    skipped: {
      type: Boolean,
      default: false,
    },
    feedback: {
      type: {
        technicalAccuracy: {
          score: Number, // 0-10
          comment: String,
        },
        communicationSkills: {
          score: Number, // 0-10
          comment: String,
        },
        confidence: {
          score: Number, // 0-10
          comment: String,
        },
        fluency: {
          score: Number, // 0-10
          comment: String,
        },
        clarity: {
          score: Number, // 0-10
          comment: String,
        },
        overallScore: Number, // 0-100
        strengths: [String],
        improvements: [String],
        suggestedAnswer: String,
        keyPoints: [String],
      },
      default: null,
    },
    isFollowUp: {
      type: Boolean,
      default: false,
    },
    parentQuestionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewQuestion',
      default: null,
    },
    answeredAt: Date,
  },
  { timestamps: true }
);

interviewQuestionSchema.index({ mockInterviewId: 1, questionNumber: 1 });
interviewQuestionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('InterviewQuestion', interviewQuestionSchema);
