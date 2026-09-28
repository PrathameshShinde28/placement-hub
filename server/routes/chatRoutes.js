import express from 'express';
import { chatWithBot, getChatHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/message', protect, chatWithBot);
router.get('/history', protect, getChatHistory);

export default router;
