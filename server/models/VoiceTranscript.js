import mongoose from 'mongoose';

const voiceTranscriptSchema = new mongoose.Schema(
  {
    interviewQuestionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewQuestion',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    audioBlob: {
      type: Buffer,
      default: null,
    },
    audioUrl: {
      type: String,
      default: null,
    },
    rawTranscription: {
      type: String,
      required: true,
    },
    cleanedTranscription: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in seconds
      required: true,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    confidence: {
      type: Number, // 0-100, speech recognition confidence
      default: 0,
    },
    language: {
      type: String,
      default: 'en-US',
    },
    transcriptionEngine: {
      type: String,
      enum: ['web-speech-api', 'google-speech', 'aws-transcribe'],
      default: 'web-speech-api',
    },
    processedAt: Date,
  },
  { timestamps: true }
);

voiceTranscriptSchema.index({ userId: 1, createdAt: -1 });
voiceTranscriptSchema.index({ interviewQuestionId: 1 });

export default mongoose.model('VoiceTranscript', voiceTranscriptSchema);
