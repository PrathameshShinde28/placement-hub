import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';

// Placeholder router file to be wired in next steps.
// Actual endpoints will be implemented with OpenAI service layer in Phase 1.

const router = express.Router();

router.get('/ping', protect, (req, res) => {
  res.json({ success: true, message: 'AI routes enabled' });
});

export default router;

