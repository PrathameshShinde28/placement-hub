import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: String,
    email: String,
    phone: String,
    location: String,
    summary: String,
    experience: [
      {
        jobTitle: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        graduationYear: Number,
        gpa: String,
      },
    ],
    skills: [String],
    projects: [
      {
        title: String,
        description: String,
        link: String,
      },
    ],
    certifications: [String],
    resumeFile: {
      type: String,
      default: null,
    },
    aiScore: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
