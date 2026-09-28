import Interview from '../models/Interview.js';

// Start Mock Interview
export const startInterview = async (req, res) => {
  try {
    const { interviewType, questionCategory, difficulty } = req.body;

    // Dummy interview question
    const questions = {
      technical: [
        'Explain the difference between var, let, and const in JavaScript.',
        'What is the event loop in JavaScript?',
        'Explain async/await and Promises.',
      ],
      behavioral: [
        'Tell me about a time you overcame a challenge.',
        'How do you handle conflicts in a team?',
        'Describe your biggest achievement.',
      ],
      hr: [
        'Why do you want to join our company?',
        'What are your strengths and weaknesses?',
        'Where do you see yourself in 5 years?',
      ],
    };

    const typeQuestions = questions[interviewType] || questions.technical;
    const question = typeQuestions[Math.floor(Math.random() * typeQuestions.length)];

    const interview = await Interview.create({
      userId: req.userId,
      interviewType,
      questionCategory: questionCategory || 'General',
      question,
      difficulty: difficulty || 'Medium',
    });

    res.status(201).json({
      success: true,
      message: 'Interview started',
      interview: {
        id: interview._id,
        question: interview.question,
        interviewType: interview.interviewType,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit Interview Answer
export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, answer, duration } = req.body;

    const interview = await Interview.findByIdAndUpdate(
      interviewId,
      {
        userAnswer: answer,
        duration,
        'aiEvaluation.score': Math.floor(Math.random() * 40 + 60), // Random score 60-100
        'aiEvaluation.feedback': 'Good answer! Could be improved with more examples.',
        'aiEvaluation.suggestions': [
          'Add more practical examples',
          'Structure your answer better',
          'Include relevant metrics',
        ],
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Answer submitted and evaluated',
      evaluation: interview.aiEvaluation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Interview History
export const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId }).sort({ createdAt: -1 });

    const stats = {
      totalInterviews: interviews.length,
      averageScore: interviews.length
        ? (interviews.reduce((sum, int) => sum + (int.aiEvaluation?.score || 0), 0) /
            interviews.length).toFixed(2)
        : 0,
      interviews,
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
