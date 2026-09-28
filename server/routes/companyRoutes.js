import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  updateHiringStats,
} from '../controllers/companyController.js';

const router = express.Router();

// Admin & Placement Officer routes
router.post('/', protect, authorize('admin', 'placementOfficer'), createCompany);
router.get('/', protect, getAllCompanies);
router.get('/:id', protect, getCompanyById);
router.put('/:id', protect, authorize('admin', 'placementOfficer'), updateCompany);
router.delete('/:id', protect, authorize('admin', 'placementOfficer'), deleteCompany);
router.put('/:id/hiring-stats', protect, authorize('admin', 'placementOfficer'), updateHiringStats);

export default router;
