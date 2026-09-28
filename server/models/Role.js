import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    requiredSkills: [String],
    salaryRange: {
      min: Number,
      max: Number,
    },
    companies: [String],
    jobPostings: Number,
  },
  { timestamps: true }
);

export default mongoose.model('Role', roleSchema);
