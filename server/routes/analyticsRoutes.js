import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getDashboardAnalytics,
  getCompanyWiseAnalytics,
  getDepartmentWiseAnalytics,
  getYearWiseTrends,
  getPackageDistribution,
  getStatusDistribution,
  getMonthlyStats,
} from '../controllers/analyticsController.js';

const router = express.Router();

// Protected routes - analytics accessible to admin and placement officers
router.get('/dashboard', protect, authorize('admin', 'placementOfficer'), getDashboardAnalytics);
router.get('/company-wise', protect, authorize('admin', 'placementOfficer'), getCompanyWiseAnalytics);
router.get('/department-wise', protect, authorize('admin', 'placementOfficer'), getDepartmentWiseAnalytics);
router.get('/year-trends', protect, authorize('admin', 'placementOfficer'), getYearWiseTrends);
router.get('/package-distribution', protect, authorize('admin', 'placementOfficer'), getPackageDistribution);
router.get('/status-distribution', protect, authorize('admin', 'placementOfficer'), getStatusDistribution);
router.get('/monthly-stats', protect, authorize('admin', 'placementOfficer'), getMonthlyStats);

export default router;
