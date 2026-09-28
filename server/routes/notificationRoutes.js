import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getMyNotifications,
  markNotificationRead,
  deleteNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

// Student/officer/admin all can read their own notifications
router.get('/', protect, getMyNotifications);

router.patch('/:id/read', protect, markNotificationRead);

router.delete('/:id', protect, deleteNotification);

export default router;

