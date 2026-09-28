import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Please provide notification title'],
      trim: true,
    },

    message: {
      type: String,
      required: [true, 'Please provide notification message'],
    },

    type: {
      type: String,
      required: [true, 'Please provide notification type'],
      trim: true,
    },

    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);

