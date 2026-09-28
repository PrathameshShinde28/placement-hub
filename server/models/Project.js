import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    technologies: [String],
    link: String,
    repositoryLink: String,
    startDate: Date,
    endDate: Date,
    imageUrl: String,
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
