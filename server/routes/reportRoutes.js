import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  generateCompanyWiseReport,
  generateDepartmentWiseReport,
  generateYearWiseReport,
  generateSalaryStatsReport,
  generateStudentListReport,
  getAllReports,
  getReportById,
  deleteReport,
} from '../controllers/reportController.js';

const router = express.Router();

// Protected routes
router.post('/company-wise', protect, authorize('admin', 'placementOfficer'), generateCompanyWiseReport);
router.post('/department-wise', protect, authorize('admin', 'placementOfficer'), generateDepartmentWiseReport);
router.post('/year-wise', protect, authorize('admin', 'placementOfficer'), generateYearWiseReport);
router.post('/salary-stats', protect, authorize('admin', 'placementOfficer'), generateSalaryStatsReport);
router.post('/student-list', protect, authorize('admin', 'placementOfficer'), generateStudentListReport);

router.get('/', protect, authorize('admin', 'placementOfficer'), getAllReports);
router.get('/:id', protect, authorize('admin', 'placementOfficer'), getReportById);
router.delete('/:id', protect, authorize('admin', 'placementOfficer'), deleteReport);

export default router;
