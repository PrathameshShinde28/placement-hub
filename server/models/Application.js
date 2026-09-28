import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    // ---- Backward-compatible fields (existing code may rely on these) ----
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide student ID'],
      index: true,
    },
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
      required: [true, 'Please provide drive ID'],
      index: true,
    },

    // ---- Canonical fields (new spec) ----
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
      default: null,
    },

    status: {
      type: String,
      enum: [
        'applied',
        'resume_shortlisted',
        'aptitude_test_scheduled',
        'technical_interview_scheduled',
        'hr_interview_scheduled',
        'selected',
        'offered',
        'rejected',
      ],
      default: 'applied',
      index: true,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    statusUpdatedAt: {
      type: Date,
      default: Date.now,
    },

    // Officer notes/comments
    notes: {
      type: String,
      default: '',
    },

    // Interview date/time
    interviewDate: {
      type: Date,
      default: null,
    },

    // Backward compatible field
    remarks: {
      type: String,
      default: '',
    },

    // Who updated (placement officer/admin)
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Full timeline of status updates
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            'applied',
            'resume_shortlisted',
            'aptitude_test_scheduled',
            'technical_interview_scheduled',
            'hr_interview_scheduled',
            'selected',
            'offered',
            'rejected',
          ],
          required: true,
        },
        interviewDate: {
          type: Date,
          default: null,
        },
        notes: {
          type: String,
          default: '',
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: null,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Prevent duplicate applications - canonical student + drive (and keep old unique)
applicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true });
applicationSchema.index({ student: 1, drive: 1 }, { unique: true, sparse: true });

applicationSchema.pre('save', function (next) {
  try {
    // keep canonical fields in sync with backward-compatible ids
    if (this.studentId && !this.student) this.student = this.studentId;
    if (this.driveId && !this.drive) this.drive = this.driveId;

    const statusChanged = this.isModified('status');
    if (statusChanged) {
      this.statusUpdatedAt = Date.now();

      // append to history if not already done by controller
      if (!this.statusHistory || this.statusHistory.length === 0) {
        this.statusHistory = [
          {
            status: this.status,
            interviewDate: this.interviewDate || null,
            notes: this.notes || '',
            updatedBy: this.updatedBy || null,
          },
        ];
      }
    }

    // backward-compat sync
    if (this.remarks && (!this.notes || this.notes === '')) {
      this.notes = this.remarks;
    }
  } catch (e) {
    return next(e);
  }

  next();
});

export default mongoose.model('Application', applicationSchema);

