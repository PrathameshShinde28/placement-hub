import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  createPlacement,
  getAllPlacements,
  getPlacementById,
  updatePlacement,
  deletePlacement,
  getMyPlacements,
  bulkUpdateStatus,
} from '../controllers/placementController.js';

const router = express.Router();

// Protected routes - only authenticated users
router.get('/my-placements', protect, getMyPlacements);

// Admin & Placement Officer routes
router.post('/', protect, authorize('admin', 'placementOfficer'), createPlacement);
router.get('/', protect, authorize('admin', 'placementOfficer'), getAllPlacements);
router.get('/:id', protect, authorize('admin', 'placementOfficer'), getPlacementById);
router.put('/:id', protect, authorize('admin', 'placementOfficer'), updatePlacement);
router.delete('/:id', protect, authorize('admin', 'placementOfficer'), deletePlacement);
router.post('/bulk-update/status', protect, authorize('admin', 'placementOfficer'), bulkUpdateStatus);

export default router;
