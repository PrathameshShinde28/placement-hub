import express from 'express';
import { getSkillGap, addSkill, removeSkill } from '../controllers/skillController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/gap-analysis', protect, getSkillGap);
router.post('/add', protect, addSkill);
router.post('/remove', protect, removeSkill);

export default router;
