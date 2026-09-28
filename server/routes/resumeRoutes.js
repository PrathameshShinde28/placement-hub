import express from 'express';
import {
  createResume,
  getResume,
  updateResume,
  analyzeResume,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createResume);
router.get('/', protect, getResume);
router.put('/update', protect, updateResume);
router.post('/analyze', protect, analyzeResume);

export default router;
