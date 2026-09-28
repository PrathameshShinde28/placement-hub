import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { mockInterviewAPI } from '../services/api';
import { Mic2, Filter, TrendingUp, Calendar, Award } from 'lucide-react';

const InterviewHistory = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    difficulty: 'all',
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchInterviews();
  }, [filters, page]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 10,
        skip: (page - 1) * 10,
      };

      if (filters.type !== 'all') {
        params.type = filters.type;
      }
      if (filters.difficulty !== 'all') {
        params.difficulty = filters.difficulty;
      }

      const response = await mockInterviewAPI.getHistory(params);
      setInterviews(response.data.stats.interviews);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setLoading(false);
    }
  };

  const interviewTypes = [
    'All Types',
    'HR Interview',
    'Technical Interview',
    'Behavioral Interview',
    'System Design Interview',
  ];

  const difficulties = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  const getRecommendationColor = (rec) => {
    switch (rec) {
      case 'Excellent':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Good':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Needs Improvement':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 page-container">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="page-title flex items-center gap-3">
                <Mic2 className="w-8 h-8 text-primary-600" />
                Interview History
              </h1>
              <p className="text-slate-600 mt-2">
                Track your mock interview performance over time
              </p>
            </div>

            {/* Statistics Cards */}
            {stats && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-slate-600 uppercase">
                      Total Interviews
                    </p>
                    <Mic2 className="w-8 h-8 text-primary-600" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.totalInterviews}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Completed interviews
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-slate-600 uppercase">
                      Average Score
                    </p>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className={`text-3xl font-bold ${getScoreColor(stats.averageScore)}`}>
                    {stats.averageScore}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">out of 100</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-slate-600 uppercase">
                      Best Score
                    </p>
                    <Award className="w-8 h-8 text-yellow-600" />
                  </div>
                  <p className={`text-3xl font-bold ${getScoreColor(stats.bestScore)}`}>
                    {stats.bestScore}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">highest score</p>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-600">Filter by:</span>
              </div>

              <select
                value={filters.type}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, type: e.target.value }));
                  setPage(1);
                }}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                {interviewTypes.map((type) => (
                  <option
                    key={type}
                    value={type === 'All Types' ? 'all' : type}
                  >
                    {type}
                  </option>
                ))}
              </select>

              <select
                value={filters.difficulty}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, difficulty: e.target.value }));
                  setPage(1);
                }}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                {difficulties.map((diff) => (
                  <option
                    key={diff}
                    value={diff === 'All Levels' ? 'all' : diff}
                  >
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            {/* Interviews List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-600">Loading interviews...</p>
                </div>
              ) : interviews.length === 0 ? (
                <div className="p-12 text-center">
                  <Mic2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">No interviews yet</p>
                  <button
                    onClick={() => navigate('/interview')}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                  >
                    Start an Interview
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                          Interview Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                          Difficulty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                          Questions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {interviews.map((interview) => (
                        <tr
                          key={interview.interviewId}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-900">
                              {interview.type}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-600">
                              {interview.difficulty}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-600">
                              {interview.answeredCount}/{interview.questionsCount}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            {interview.score ? (
                              <p className={`text-sm font-bold ${getScoreColor(interview.score)}`}>
                                {interview.score}/100
                              </p>
                            ) : (
                              <p className="text-sm text-slate-400">-</p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                interview.recommendation
                                  ? getRecommendationColor(interview.recommendation)
                                  : 'bg-slate-100 text-slate-800 border-slate-300'
                              }`}
                            >
                              {interview.recommendation || interview.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-600 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(interview.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                navigate(`/interview/results/${interview.interviewId}`)
                              }
                              className="text-sm font-medium text-primary-600 hover:text-primary-700"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="text-center pb-8">
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

export default InterviewHistory;
