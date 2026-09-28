import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ScoreCard, CombinedScoreCard } from '../components/ScoreCard';
import { mockInterviewAPI } from '../services/api';
import {
  Download,
  Share2,
  ArrowLeft,
  Award,
  MessageCircle,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

const InterviewResults = () => {
  const { resultId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      const response = await mockInterviewAPI.getResult(resultId);
      setResult(response.data.result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching result:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50/50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 page-container flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading results...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen bg-slate-50/50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 page-container flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Results Not Found
              </h2>
              <button
                onClick={() => navigate('/interview')}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
              >
                Back to Interviews
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const durationInMinutes = Math.round(result.totalDuration / 60);

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 page-container">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/interview')}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Interviews
              </button>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors">
                  <Download className="w-5 h-5" />
                  Download Report
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Overall Score Card */}
            <CombinedScoreCard
              overallScore={result.scores.overall}
              recommendation={result.recommendation}
              duration={durationInMinutes}
            />

            {/* Summary */}
            {result.summary && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Summary</h2>
                <p className="text-slate-700 leading-relaxed">{result.summary}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 bg-white rounded-t-xl p-4">
              {['overview', 'detailed', 'suggestions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                    activeTab === tab
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'overview' && 'Score Breakdown'}
                  {tab === 'detailed' && 'Detailed Feedback'}
                  {tab === 'suggestions' && 'Improvement Plan'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-xl border border-slate-200 border-t-0 p-8 shadow-sm">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <ScoreCard
                    score={result.scores.technical}
                    label="Technical Accuracy"
                    icon={BarChart3}
                    color="text-blue-600"
                  />
                  <ScoreCard
                    score={result.scores.communication}
                    label="Communication"
                    icon={MessageCircle}
                    color="text-green-600"
                  />
                  <ScoreCard
                    score={result.scores.confidence}
                    label="Confidence"
                    icon={Zap}
                    color="text-yellow-600"
                  />
                  <ScoreCard
                    score={result.scores.fluency}
                    label="Fluency"
                    icon={TrendingUp}
                    color="text-purple-600"
                  />
                  <ScoreCard
                    score={result.scores.clarity}
                    label="Clarity"
                    icon={Target}
                    color="text-red-600"
                  />
                  <ScoreCard
                    score={result.scores.problemSolving}
                    label="Problem Solving"
                    icon={Award}
                    color="text-orange-600"
                  />
                </div>
              )}

              {activeTab === 'detailed' && (
                <div className="space-y-6">
                  {/* Strengths */}
                  {result.strengths && result.strengths.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Target className="w-6 h-6 text-green-600" />
                        Your Strengths
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {result.strengths.map((strength, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-green-50 border border-green-200 rounded-lg"
                          >
                            <p className="text-green-900">{strength}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {result.weaknesses && result.weaknesses.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-yellow-600" />
                        Areas for Improvement
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {result.weaknesses.map((weakness, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                          >
                            <p className="text-yellow-900">{weakness}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-600">
                        {result.totalQuestions}
                      </p>
                      <p className="text-sm text-slate-600">Total Questions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {result.answeredQuestions}
                      </p>
                      <p className="text-sm text-slate-600">Answered</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">
                        {result.skippedQuestions}
                      </p>
                      <p className="text-sm text-slate-600">Skipped</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-600">
                        {durationInMinutes}m
                      </p>
                      <p className="text-sm text-slate-600">Duration</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div className="space-y-6">
                  {result.improvementTips && result.improvementTips.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4">
                        Recommended Practice Areas
                      </h3>
                      <div className="space-y-3">
                        {result.improvementTips.map((tip, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3"
                          >
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-blue-900">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Steps */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-lg">
                    <h3 className="font-bold text-slate-900 mb-3">Next Steps</h3>
                    <ol className="space-y-2 text-slate-700">
                      <li className="flex gap-3">
                        <span className="font-bold text-primary-600">1.</span>
                        <span>Focus on your identified weak areas</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-primary-600">2.</span>
                        <span>Take another mock interview in 7 days</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-primary-600">3.</span>
                        <span>Track your progress over time</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-primary-600">4.</span>
                        <span>Practice with different difficulty levels</span>
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pb-8">
              <button
                onClick={() => navigate('/interview')}
                className="px-8 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Back to Interviews
              </button>
              <button
                onClick={() => navigate('/interview')}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-purple-700 transition-all"
              >
                Take Another Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewResults;
