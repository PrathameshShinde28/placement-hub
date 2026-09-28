import express from 'express';
import {
  createProject,
  getUserProjects,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createProject);
router.get('/', protect, getUserProjects);
router.put('/:projectId', protect, updateProject);
router.delete('/:projectId', protect, deleteProject);

export default router;
