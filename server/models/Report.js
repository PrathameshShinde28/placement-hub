import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      required: true,
      enum: [
        'Company-Wise',
        'Department-Wise',
        'Year-Wise',
        'Salary-Stats',
        'Student-List',
        'Drive-Summary',
      ],
    },
    title: {
      type: String,
      required: true,
    },
    filters: {
      company: String,
      department: String,
      year: Number,
      startDate: Date,
      endDate: Date,
      status: String,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    statistics: {
      totalRecords: Number,
      totalPackage: Number,
      averagePackage: Number,
      highestPackage: Number,
      lowestPackage: Number,
      placementRate: Number,
    },
    format: {
      type: String,
      enum: ['PDF', 'Excel', 'Print'],
      default: 'PDF',
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      default: null,
    },
    fileUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['Generated', 'Pending', 'Failed'],
      default: 'Generated',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

reportSchema.index({ reportType: 1 });
reportSchema.index({ generatedBy: 1 });
reportSchema.index({ createdAt: -1 });

export default mongoose.model('Report', reportSchema);
