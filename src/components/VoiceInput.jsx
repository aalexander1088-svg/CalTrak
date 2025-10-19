import React, { useState, useEffect } from 'react';
import { Mic, MicOff, RotateCcw } from 'lucide-react';
import { analyzeFood } from '../utils/claude';

const VoiceInput = ({ onMealAnalyzed, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          handleAnalyzeFood(transcript.trim());
        }
      };

      setRecognition(recognition);
    }
  }, []);

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript('');
      setError(null);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const handleAnalyzeFood = async (foodDescription) => {
    if (!foodDescription.trim()) return;

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeFood(foodDescription);
      onMealAnalyzed(analysis);
    } catch (err) {
      onError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setError(null);
  };

  if (!isSupported) {
    return (
      <div className="card text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MicOff className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Speech Recognition Not Supported</h3>
        <p className="text-gray-600 mb-4">
          Your browser doesn't support speech recognition. Please use Chrome, Safari, or Edge.
        </p>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Try typing your meal instead:</p>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            rows="3"
            placeholder="e.g., I had two eggs, toast, and a coffee"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
          <button
            onClick={() => handleAnalyzeFood(transcript)}
            disabled={!transcript.trim() || isAnalyzing}
            className="mt-3 btn-primary w-full"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Food'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card text-center">
      <div className="mb-6">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 animate-pulse' 
            : isAnalyzing 
            ? 'bg-yellow-500 animate-spin' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}>
          {isAnalyzing ? (
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isAnalyzing}
              className="text-white"
            >
              {isListening ? (
                <MicOff className="w-10 h-10" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {isListening ? 'Listening...' : isAnalyzing ? 'Analyzing...' : 'Tap to Talk'}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {isListening 
            ? 'Speak clearly about what you ate' 
            : isAnalyzing 
            ? 'Processing your meal...' 
            : 'Describe your meal or snack'
          }
        </p>
      </div>

      {transcript && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-gray-900">Transcript:</h4>
            <button
              onClick={clearTranscript}
              className="text-gray-400 hover:text-gray-600"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-700 text-left">{transcript}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {!isListening && !isAnalyzing && transcript && (
        <button
          onClick={() => handleAnalyzeFood(transcript)}
          className="btn-primary w-full"
        >
          Analyze This Meal
        </button>
      )}
    </div>
  );
};

export default VoiceInput;
