import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  applyForDrive,
  getMyApplications,
  getDriveApplications,
  updateApplicationStatus,
  bulkUpdateApplications,
  getApplicationsByDrive,
} from '../controllers/applicationController.js';

const router = express.Router();

// Student apply for a drive
router.post('/:driveId/apply', protect, applyForDrive);

// Student: get my applications
router.get('/me', protect, getMyApplications);

// Placement officer/admin: get applicants by drive
router.get('/drives/:driveId/applicants', protect, authorize('admin', 'placementOfficer'), getDriveApplications);

// Placement officer/admin: update single application status
router.patch('/:id/status', protect, authorize('admin', 'placementOfficer'), updateApplicationStatus);

// Placement officer/admin: bulk update statuses
router.patch('/bulk-update', protect, authorize('admin', 'placementOfficer'), bulkUpdateApplications);

// Optional alias: list applications by drive
router.get('/drives/:driveId', protect, authorize('admin', 'placementOfficer'), getApplicationsByDrive);

export default router;

