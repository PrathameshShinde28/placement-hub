import React, { useEffect, useRef } from 'react';
import { Volume2, MessageCircle } from 'lucide-react';

const AIInterviewer = ({ question, isAsking = false, onDone }) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const syntheticRef = useRef(null);

  // Text-to-Speech functionality
  useEffect(() => {
    if (isAsking && question) {
      speakQuestion();
    }
  }, [isAsking, question]);

  const speakQuestion = () => {
    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(question);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      onDone?.();
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeech = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speakQuestion();
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Avatar */}
      <div className="flex justify-center">
        <div
          className={`w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg transition-all ${
            isSpeaking ? 'animate-pulse ring-4 ring-primary-200' : ''
          }`}
        >
          <MessageCircle className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="flex justify-center">
          <div className="flex gap-1 items-center">
            <div className="w-1 h-6 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-1 h-8 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-1 h-6 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}

      {/* Question Display */}
      <div className="p-6 bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl border-2 border-primary-200">
        <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
          Interview Question
        </p>
        <p className="text-lg font-medium text-slate-900 leading-relaxed">
          {question}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={toggleSpeech}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          <Volume2 className="w-5 h-5" />
          {isSpeaking ? 'Stop Speaking' : 'Repeat Question'}
        </button>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Instructions:</strong> Listen to the question carefully, then click
          "Start Recording" below to record your answer. You have up to 5 minutes to
          answer.
        </p>
      </div>
    </div>
  );
};

export default AIInterviewer;
