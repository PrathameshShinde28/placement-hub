import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import VoiceRecorder from '../components/VoiceRecorder';
import AIInterviewer from '../components/AIInterviewer';
import WaveAnimation from '../components/WaveAnimation';
import FeedbackPanel from '../components/FeedbackPanel';
import { mockInterviewAPI } from '../services/api';
import { Clock, ChevronRight, SkipForward } from 'lucide-react';

const InterviewSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    interviewId,
    questionId,
    currentQuestion,
    totalQuestions,
    question,
    timeLimit,
  } = location.state || {};

  const [sessionState, setSessionState] = useState('question'); // question, recording, feedback
  const [currentQuestionData, setCurrentQuestionData] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(timeLimit || 900); // 15 min default
  const [questionStartTime, setQuestionStartTime] = useState(null);

  useEffect(() => {
    if (!interviewId || !questionId) {
      navigate('/interview');
      return;
    }
    
    setQuestionStartTime(new Date());
    fetchQuestion();
  }, []);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimer((prev) => {
        if (prev <= 1) {
          // Auto-complete interview
          completeInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchQuestion = async () => {
    try {
      const response = await mockInterviewAPI.getCurrentQuestion(questionId);
      setCurrentQuestionData(response.data.question);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecordingComplete = async (recordingData) => {
    setIsSubmitting(true);

    try {
      const response = await mockInterviewAPI.submitAnswer({
        questionId,
        transcript: recordingData.transcript,
        recordingDuration: recordingData.duration,
        skipQuestion: false,
      });

      setFeedback(response.data.evaluation);
      setSessionState('feedback');

      // Auto-advance after feedback
      setTimeout(() => {
        if (response.data.isLastQuestion) {
          completeInterview();
        } else {
          moveToNextQuestion(response.data.nextQuestion);
        }
      }, 3000);
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Error submitting answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipQuestion = async () => {
    try {
      const response = await mockInterviewAPI.submitAnswer({
        questionId,
        skipQuestion: true,
      });

      if (response.data.message === 'Question skipped') {
        if (currentQuestion < totalQuestions) {
          // Move to next question
          // In a real app, fetch next question
          alert('Proceeding to next question...');
        } else {
          completeInterview();
        }
      }
    } catch (error) {
      console.error('Error skipping question:', error);
    }
  };

  const moveToNextQuestion = (nextQuestion) => {
    if (nextQuestion) {
      setCurrentQuestionData(nextQuestion);
      setFeedback(null);
      setSessionState('question');
      setQuestionStartTime(new Date());
    } else {
      completeInterview();
    }
  };

  const completeInterview = async () => {
    try {
      const response = await mockInterviewAPI.completeInterview(interviewId);
      navigate(`/interview/results/${response.data.result.resultId}`, {
        state: { result: response.data.result },
      });
    } catch (error) {
      console.error('Error completing interview:', error);
      alert('Error completing interview. Please try again.');
    }
  };

  if (!interviewId) {
    return (
      <div className="flex min-h-screen bg-slate-50/50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 page-container flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Invalid Session
              </h2>
              <button
                onClick={() => navigate('/interview')}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
              >
                Back to Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 page-container">
          <div className="max-w-4xl mx-auto">
            {/* Header with Progress */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Interview Session
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Question {currentQuestion} of {totalQuestions}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Timer */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg border border-primary-200">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <span className="font-mono font-bold text-slate-900">
                      {formatTime(sessionTimer)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-32">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-purple-600 transition-all duration-300"
                        style={{
                          width: `${(currentQuestion / totalQuestions) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1 text-center">
                      {Math.round(
                        (currentQuestion / totalQuestions) * 100
                      )}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Recording Duration Display */}
              {sessionState === 'recording' && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Recording time: {Math.floor(recordingDuration / 60)}:
                  {(recordingDuration % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>

            {/* Question and Recording Area */}
            <div className="space-y-6">
              {sessionState === 'question' && (
                <>
                  {/* AI Interviewer */}
                  <AIInterviewer
                    question={currentQuestionData?.question || question}
                    isAsking={true}
                    onDone={() => {
                      // Optional: trigger action when AI finishes speaking
                    }}
                  />

                  {/* Recording Interface */}
                  <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">
                      Record Your Answer
                    </h2>

                    <VoiceRecorder
                      onRecordingComplete={handleRecordingComplete}
                      maxDuration={300} // 5 minutes per question
                      onDurationChange={setRecordingDuration}
                      disabled={isSubmitting}
                    />

                    {/* Skip Button */}
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={handleSkipQuestion}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <SkipForward className="w-4 h-4" />
                        Skip Question
                      </button>

                      <button
                        onClick={completeInterview}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                      >
                        End Interview
                      </button>
                    </div>
                  </div>
                </>
              )}

              {sessionState === 'feedback' && feedback && (
                <>
                  <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">
                      Feedback
                    </h2>

                    <FeedbackPanel
                      feedback={feedback}
                      questionNumber={currentQuestion}
                      totalQuestions={totalQuestions}
                    />

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Moving to next question in a moment...
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
