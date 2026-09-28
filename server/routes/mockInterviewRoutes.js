import express from 'express';
import {
  startVoiceMockInterview,
  getCurrentQuestion,
  submitVoiceAnswer,
  completeInterview,
  getInterviewResult,
  getVoiceInterviewHistory,
} from '../controllers/mockInterviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected - require authentication
router.use(protect);

// ✅ Start a new voice mock interview
router.post('/start', startVoiceMockInterview);

// ✅ Get current question details
router.get('/question/:questionId', getCurrentQuestion);

// ✅ Submit voice answer for a question
router.post('/submit-answer', submitVoiceAnswer);

// ✅ Complete interview and generate results
router.post('/complete/:interviewId', completeInterview);

// ✅ Get detailed interview result
router.get('/result/:resultId', getInterviewResult);

// ✅ Get interview history and statistics
router.get('/history', getVoiceInterviewHistory);

export default router;
