import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Company type is required'],
      enum: ['Product', 'Service', 'Startup', 'MNC', 'Government'],
    },
    website: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      default: '',
    },
    headCount: {
      type: Number,
      default: 0,
    },
    contactPerson: {
      name: String,
      email: String,
      phone: String,
    },
    location: {
      type: String,
      default: '',
    },
    ctc: {
      type: Number,
      default: 0,
    },
    jobProfiles: {
      type: [String],
      default: [],
    },
    eligibility: {
      minCGPA: {
        type: Number,
        default: 0,
      },
      branches: {
        type: [String],
        default: [],
        enum: ['CSE', 'ECE', 'IT', 'CIVIL', 'MECH', 'EEE'],
      },
      passoutYears: {
        type: [Number],
        default: [],
      },
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    hiringStats: {
      totalVisits: {
        type: Number,
        default: 0,
      },
      totalApplications: {
        type: Number,
        default: 0,
      },
      totalSelected: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    notes: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

companySchema.index({ name: 1 });
companySchema.index({ type: 1 });
companySchema.index({ createdAt: 1 });

export default mongoose.model('Company', companySchema);
