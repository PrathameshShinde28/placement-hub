import Resume from '../models/Resume.js';

// Create Resume
export const createResume = async (req, res) => {
  try {
    const { fullName, email, phone, location, summary, experience, education, skills } = req.body;

    const resume = await Resume.create({
      userId: req.userId,
      fullName,
      email,
      phone,
      location,
      summary,
      experience,
      education,
      skills,
    });

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      resume,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User's Resume
export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Resume
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate({ userId: req.userId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      resume,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Analyze Resume with AI
export const analyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Dummy AI analysis - replace with actual OpenAI API call
    const analysis = {
      score: 75,
      feedback: 'Good resume structure with clear experience sections.',
      suggestions: [
        'Add more quantifiable achievements',
        'Improve summary section',
        'Add technical skills section',
      ],
      strengths: ['Clear formatting', 'Good experience description'],
      improvements: ['Add metrics', 'Enhance action verbs'],
    };

    resume.aiScore = analysis.score;
    resume.feedback = JSON.stringify(analysis.suggestions);
    await resume.save();

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
