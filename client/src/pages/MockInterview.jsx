import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Mic2, Clock, BookOpen, Zap, ArrowRight } from 'lucide-react';
import { mockInterviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MockInterview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    interviewType: 'Technical Interview',
    difficulty: 'Intermediate',
    domain: 'General',
    targetDuration: 15,
    numberOfQuestions: 5,
  });

  const interviewTypes = [
    'HR Interview',
    'Technical Interview',
    'Aptitude Discussion',
    'Behavioral Interview',
    'System Design Interview',
    'Java Interview',
    'React Interview',
    'Node.js Interview',
    'Database Interview',
    'DSA Interview',
    'Full Stack Interview',
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const domains = [
    'General',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'DevOps',
    'Cloud',
    'Security',
  ];

  // Fetch interview history
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await mockInterviewAPI.getHistory({
        limit: 5,
      });
      setInterviewHistory(response.data.stats.interviews);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await mockInterviewAPI.startInterview(formData);
      
      // Navigate to interview session
      navigate('/interview/session', {
        state: {
          interviewId: response.data.interview.interviewId,
          questionId: response.data.question.questionId,
          currentQuestion: response.data.interview.currentQuestion,
          totalQuestions: response.data.question.totalQuestions,
          question: response.data.question.question,
          timeLimit: response.data.question.timeLimit,
        },
      });
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 page-container">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="page-title flex items-center gap-3">
                  <Mic2 className="w-8 h-8 text-primary-600" />
                  Voice Mock Interview
                </h1>
                <p className="text-slate-600 mt-2">
                  Practice your interview skills with AI-powered voice interviews
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Interview Setup Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">
                    Start New Interview
                  </h2>

                  <form onSubmit={handleStartInterview} className="space-y-6">
                    {/* Interview Type */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Interview Type
                      </label>
                      <select
                        name="interviewType"
                        value={formData.interviewType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
                      >
                        {interviewTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Difficulty Level
                      </label>
                      <div className="flex gap-3">
                        {difficulties.map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                difficulty: level,
                              }))
                            }
                            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                              formData.difficulty === level
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Domain */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Domain (Optional)
                      </label>
                      <select
                        name="domain"
                        value={formData.domain}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
                      >
                        {domains.map((domain) => (
                          <option key={domain} value={domain}>
                            {domain}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Duration and Number of Questions */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          name="targetDuration"
                          value={formData.targetDuration}
                          onChange={handleInputChange}
                          min="5"
                          max="120"
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
                        />
                        <p className="text-xs text-slate-500 mt-1">5-120 minutes</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          Number of Questions
                        </label>
                        <input
                          type="number"
                          name="numberOfQuestions"
                          value={formData.numberOfQuestions}
                          onChange={handleInputChange}
                          min="1"
                          max="15"
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
                        />
                        <p className="text-xs text-slate-500 mt-1">1-15 questions</p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>How it works:</strong> You'll answer{' '}
                        {formData.numberOfQuestions} interview questions using your
                        microphone. AI will evaluate your responses on communication,
                        technical knowledge, and more.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Starting Interview...
                        </>
                      ) : (
                        <>
                          <Mic2 className="w-5 h-5" />
                          Start Voice Interview
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Features and Recent Interviews */}
              <div className="space-y-6">
                {/* Features */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-4">Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Mic2 className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Voice Input
                        </p>
                        <p className="text-xs text-slate-600">
                          Record your voice answers
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Zap className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          AI Evaluation
                        </p>
                        <p className="text-xs text-slate-600">
                          Get instant feedback
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Detailed Report
                        </p>
                        <p className="text-xs text-slate-600">
                          Score and suggestions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Clock className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Flexible Time
                        </p>
                        <p className="text-xs text-slate-600">
                          Choose interview duration
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Interviews */}
                {interviewHistory.length > 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-4">
                      Recent Interviews
                    </h3>
                    <div className="space-y-3">
                      {interviewHistory.slice(0, 3).map((interview) => (
                        <button
                          key={interview.interviewId}
                          onClick={() =>
                            navigate(`/interview/results/${interview.interviewId}`)
                          }
                          className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-slate-900">
                              {interview.type}
                            </p>
                            <p className="text-sm font-bold text-primary-600">
                              {interview.score}/100
                            </p>
                          </div>
                          <p className="text-xs text-slate-600">
                            {interview.difficulty} • {interview.questionsCount} questions
                          </p>
                        </button>
                      ))}
                      <button
                        onClick={() => navigate('/interview/history')}
                        className="w-full mt-2 px-3 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-1"
                      >
                        View All <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;