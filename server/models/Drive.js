import mongoose from 'mongoose';

const driveSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Please provide job title'],
      trim: true,
    },
    jobDescription: {
      type: String,
      required: [true, 'Please provide job description'],
    },
    requiredSkills: {
      type: [String],
      required: [true, 'Please provide required skills'],
      default: [],
    },
    eligibility: {
      cgpa: {
        type: Number,
        default: 0,
      },
      branch: {
        type: [String],
        default: [],
      },
      passoutYear: {
        type: [Number],
        default: [],
      },
    },
    deadline: {
      type: Date,
      required: [true, 'Please provide application deadline'],
    },
    registeredStudents: [{
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      rejectionReason: {
        type: String,
        default: ''
      },
      nextStep: {
        type: String,
        enum: ['assessment', 'technical', 'hr', 'offered'],
        default: null
      },
      appliedAt: {
        type: Date,
        default: Date.now
      }
    }],

    applicantCount: {
      type: Number,
      default: 0,
    },
    salary: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'internship', 'contract', 'part-time'],
      default: 'full-time',
    },
    companyWebsite: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'archived'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Add pre-save middleware to clean invalid registeredStudents (ROBUST)
driveSchema.pre('save', function(next) {
  try {
    // Clean invalid student entries - handle null/undefined safely
    this.registeredStudents = this.registeredStudents.filter(app => {
      try {
        return app.student && 
               mongoose.Types.ObjectId.isValid(new mongoose.Types.ObjectId(app.student));
      } catch {
        return false;
      }
    });
    
    // Update count
    this.applicantCount = this.registeredStudents.length;
  } catch (error) {
    console.warn('⚠️ Drive pre-save cleanup warning:', error.message);
    // Ensure applicantCount is safe
    this.applicantCount = this.registeredStudents?.length || 0;
  }
  
  next();
});

export default mongoose.model('Drive', driveSchema);
