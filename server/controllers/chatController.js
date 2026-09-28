// Chat with AI Bot
export const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Please provide a message' });
    }

    // Dummy chatbot response - replace with actual OpenAI API call
    const responses = [
      'To improve your skills, I recommend practicing coding problems on LeetCode.',
      'Consider building more projects to strengthen your portfolio.',
      'Work on your communication skills - they are crucial for interviews.',
      'Try to contribute to open-source projects to gain real-world experience.',
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    res.status(200).json({
      success: true,
      message: message,
      botResponse: randomResponse,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Chat History (placeholder)
export const getChatHistory = async (req, res) => {
  try {
    // Placeholder for chat history storage
    const chatHistory = [];

    res.status(200).json({
      success: true,
      chatHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
