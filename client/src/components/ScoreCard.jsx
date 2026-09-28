import React from 'react';
import { Award, TrendingUp, MessageCircle, Zap } from 'lucide-react';

const ScoreCard = ({ score, maxScore = 100, label, icon: Icon, color = 'bg-primary-500' }) => {
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = (pct) => {
    if (pct >= 80) return 'text-green-600';
    if (pct >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (pct) => {
    if (pct >= 80) return 'bg-green-500';
    if (pct >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-sm transition-all">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-purple-100 mb-3">
        <Icon className={`w-6 h-6 ${color} text-opacity-90`} />
      </div>

      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
        {label}
      </p>

      <div className="relative w-20 h-20 mb-3">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * 282.7} 282.7`}
            className={getProgressColor(percentage)}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
            {Math.round(score)}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-500">out of {maxScore}</p>

      {/* Score Label */}
      <div className="mt-3 px-2 py-1 bg-slate-100 rounded text-xs font-medium">
        {percentage >= 80 && <span className="text-green-700">Excellent</span>}
        {percentage >= 60 && percentage < 80 && <span className="text-yellow-700">Good</span>}
        {percentage < 60 && <span className="text-red-700">Needs Work</span>}
      </div>
    </div>
  );
};

// Combined Score Display
const CombinedScoreCard = ({ overallScore, recommendation, duration }) => {
  const getRecommendationColor = (rec) => {
    switch (rec) {
      case 'Excellent':
        return 'from-green-500 to-emerald-600';
      case 'Good':
        return 'from-blue-500 to-cyan-600';
      case 'Needs Improvement':
        return 'from-yellow-500 to-orange-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getRecommendationColor(recommendation)} rounded-2xl p-8 text-white shadow-xl`}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-white/80 text-sm font-medium mb-2">OVERALL SCORE</p>
          <div className="text-6xl font-bold">{overallScore}</div>
          <p className="text-white/80 text-sm mt-2">out of 100</p>
        </div>
        <Award className="w-16 h-16 text-white/30" />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80 mb-1">Recommendation</p>
          <p className="text-2xl font-bold">{recommendation}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/80 mb-1">Duration</p>
          <p className="text-xl font-semibold">{duration} min</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 w-full bg-white/20 rounded-full h-2">
        <div
          className="bg-white h-2 rounded-full transition-all duration-500"
          style={{ width: `${overallScore}%` }}
        />
      </div>
    </div>
  );
};

export { ScoreCard, CombinedScoreCard };
