import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
    },
    studentEmail: {
      type: String,
      required: [true, 'Student email is required'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['CSE', 'ECE', 'IT', 'CIVIL', 'MECH', 'EEE'],
    },
    passingYear: {
      type: Number,
      required: [true, 'Passing year is required'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
    },
    companyType: {
      type: String,
      required: [true, 'Company type is required'],
      enum: ['Product', 'Service', 'Startup', 'MNC', 'Government'],
    },
    jobRole: {
      type: String,
      required: [true, 'Job role is required'],
    },
    package: {
      type: Number,
      required: [true, 'Package (LPA) is required'],
      min: 0,
    },
    placementType: {
      type: String,
      required: [true, 'Placement type is required'],
      enum: ['Internship', 'Full-Time', 'PPO'],
      default: 'Full-Time',
    },
    placementDate: {
      type: Date,
      required: [true, 'Placement date is required'],
    },
    jobLocation: {
      type: String,
      required: [true, 'Job location is required'],
    },
    workMode: {
      type: String,
      required: [true, 'Work mode is required'],
      enum: ['OnSite', 'Remote', 'Hybrid'],
    },
    selectionRoundsCleared: {
      type: [String],
      default: [],
      enum: ['Online Test', 'Technical Round 1', 'Technical Round 2', 'HR Round', 'Final Round'],
    },
    placementStatus: {
      type: String,
      required: [true, 'Placement status is required'],
      enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Offer Accepted', 'Joined'],
      default: 'Applied',
    },
    offerLetterUrl: {
      type: String,
      default: null,
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

// Index for common queries
placementSchema.index({ studentId: 1 });
placementSchema.index({ companyName: 1 });
placementSchema.index({ placementStatus: 1 });
placementSchema.index({ passingYear: 1 });
placementSchema.index({ department: 1 });

export default mongoose.model('Placement', placementSchema);
