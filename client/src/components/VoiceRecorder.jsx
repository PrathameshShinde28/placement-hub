import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, RotateCcw, Play, Pause } from 'lucide-react';

const VoiceRecorder = ({
  onRecordingComplete,
  maxDuration = 300,
  onDurationChange,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in this browser');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsSpeaking(true);
      setError(null);
    };

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = transcript;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcriptSegment + ' ';
        } else {
          interimTranscript += transcriptSegment;
        }
      }

      setTranscript(finalTranscript + interimTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'network') {
        setError('Network error. Please check your connection.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please speak clearly.');
      } else {
        setError(`Error: ${event.error}`);
      }
    };

    recognitionRef.current.onend = () => {
      setIsSpeaking(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [transcript]);

  // Timer logic
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          onDurationChange?.(newDuration);

          if (newDuration >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newDuration;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused, maxDuration, onDurationChange]);

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      setTranscript('');
      audioChunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup audio recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });
        onRecordingComplete({
          audio: audioBlob,
          transcript: transcript.trim(),
          duration,
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access.');
      console.error('Error accessing microphone:', err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Pause/Resume recording
  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        recognitionRef.current?.start();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        recognitionRef.current?.abort();
        setIsPaused(true);
      }
    }
  };

  // Reset recording
  const resetRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      stopRecording();
    }
    setDuration(0);
    setTranscript('');
    setError(null);
  };

  // Format duration as MM:SS
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const timeRemaining = maxDuration - duration;
  const isTimeRunningOut = timeRemaining < 30;

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Recorder Status */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border border-primary-200">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isRecording
                ? 'bg-red-500 animate-pulse'
                : 'bg-slate-300'
            }`}
          />
          <div>
            <p className="text-sm font-medium text-slate-900">
              {isRecording
                ? isPaused
                  ? 'Recording Paused'
                  : 'Recording...'
                : 'Ready to Record'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {isSpeaking && isRecording && 'Listening...'}
            </p>
          </div>
        </div>

        {/* Timer */}
        <div
          className={`text-2xl font-mono font-bold ${
            isTimeRunningOut ? 'text-red-600' : 'text-slate-900'
          }`}
        >
          {formatDuration(duration)}
          <span className="text-xs text-slate-500 ml-2">
            / {formatDuration(maxDuration)}
          </span>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="flex gap-3 justify-center">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={disabled}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </button>
        ) : (
          <>
            <button
              onClick={togglePause}
              className="flex items-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              )}
            </button>

            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Square className="w-5 h-5" />
              Stop & Submit
            </button>

            <button
              onClick={resetRecording}
              className="flex items-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs font-semibold text-slate-600 mb-2">
            LIVE TRANSCRIPT
          </p>
          <p className="text-sm text-slate-800 leading-relaxed">
            {transcript}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Words: {transcript.split(' ').filter((w) => w).length}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Speak clearly and naturally. You can pause and
          resume recording. Maximum duration is {formatDuration(maxDuration)}.
        </p>
      </div>
    </div>
  );
};

export default VoiceRecorder;
