import MockInterview from '../models/MockInterview.js';
import InterviewQuestion from '../models/InterviewQuestion.js';
import InterviewResult from '../models/InterviewResult.js';
import VoiceTranscript from '../models/VoiceTranscript.js';
import User from '../models/User.js';

// Interview question bank
const questionBank = {
  'HR Interview': {
    Beginner: [
      'Tell me about yourself and your professional background.',
      'Why are you interested in this position?',
      'What are your key strengths?',
      'What are your weaknesses and how do you overcome them?',
      'Describe a challenge you faced and how you handled it.',
      'How do you handle stress and pressure in the workplace?',
      'What motivates you in your career?',
      'How do you work in a team environment?',
      'Where do you see yourself in 5 years?',
      'Why should we hire you?',
    ],
    Intermediate: [
      'Tell me about a time you had to adapt to a significant change.',
      'Describe a situation where you had to resolve a conflict with a colleague.',
      'Give an example of when you showed leadership.',
      'How do you prioritize multiple tasks with tight deadlines?',
      'Tell me about a failure and what you learned from it.',
      'Describe your experience working with diverse teams.',
      'How do you handle constructive criticism?',
      'Tell me about a project you\'re proud of and why.',
      'What does success look like to you in this role?',
      'How would your previous manager describe you?',
    ],
    Advanced: [
      'Tell me about a time you had to influence stakeholders on a critical decision.',
      'Describe your experience with managing or mentoring team members.',
      'How have you contributed to organizational growth or improvement?',
      'Tell me about a complex problem you solved and your approach.',
      'Describe a situation where you had to deliver results with limited resources.',
      'How do you stay updated with industry trends and technologies?',
      'Tell me about a time you had to make an unpopular decision.',
      'How do you balance short-term goals with long-term vision?',
      'Describe your experience in driving innovation in your previous roles.',
      'What\'s your approach to ethical dilemmas in the workplace?',
    ],
  },
  'Technical Interview': {
    Beginner: [
      'What are the key concepts of object-oriented programming?',
      'Explain the difference between a process and a thread.',
      'What is the difference between SQL and NoSQL databases?',
      'Explain what is an API and how it works.',
      'What are the HTTP methods and their purposes?',
      'Explain the concept of inheritance in programming.',
      'What is polymorphism and why is it important?',
      'Explain data structures and their types.',
      'What is the difference between array and linked list?',
      'Explain the concept of recursion.',
    ],
    Intermediate: [
      'Explain the difference between synchronous and asynchronous programming.',
      'What is the design pattern and can you give examples?',
      'Explain the SOLID principles.',
      'What is the difference between equality and identity in programming?',
      'Explain the concept of garbage collection.',
      'What are microservices and their advantages?',
      'Explain containerization and Docker.',
      'What is the difference between REST and GraphQL APIs?',
      'Explain the concept of caching and its types.',
      'What is the CAP theorem in distributed systems?',
    ],
    Advanced: [
      'Design a scalable system for a real-time messaging application.',
      'Explain database indexing and query optimization techniques.',
      'What is the difference between horizontal and vertical scaling?',
      'Explain the concept of distributed transactions.',
      'How would you design a load balancer?',
      'Explain the concept of eventual consistency in distributed systems.',
      'What are the challenges in microservices architecture?',
      'Explain the concept of sharding in databases.',
      'How would you design a search engine?',
      'Explain the concept of circuit breaker pattern.',
    ],
  },
  'Behavioral Interview': {
    Beginner: [
      'Tell me about a time when you had to work with someone difficult.',
      'Describe a situation where you had to meet a tight deadline.',
      'Tell me about a time you made a mistake at work.',
      'Describe how you handle feedback.',
      'Tell me about a goal you set and how you achieved it.',
      'Describe a time when you had to learn something new quickly.',
      'Tell me about a time you worked as part of a team.',
      'Describe a situation where you had to be creative.',
      'Tell me about a time you went above and beyond.',
      'Describe how you organize and manage your time.',
    ],
    Intermediate: [
      'Tell me about a time when you had to compromise on your idea.',
      'Describe a situation where you had to advocate for your perspective.',
      'Tell me about a time when you had to mentor or help a colleague.',
      'Describe a time when you had to handle ambiguity.',
      'Tell me about a time when you had to make a difficult decision.',
      'Describe how you handle failure.',
      'Tell me about a time when you had to multitask.',
      'Describe a time when you showed initiative.',
      'Tell me about a time when you improved a process.',
      'Describe how you build relationships at work.',
    ],
    Advanced: [
      'Tell me about a time when you had to lead a team through change.',
      'Describe a situation where you had to balance competing priorities.',
      'Tell me about a time when you had to make an unpopular decision.',
      'Describe a situation where you had to manage a high-performing team.',
      'Tell me about a time when you had to drive organizational change.',
      'Describe how you build and maintain trust with your team.',
      'Tell me about a time when you had to manage conflict between team members.',
      'Describe a situation where you had to develop a strategy.',
      'Tell me about a time when you achieved significant results.',
      'Describe how you inspire and motivate your team.',
    ],
  },
  'System Design Interview': {
    Beginner: [
      'How would you design a URL shortening service like TinyURL?',
      'Design a basic social media feed system.',
      'How would you design a parking lot system?',
      'Design a simple e-commerce product catalog.',
      'How would you design a file sharing system like Dropbox?',
      'Design a rate limiting system.',
      'How would you design a notifications system?',
      'Design a basic search engine.',
      'How would you design a video streaming platform?',
      'Design a ride-sharing application.',
    ],
    Intermediate: [
      'Design Twitter with millions of daily active users.',
      'How would you design a recommendation system?',
      'Design a distributed cache system like Redis.',
      'How would you design an analytics system?',
      'Design a payment processing system.',
      'How would you design a logging and monitoring system?',
      'Design a location-based services system.',
      'How would you design a chat application with message history?',
      'Design an email service.',
      'How would you design a database sharding strategy?',
    ],
    Advanced: [
      'Design a global content delivery network.',
      'How would you design a financial trading platform?',
      'Design an autonomous vehicle system.',
      'How would you design a real-time collaborative editing tool?',
      'Design a blockchain-based system.',
      'How would you design a machine learning pipeline at scale?',
      'Design a disaster recovery and backup system.',
      'How would you design a multi-tenant SaaS platform?',
      'Design a real-time analytics platform.',
      'How would you design a decentralized social network?',
    ],
  },
  'React Interview': {
    Beginner: [
      'What is React and why would you use it?',
      'Explain the difference between functional and class components.',
      'What are props and how do you use them?',
      'Explain the useState hook and give an example.',
      'What is JSX and why is it useful?',
      'Explain the virtual DOM and how it works.',
      'What is the difference between controlled and uncontrolled components?',
      'How do you handle form submissions in React?',
      'What are keys in React lists and why are they important?',
      'Explain the useEffect hook and its dependencies.',
    ],
    Intermediate: [
      'Explain the component lifecycle and lifecycle methods.',
      'How do you optimize React applications?',
      'What is context API and when would you use it?',
      'Explain higher-order components and render props.',
      'What is the useContext hook and how does it work?',
      'How do you handle errors in React?',
      'Explain lazy loading and code splitting in React.',
      'What is React Fragments and when would you use them?',
      'How do you handle side effects in functional components?',
      'Explain the useReducer hook and its use cases.',
    ],
    Advanced: [
      'How would you build a custom hook and what are the rules?',
      'Explain concurrent rendering and Suspense in React.',
      'How do you implement server-side rendering with React?',
      'What are the best practices for state management in React?',
      'Explain React Fiber and how it works.',
      'How do you optimize performance with React.memo and useMemo?',
      'Explain the difference between shallow and deep equality checks.',
      'How would you implement a form library in React?',
      'What are the best practices for testing React components?',
      'Explain error boundaries and their limitations.',
    ],
  },
  'Node.js Interview': {
    Beginner: [
      'What is Node.js and what are its advantages?',
      'Explain the event-driven architecture of Node.js.',
      'What is the difference between synchronous and asynchronous code?',
      'Explain callbacks and callback hell.',
      'What are Promises and how do they work?',
      'Explain async/await syntax and benefits.',
      'What is the event loop in Node.js?',
      'Explain the difference between blocking and non-blocking operations.',
      'What are streams in Node.js?',
      'What is Express.js and how do you use it?',
    ],
    Intermediate: [
      'How do you handle errors in Node.js?',
      'Explain middleware in Express.js.',
      'What are the best practices for writing scalable Node.js applications?',
      'How do you implement authentication in Node.js?',
      'Explain the difference between require and import in Node.js.',
      'What is the module system in Node.js?',
      'How do you handle file operations in Node.js?',
      'Explain clustering and worker processes in Node.js.',
      'What are environment variables and how do you use them?',
      'How do you implement caching in Node.js applications?',
    ],
    Advanced: [
      'How would you build a real-time application with Node.js?',
      'Explain WebSockets and Socket.io.',
      'How do you implement database connections pools?',
      'What are the best practices for deploying Node.js applications?',
      'How do you monitor and debug Node.js applications?',
      'Explain the difference between processes and threads.',
      'How do you implement load balancing in Node.js?',
      'What are the security best practices for Node.js?',
      'How do you implement message queues in Node.js?',
      'Explain reverse proxies and their use in Node.js applications.',
    ],
  },
  'Java Interview': {
    Beginner: [
      'What are the features of Java?',
      'Explain the difference between JDK, JRE, and JVM.',
      'What is the difference between a class and an object?',
      'Explain the concept of inheritance in Java.',
      'What is polymorphism and its types?',
      'Explain encapsulation and its benefits.',
      'What is abstraction and when do you use it?',
      'Explain the difference between abstract class and interface.',
      'What are access modifiers in Java?',
      'Explain the concept of exception handling.',
    ],
    Intermediate: [
      'What is the difference between String, StringBuffer, and StringBuilder?',
      'Explain the concept of collection framework in Java.',
      'What is the difference between HashMap and Hashtable?',
      'Explain multithreading and its advantages.',
      'What is the synchronized keyword and why is it used?',
      'Explain the concept of locks in Java.',
      'What are annotations and their uses?',
      'Explain generics in Java.',
      'What is the concept of reflection in Java?',
      'Explain the different types of inner classes.',
    ],
    Advanced: [
      'Explain the concept of memory management and garbage collection in Java.',
      'What are the best practices for writing efficient Java code?',
      'Explain the concept of design patterns in Java.',
      'What is Spring Framework and its advantages?',
      'Explain dependency injection and its benefits.',
      'What is the difference between checked and unchecked exceptions?',
      'Explain the concept of Java 8 features like lambda and streams.',
      'What are best practices for database connectivity in Java?',
      'Explain the concept of REST API development in Java.',
      'What are the best practices for handling concurrency in Java?',
    ],
  },
  'Database Interview': {
    Beginner: [
      'What is a relational database and what are its advantages?',
      'Explain the concept of normalization.',
      'What are the different types of keys in a database?',
      'Explain the difference between primary and foreign keys.',
      'What are indexes and why are they important?',
      'Explain ACID properties.',
      'What is the difference between DELETE, TRUNCATE, and DROP?',
      'Explain the concept of transactions.',
      'What are joins and their types?',
      'Explain the difference between SQL and NoSQL databases.',
    ],
    Intermediate: [
      'Explain query optimization techniques.',
      'What is database indexing and its types?',
      'Explain the concept of denormalization.',
      'What are stored procedures and their advantages?',
      'Explain the concept of triggers.',
      'What is the difference between UNION and UNION ALL?',
      'Explain views in database.',
      'What is database replication?',
      'Explain the concept of sharding.',
      'What are backup and recovery strategies?',
    ],
    Advanced: [
      'Explain distributed database concepts.',
      'How would you design a large-scale database?',
      'Explain the CAP theorem in database systems.',
      'What is database partitioning and its strategies?',
      'Explain consistency models in distributed systems.',
      'What are the best practices for database security?',
      'Explain the concept of MVCC in databases.',
      'How would you handle database migration?',
      'Explain the concept of database monitoring.',
      'What are the best practices for database performance tuning?',
    ],
  },
  'DSA Interview': {
    Beginner: [
      'Explain what is a data structure.',
      'What is the difference between array and linked list?',
      'Explain the concept of time and space complexity.',
      'What is Big O notation and how do you use it?',
      'Explain the concept of searching algorithms.',
      'What is the difference between linear and binary search?',
      'Explain the concept of sorting algorithms.',
      'What is the difference between stack and queue?',
      'Explain the concept of recursion.',
      'What are common recursion problems?',
    ],
    Intermediate: [
      'Explain the concept of graphs and their types.',
      'What is depth-first search and breadth-first search?',
      'Explain dynamic programming and give examples.',
      'What is the difference between greedy and dynamic programming?',
      'Explain the concept of trees.',
      'What is a binary search tree?',
      'Explain balanced trees.',
      'What is the concept of hashing?',
      'Explain the difference between hash table and hash map.',
      'What are collision resolution techniques in hashing?',
    ],
    Advanced: [
      'Explain advanced graph algorithms like Dijkstra and Bellman Ford.',
      'What is the concept of topological sorting?',
      'Explain the concept of minimum spanning trees.',
      'What is the concept of trie data structure?',
      'Explain the concept of segment trees.',
      'What are advanced dynamic programming techniques?',
      'Explain the concept of matrix chain multiplication.',
      'What is the concept of flow networks?',
      'Explain the concept of string matching algorithms.',
      'What are advanced sorting algorithms and their applications?',
    ],
  },
  'Full Stack Interview': {
    Beginner: [
      'What is the full stack development and its components?',
      'Explain the concept of frontend development.',
      'What is the role of backend development?',
      'Explain the difference between frontend and backend.',
      'What are the tools and technologies for full stack development?',
      'Explain the concept of client-server architecture.',
      'What is REST API and its principles?',
      'Explain the concept of HTTP.',
      'What is database and why is it important?',
      'Explain the concept of web hosting and deployment.',
    ],
    Intermediate: [
      'Explain the process of building a web application.',
      'What are the best practices for full stack development?',
      'Explain the concept of MVC architecture.',
      'What is the difference between monolithic and microservices architecture?',
      'Explain the concept of authentication and authorization.',
      'What are the security best practices in full stack development?',
      'Explain the concept of testing in full stack development.',
      'What is continuous integration and continuous deployment?',
      'Explain the concept of web sockets.',
      'What are the best practices for API design?',
    ],
    Advanced: [
      'How would you design a scalable web application?',
      'Explain the concept of horizontal and vertical scaling.',
      'What are the best practices for performance optimization?',
      'How would you implement caching in a full stack application?',
      'Explain the concept of load balancing.',
      'What are the best practices for database optimization?',
      'How would you implement real-time features?',
      'Explain the concept of API versioning.',
      'What are the best practices for monitoring and logging?',
      'How would you implement a global architecture for a web application?',
    ],
  },
  'Aptitude Discussion': {
    Beginner: [
      'How would you approach solving a mathematical problem?',
      'Explain your logical reasoning approach.',
      'What is your strategy for solving word problems?',
      'How do you approach reading comprehension?',
      'Explain your approach to data interpretation.',
      'What techniques do you use for mental math?',
      'How do you approach probability problems?',
      'Explain your approach to percentage calculations.',
      'What is your strategy for time management in tests?',
      'How do you approach syllogism and logical reasoning?',
    ],
    Intermediate: [
      'Explain your approach to complex word problems.',
      'How do you solve permutation and combination problems?',
      'What is your strategy for data interpretation with multiple datasets?',
      'Explain your approach to sequence and series problems.',
      'How do you approach number system problems?',
      'What is your strategy for geometry problems?',
      'Explain your approach to ratio and proportion.',
      'How do you solve problems on profit and loss?',
      'What is your strategy for speed, time, and distance problems?',
      'Explain your approach to miscellaneous aptitude problems.',
    ],
    Advanced: [
      'How would you approach a complex multi-step problem?',
      'Explain your strategy for optimization problems.',
      'How do you approach problems requiring statistical knowledge?',
      'What is your approach to advanced probability scenarios?',
      'Explain your strategy for problems with multiple constraints.',
      'How do you approach problems requiring abstract thinking?',
      'What is your strategy for breaking down complex scenarios?',
      'Explain your approach to problems with incomplete information.',
      'How do you verify your solutions for accuracy?',
      'What is your strategy for problems requiring lateral thinking?',
    ],
  },
};

// AI Evaluation Engine
const evaluateAnswer = async (studentAnswer, question, difficulty, interviewType) => {
  // Simulate AI evaluation (in production, use OpenAI API or similar)
  const answerLength = studentAnswer.split(' ').length;
  const answerLower = studentAnswer.toLowerCase();

  // Calculate scores based on answer analysis
  const technicalAccuracy = calculateTechnicalScore(
    studentAnswer,
    question,
    interviewType
  );
  const communicationSkills = calculateCommunicationScore(studentAnswer);
  const confidence = calculateConfidenceScore(answerLength, studentAnswer);
  const fluency = calculateFluencyScore(studentAnswer);
  const clarity = calculateClarityScore(studentAnswer);
  const problemSolving = calculateProblemSolvingScore(
    studentAnswer,
    question,
    interviewType
  );

  const overallScore =
    (technicalAccuracy +
      communicationSkills +
      confidence +
      fluency +
      clarity +
      problemSolving) /
    6;

  return {
    technicalAccuracy: {
      score: Math.min(100, Math.max(0, technicalAccuracy)),
      comment: getTechnicalComment(technicalAccuracy),
    },
    communicationSkills: {
      score: Math.min(100, Math.max(0, communicationSkills)),
      comment: getCommunicationComment(communicationSkills),
    },
    confidence: {
      score: Math.min(100, Math.max(0, confidence)),
      comment: getConfidenceComment(confidence),
    },
    fluency: {
      score: Math.min(100, Math.max(0, fluency)),
      comment: getFluencyComment(fluency),
    },
    clarity: {
      score: Math.min(100, Math.max(0, clarity)),
      comment: getClarityComment(clarity),
    },
    problemSolving: {
      score: Math.min(100, Math.max(0, problemSolving)),
      comment: getProblemSolvingComment(problemSolving),
    },
    overallScore: Math.min(100, Math.max(0, overallScore)),
    strengths: extractStrengths(studentAnswer, overallScore),
    improvements: extractImprovements(studentAnswer, overallScore),
    suggestedAnswer: generateSuggestedAnswer(question, interviewType),
    keyPoints: extractKeyPoints(question, interviewType),
  };
};

// Helper evaluation functions
const calculateTechnicalScore = (answer, question, interviewType) => {
  const keywords = getTechnicalKeywords(interviewType);
  let score = 50; // baseline score

  keywords.forEach((keyword) => {
    if (answer.toLowerCase().includes(keyword.toLowerCase())) {
      score += 5;
    }
  });

  return Math.min(100, score);
};

const calculateCommunicationScore = (answer) => {
  const score = 60;
  const words = answer.split(' ').length;

  if (words < 50) return 40;
  if (words > 500) return 70;
  return Math.min(90, 60 + (words / 100) * 10);
};

const calculateConfidenceScore = (answerLength, answer) => {
  if (answerLength < 30) return 40;
  if (answerLength > 200) return 75;
  return 50 + (answerLength / 200) * 25;
};

const calculateFluencyScore = (answer) => {
  const sentences = answer.split(/[.!?]+/).length;
  const words = answer.split(' ').length;
  const avgWordsPerSentence = words / sentences;

  if (avgWordsPerSentence < 5 || avgWordsPerSentence > 25) return 60;
  return 70;
};

const calculateClarityScore = (answer) => {
  // Check for clarity markers
  let score = 50;

  const clarityMarkers = [
    'first',
    'second',
    'third',
    'example',
    'specifically',
    'in detail',
    'therefore',
    'because',
  ];

  clarityMarkers.forEach((marker) => {
    if (answer.toLowerCase().includes(marker)) {
      score += 5;
    }
  });

  return Math.min(100, score);
};

const calculateProblemSolvingScore = (answer, question, interviewType) => {
  let score = 50;

  // Check for problem-solving indicators
  if (answer.toLowerCase().includes('approach'))
    score += 10;
  if (answer.toLowerCase().includes('solution'))
    score += 10;
  if (answer.toLowerCase().includes('alternative'))
    score += 5;
  if (answer.toLowerCase().includes('trade-off'))
    score += 5;

  return Math.min(100, score);
};

// Comment generators
const getTechnicalComment = (score) => {
  if (score >= 80) return 'Excellent technical understanding demonstrated';
  if (score >= 60) return 'Good technical knowledge with room for improvement';
  if (score >= 40) return 'Basic understanding shown, needs deeper knowledge';
  return 'Limited technical knowledge, requires more study';
};

const getCommunicationComment = (score) => {
  if (score >= 80) return 'Excellent communication skills';
  if (score >= 60) return 'Good communication, could be more concise';
  if (score >= 40) return 'Basic communication, needs improvement';
  return 'Poor communication, needs significant improvement';
};

const getConfidenceComment = (score) => {
  if (score >= 80) return 'Very confident answer';
  if (score >= 60) return 'Reasonably confident';
  if (score >= 40) return 'Could be more confident';
  return 'Lack of confidence in answer';
};

const getFluencyComment = (score) => {
  if (score >= 80) return 'Fluent and well-structured response';
  if (score >= 60) return 'Generally fluent with minor awkwardness';
  if (score >= 40) return 'Some fluency issues';
  return 'Significant fluency issues';
};

const getClarityComment = (score) => {
  if (score >= 80) return 'Very clear and well-organized answer';
  if (score >= 60) return 'Clear answer with good organization';
  if (score >= 40) return 'Somewhat clear, could be better organized';
  return 'Unclear and poorly organized';
};

const getProblemSolvingComment = (score) => {
  if (score >= 80) return 'Excellent problem-solving approach';
  if (score >= 60) return 'Good problem-solving skills demonstrated';
  if (score >= 40) return 'Basic problem-solving approach';
  return 'Weak problem-solving demonstration';
};

// Helper functions
const getTechnicalKeywords = (interviewType) => {
  const keywords = {
    'Technical Interview': [
      'algorithm',
      'complexity',
      'optimize',
      'implement',
      'design',
      'pattern',
      'database',
      'API',
      'architecture',
      'scalable',
    ],
    'React Interview': [
      'component',
      'state',
      'props',
      'hooks',
      'render',
      'lifecycle',
      'virtual DOM',
      'jsx',
      'effect',
      'context',
    ],
    'Node.js Interview': [
      'asynchronous',
      'callback',
      'promise',
      'async/await',
      'event loop',
      'middleware',
      'express',
      'stream',
      'buffer',
      'module',
    ],
    'Java Interview': [
      'class',
      'interface',
      'inheritance',
      'polymorphism',
      'encapsulation',
      'exception',
      'thread',
      'collection',
      'spring',
      'jvm',
    ],
    'Database Interview': [
      'SQL',
      'normalization',
      'index',
      'transaction',
      'join',
      'query',
      'optimization',
      'replication',
      'sharding',
      'backup',
    ],
  };

  return keywords[interviewType] || [];
};

const extractStrengths = (answer, score) => {
  const strengths = [];

  if (answer.length > 100) strengths.push('Good answer length and detail');
  if (answer.includes('example') || answer.includes('specifically'))
    strengths.push('Provided specific examples');
  if (answer.includes('therefore') || answer.includes('because'))
    strengths.push('Good logical reasoning');
  if (score > 75) strengths.push('Strong overall performance');

  return strengths.length > 0 ? strengths : ['Attempted a comprehensive answer'];
};

const extractImprovements = (answer, score) => {
  const improvements = [];

  if (answer.length < 50) improvements.push('Provide more detailed responses');
  if (!answer.includes('example') && !answer.includes('specifically'))
    improvements.push('Include specific examples');
  if (score < 60) improvements.push('Need deeper technical knowledge');
  if (!answer.includes('therefore') && !answer.includes('because'))
    improvements.push('Strengthen logical reasoning');

  return improvements.length > 0 ? improvements : ['Continue with similar approach'];
};

const generateSuggestedAnswer = (question, interviewType) => {
  return `A strong answer to this question would cover: 
1. Your understanding of the key concepts
2. Specific examples from your experience
3. How you approach problem-solving
4. Your methodology and best practices
5. Any relevant technologies or tools used`;
};

const extractKeyPoints = (question, interviewType) => {
  return [
    'Address all parts of the question',
    'Use concrete examples',
    'Demonstrate logical thinking',
    'Show relevant expertise',
    'Keep answer concise yet comprehensive',
  ];
};

// ✅ Start Voice Mock Interview
export const startVoiceMockInterview = async (req, res) => {
  try {
    const {
      interviewType,
      difficulty,
      domain,
      targetDuration,
      numberOfQuestions,
    } = req.body;

    // Validation
    if (!interviewType || !difficulty) {
      return res
        .status(400)
        .json({ message: 'Interview type and difficulty are required' });
    }

    if (!questionBank[interviewType]) {
      return res
        .status(400)
        .json({
          message: `Invalid interview type. Must be one of: ${Object.keys(questionBank).join(', ')}`,
        });
    }

    // Create mock interview
    const mockInterview = await MockInterview.create({
      userId: req.userId,
      title: `${interviewType} - ${difficulty}`,
      interviewType,
      difficulty,
      domain: domain || 'General',
      duration: (targetDuration || 15) * 60, // convert minutes to seconds
      questionsCount: numberOfQuestions || 5,
      status: 'in-progress',
      startedAt: new Date(),
    });

    // Get questions from question bank
    const availableQuestions = questionBank[interviewType][difficulty];
    if (!availableQuestions || availableQuestions.length === 0) {
      return res
        .status(400)
        .json({ message: 'No questions available for this configuration' });
    }

    // Shuffle and select questions
    const selectedQuestionTexts = availableQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, numberOfQuestions || 5);

    // Create interview questions
    const createdQuestions = await Promise.all(
      selectedQuestionTexts.map((questionText, index) =>
        InterviewQuestion.create({
          mockInterviewId: mockInterview._id,
          userId: req.userId,
          questionNumber: index + 1,
          question: questionText,
          category: domain || 'General',
          difficulty,
          expectedAnswer: `Sample answer for: ${questionText}`,
        })
      )
    );

    // Update mock interview with questions
    mockInterview.questions = createdQuestions.map((q) => q._id);
    await mockInterview.save();

    // Return first question for interview to start
    res.status(201).json({
      success: true,
      message: 'Interview started successfully',
      interview: {
        interviewId: mockInterview._id,
        totalQuestions: createdQuestions.length,
        currentQuestion: 1,
      },
      question: {
        questionId: createdQuestions[0]._id,
        questionNumber: 1,
        totalQuestions: createdQuestions.length,
        question: createdQuestions[0].question,
        timeLimit: (targetDuration || 15) * 60,
      },
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Current Question
export const getCurrentQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await InterviewQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      question: {
        questionId: question._id,
        questionNumber: question.questionNumber,
        question: question.question,
        category: question.category,
        difficulty: question.difficulty,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Submit Voice Answer
export const submitVoiceAnswer = async (req, res) => {
  try {
    const {
      questionId,
      transcript,
      recordingDuration,
      skipQuestion,
    } = req.body;

    if (!questionId) {
      return res.status(400).json({ message: 'Question ID is required' });
    }

    const question = await InterviewQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // If skipping question
    if (skipQuestion) {
      question.skipped = true;
      question.answered = false;
      question.answeredAt = new Date();
      await question.save();

      return res.status(200).json({
        success: true,
        message: 'Question skipped',
        questionId: question._id,
      });
    }

    // Process voice answer
    if (!transcript) {
      return res
        .status(400)
        .json({ message: 'Transcript is required for answered question' });
    }

    // Save voice transcript
    const voiceTranscript = await VoiceTranscript.create({
      interviewQuestionId: questionId,
      userId: req.userId,
      rawTranscription: transcript,
      cleanedTranscription: transcript.trim(),
      duration: recordingDuration || 0,
      wordCount: transcript.split(' ').length,
      confidence: 85, // placeholder - in real app, get from speech API
    });

    // Evaluate answer
    const evaluation = await evaluateAnswer(
      transcript,
      question.question,
      question.difficulty,
      null
    );

    // Update question with answer and feedback
    question.studentAnswer = transcript;
    question.studentTranscription = transcript;
    question.recordingDuration = recordingDuration || 0;
    question.answered = true;
    question.answeredAt = new Date();
    question.feedback = evaluation;

    await question.save();

    // Get next question
    const mockInterview = await MockInterview.findById(
      question.mockInterviewId
    ).populate('questions');
    const currentQuestionIndex = mockInterview.questions.findIndex(
      (q) => q._id.toString() === questionId
    );
    const nextQuestionIndex = currentQuestionIndex + 1;

    let nextQuestion = null;
    if (nextQuestionIndex < mockInterview.questions.length) {
      nextQuestion = mockInterview.questions[nextQuestionIndex];
    }

    // Update answered count
    mockInterview.answeredCount = await InterviewQuestion.countDocuments({
      mockInterviewId: question.mockInterviewId,
      answered: true,
    });

    await mockInterview.save();

    res.status(200).json({
      success: true,
      message: 'Answer submitted and evaluated',
      evaluation,
      nextQuestion: nextQuestion
        ? {
            questionId: nextQuestion._id,
            questionNumber: nextQuestion.questionNumber,
            question: nextQuestion.question,
            totalQuestions: mockInterview.questionsCount,
          }
        : null,
      isLastQuestion: !nextQuestion,
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Complete Interview and Generate Result
export const completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const mockInterview = await MockInterview.findById(interviewId).populate(
      'questions'
    );
    if (!mockInterview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (mockInterview.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Calculate interview statistics
    const questions = await InterviewQuestion.find({
      mockInterviewId: interviewId,
    });

    const answeredQuestions = questions.filter((q) => q.answered);
    const skippedQuestions = questions.filter((q) => q.skipped);

    // Calculate scores
    const feedbackArray = answeredQuestions
      .filter((q) => q.feedback)
      .map((q) => q.feedback);

    const calculateAverageScore = (field) => {
      if (feedbackArray.length === 0) return 0;
      const sum = feedbackArray.reduce((acc, fb) => {
        return acc + (fb[field]?.score || 0);
      }, 0);
      return Math.round(sum / feedbackArray.length);
    };

    const technicalScore = calculateAverageScore('technicalAccuracy');
    const communicationScore = calculateAverageScore('communicationSkills');
    const confidenceScore = calculateAverageScore('confidence');
    const fluencyScore = calculateAverageScore('fluency');
    const clarityScore = calculateAverageScore('clarity');
    const problemSolvingScore = calculateAverageScore('problemSolving');

    const overallScore = Math.round(
      (technicalScore +
        communicationScore +
        confidenceScore +
        fluencyScore +
        clarityScore +
        problemSolvingScore) /
        6
    );

    // Determine recommendation
    let recommendation = 'Needs Improvement';
    if (overallScore >= 80) {
      recommendation = 'Excellent';
    } else if (overallScore >= 70) {
      recommendation = 'Good';
    }

    // Extract strengths and weaknesses
    const allStrengths = feedbackArray.flatMap((fb) => fb.strengths || []);
    const allImprovements = feedbackArray.flatMap((fb) => fb.improvements || []);

    const strengths = [...new Set(allStrengths)].slice(0, 5);
    const weaknesses = [...new Set(allImprovements)].slice(0, 5);

    // Create interview result
    const interviewResult = await InterviewResult.create({
      mockInterviewId: interviewId,
      userId: req.userId,
      interviewType: mockInterview.interviewType,
      difficulty: mockInterview.difficulty,
      totalQuestions: questions.length,
      answeredQuestions: answeredQuestions.length,
      skippedQuestions: skippedQuestions.length,
      totalDuration: mockInterview.actualDuration || 0,
      scores: {
        overall: overallScore,
        technical: technicalScore,
        communication: communicationScore,
        confidence: confidenceScore,
        fluency: fluencyScore,
        clarity: clarityScore,
        problemSolving: problemSolvingScore,
      },
      recommendation,
      summary: generateInterviewSummary(
        overallScore,
        recommendation,
        mockInterview.interviewType
      ),
      strengths,
      weaknesses,
      improvementAreas: weaknesses,
      improvementTips: generateImprovementTips(mockInterview.interviewType),
      completedAt: new Date(),
    });

    // Update mock interview
    mockInterview.status = 'completed';
    mockInterview.interviewResult = interviewResult._id;
    mockInterview.completedAt = new Date();
    await mockInterview.save();

    res.status(200).json({
      success: true,
      message: 'Interview completed',
      result: {
        resultId: interviewResult._id,
        interviewId: mockInterview._id,
        overallScore,
        recommendation,
        totalQuestions: questions.length,
        answeredQuestions: answeredQuestions.length,
        scores: interviewResult.scores,
        summary: interviewResult.summary,
        strengths: interviewResult.strengths,
        weaknesses: interviewResult.weaknesses,
      },
    });
  } catch (error) {
    console.error('Error completing interview:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Interview Result
export const getInterviewResult = async (req, res) => {
  try {
    const { resultId } = req.params;

    const result = await InterviewResult.findById(resultId).populate({
      path: 'mockInterviewId',
      populate: { path: 'questions' },
    });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    if (result.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get detailed question feedback
    const questions = await InterviewQuestion.find({
      mockInterviewId: result.mockInterviewId._id,
    });

    const detailedQuestions = questions.map((q) => ({
      questionNumber: q.questionNumber,
      question: q.question,
      studentAnswer: q.studentAnswer,
      feedback: q.feedback,
      skipped: q.skipped,
    }));

    res.status(200).json({
      success: true,
      result: {
        resultId: result._id,
        interviewType: result.interviewType,
        difficulty: result.difficulty,
        scores: result.scores,
        recommendation: result.recommendation,
        summary: result.summary,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        improvementTips: result.improvementTips,
        totalQuestions: result.totalQuestions,
        answeredQuestions: result.answeredQuestions,
        skippedQuestions: result.skippedQuestions,
        totalDuration: result.totalDuration,
        questions: detailedQuestions,
        completedAt: result.completedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Interview History
export const getVoiceInterviewHistory = async (req, res) => {
  try {
    const { type, difficulty, limit = 10, skip = 0 } = req.query;

    const filter = { userId: req.userId };
    if (type) filter.interviewType = type;
    if (difficulty) filter.difficulty = difficulty;

    const interviews = await MockInterview.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('interviewResult');

    const total = await MockInterview.countDocuments(filter);

    // Calculate statistics
    const results = await InterviewResult.find({ userId: req.userId });

    const stats = {
      totalInterviews: results.length,
      averageScore: results.length
        ? Math.round(
            results.reduce((sum, r) => sum + (r.scores.overall || 0), 0) /
              results.length
          )
        : 0,
      bestScore: results.length
        ? Math.max(...results.map((r) => r.scores.overall || 0))
        : 0,
      interviews: interviews.map((interview) => ({
        interviewId: interview._id,
        title: interview.title,
        type: interview.interviewType,
        difficulty: interview.difficulty,
        status: interview.status,
        questionsCount: interview.questionsCount,
        answeredCount: interview.answeredCount,
        score: interview.interviewResult?.scores.overall || null,
        recommendation: interview.interviewResult?.recommendation || null,
        createdAt: interview.createdAt,
        completedAt: interview.completedAt,
      })),
    };

    res.status(200).json({
      success: true,
      stats,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper functions
const generateInterviewSummary = (score, recommendation, interviewType) => {
  const summaries = {
    Excellent: `Congratulations! You demonstrated excellent performance in this ${interviewType}. Your strong communication, technical knowledge, and problem-solving skills were evident throughout. Keep maintaining this level of excellence.`,
    Good: `Good performance in this ${interviewType}. You showed solid understanding and communication skills. Focus on the areas identified for improvement to reach the next level.`,
    'Needs Improvement': `You have potential in this ${interviewType}. Review the feedback carefully and practice on the identified weak areas. Consistent practice will help you improve.`,
    Poor: `This ${interviewType} revealed several areas needing improvement. We recommend focused practice and study before attempting another interview.`,
  };

  return (
    summaries[recommendation] ||
    `You scored ${score}/100 in this ${interviewType}.`
  );
};

const generateImprovementTips = (interviewType) => {
  const tips = {
    'HR Interview': [
      'Practice storytelling with concrete examples from your experience',
      'Work on presenting your achievements in a structured way',
      'Develop answers to common HR questions beforehand',
      'Practice maintaining composure and confidence',
      'Focus on showing alignment with company values',
    ],
    'Technical Interview': [
      'Study data structures and algorithms thoroughly',
      'Practice coding problems on platforms like LeetCode',
      'Understand system design principles',
      'Be able to explain your thought process clearly',
      'Review fundamental concepts regularly',
    ],
    'React Interview': [
      'Master React hooks and their use cases',
      'Understand component lifecycle deeply',
      'Practice building components from scratch',
      'Learn performance optimization techniques',
      'Stay updated with latest React features',
    ],
    'Node.js Interview': [
      'Understand async/await and Promise patterns',
      'Master Express.js framework',
      'Learn about middleware and error handling',
      'Practice building REST APIs',
      'Understand event-driven architecture',
    ],
    'Java Interview': [
      'Master OOP concepts thoroughly',
      'Understand Java collections framework',
      'Practice multithreading concepts',
      'Learn about exception handling',
      'Study design patterns',
    ],
    'Database Interview': [
      'Master SQL query optimization',
      'Understand indexing strategies',
      'Learn about transaction management',
      'Practice complex join queries',
      'Understand database normalization',
    ],
  };

  return tips[interviewType] || [
    'Practice more mock interviews',
    'Review feedback from previous interviews',
    'Study relevant concepts',
    'Improve communication skills',
    'Build practical projects',
  ];
};

export default {
  startVoiceMockInterview,
  getCurrentQuestion,
  submitVoiceAnswer,
  completeInterview,
  getInterviewResult,
  getVoiceInterviewHistory,
};
