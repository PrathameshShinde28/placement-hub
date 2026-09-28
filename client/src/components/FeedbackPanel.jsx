import React from 'react';
import { ChevronDown, ChevronUp, Lightbulb, Target, AlertCircle } from 'lucide-react';

const FeedbackPanel = ({ feedback, questionNumber, totalQuestions }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!feedback) {
    return (
      <div className="p-4 bg-slate-100 rounded-lg text-slate-600">
        No feedback available
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg border border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase mb-1">
              Question {questionNumber} of {totalQuestions}
            </p>
            <p className="text-sm text-slate-700">Overall Assessment</p>
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
            {feedback.overallScore}
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        {feedback.technicalAccuracy && (
          <div className={`p-3 rounded-lg border ${getScoreColor(feedback.technicalAccuracy.score)}`}>
            <p className="text-xs font-semibold mb-1">Technical</p>
            <p className="text-lg font-bold">{feedback.technicalAccuracy.score}</p>
          </div>
        )}
        {feedback.communicationSkills && (
          <div className={`p-3 rounded-lg border ${getScoreColor(feedback.communicationSkills.score)}`}>
            <p className="text-xs font-semibold mb-1">Communication</p>
            <p className="text-lg font-bold">{feedback.communicationSkills.score}</p>
          </div>
        )}
        {feedback.confidence && (
          <div className={`p-3 rounded-lg border ${getScoreColor(feedback.confidence.score)}`}>
            <p className="text-xs font-semibold mb-1">Confidence</p>
            <p className="text-lg font-bold">{feedback.confidence.score}</p>
          </div>
        )}
        {feedback.clarity && (
          <div className={`p-3 rounded-lg border ${getScoreColor(feedback.clarity.score)}`}>
            <p className="text-xs font-semibold mb-1">Clarity</p>
            <p className="text-lg font-bold">{feedback.clarity.score}</p>
          </div>
        )}
      </div>

      {/* Expandable Details */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between transition-colors"
      >
        <span className="font-medium text-slate-900">Detailed Feedback</span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-600" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          {/* Technical Comment */}
          {feedback.technicalAccuracy && (
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-1">
                Technical Accuracy
              </p>
              <p className="text-sm text-slate-700">
                {feedback.technicalAccuracy.comment}
              </p>
            </div>
          )}

          {/* Communication Comment */}
          {feedback.communicationSkills && (
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-1">
                Communication Skills
              </p>
              <p className="text-sm text-slate-700">
                {feedback.communicationSkills.comment}
              </p>
            </div>
          )}

          {/* Confidence Comment */}
          {feedback.confidence && (
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-1">
                Confidence Level
              </p>
              <p className="text-sm text-slate-700">{feedback.confidence.comment}</p>
            </div>
          )}

          {/* Clarity Comment */}
          {feedback.clarity && (
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-1">
                Answer Clarity
              </p>
              <p className="text-sm text-slate-700">{feedback.clarity.comment}</p>
            </div>
          )}

          {/* Suggested Answer */}
          {feedback.suggestedAnswer && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-start gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-semibold text-blue-900">
                  Suggested Answer
                </p>
              </div>
              <p className="text-sm text-blue-800">{feedback.suggestedAnswer}</p>
            </div>
          )}

          {/* Strengths */}
          {feedback.strengths && feedback.strengths.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <p className="text-sm font-semibold text-slate-900">Strengths</p>
              </div>
              <ul className="space-y-1 ml-7">
                {feedback.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-green-700">
                    • {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {feedback.improvements && feedback.improvements.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <p className="text-sm font-semibold text-slate-900">
                  Areas for Improvement
                </p>
              </div>
              <ul className="space-y-1 ml-7">
                {feedback.improvements.map((improvement, idx) => (
                  <li key={idx} className="text-sm text-orange-700">
                    • {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Points */}
          {feedback.keyPoints && feedback.keyPoints.length > 0 && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded">
              <p className="text-sm font-semibold text-purple-900 mb-2">
                Key Points to Remember
              </p>
              <ul className="space-y-1">
                {feedback.keyPoints.map((point, idx) => (
                  <li key={idx} className="text-sm text-purple-800">
                    • {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackPanel;
