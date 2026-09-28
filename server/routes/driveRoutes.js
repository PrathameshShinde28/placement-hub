import express from 'express';
import {
  getAllDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
  registerForDrive,
  getUserDrives,
  getDriveApplicants,
  approveApplicant,
  rejectApplicant,
  revokeApplicant,
  deleteApplicant,
} from '../controllers/driveController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllDrives);
router.get('/:id', protect, getDriveById);

// Student routes
router.post('/:id/register', protect, registerForDrive);
router.get('/user/registered', protect, getUserDrives);

// Admin only routes
router.post('/', protect, authorize('admin'), createDrive);
router.put('/:id', protect, authorize('admin'), updateDrive);
router.delete('/:id', protect, authorize('admin'), deleteDrive);

// Applicant management routes
router.get('/:id/applicants', protect, authorize('admin'), getDriveApplicants);
router.put('/:id/applicants/:studentId/approve', protect, authorize('admin'), approveApplicant);
router.put('/:id/applicants/:studentId/reject', protect, authorize('admin'), rejectApplicant);
router.put('/:id/applicants/:studentId/revoke', protect, authorize('admin'), revokeApplicant);
router.delete('/:id/applicants/:studentId', protect, authorize('admin'), deleteApplicant);

export default router;
