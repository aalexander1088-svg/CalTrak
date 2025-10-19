import React, { useState, useEffect } from 'react';
import { Mic, MicOff, RotateCcw, Type, X, Loader } from 'lucide-react';
import { analyzeFood } from '../utils/claude';
import { 
  isSpeechRecognitionSupported, 
  createSpeechRecognition,
  requestMicrophonePermission,
  checkMicrophonePermission
} from '../utils/voice';

const VoiceInput = ({ onMealAnalyzed, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    // Check if speech recognition is supported
    if (isSpeechRecognitionSupported()) {
      setIsSupported(true);
      
      // Check microphone permission
      checkMicrophonePermission().then(permission => {
        setHasPermission(permission);
      });
      
      try {
        const recognition = createSpeechRecognition();
        
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
          if (event.error === 'not-allowed') {
            setError('Microphone permission denied. Please allow microphone access and refresh the page.');
            setHasPermission(false);
          } else {
            setError(`Speech recognition error: ${event.error}`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          if (transcript.trim()) {
            handleAnalyzeFood(transcript.trim());
          }
        };

        setRecognition(recognition);
      } catch (err) {
        setError('Failed to initialize speech recognition');
      }
    }
  }, []);

  const startListening = async () => {
    if (!hasPermission) {
      const granted = await requestMicrophonePermission();
      if (!granted) {
        setError('Microphone permission is required for voice input. Please allow microphone access.');
        return;
      }
      setHasPermission(true);
    }
    
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

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleAnalyzeFood(textInput.trim());
      setTextInput('');
      setShowTextInput(false);
    }
  };

  const toggleTextInput = () => {
    setShowTextInput(!showTextInput);
    setTextInput('');
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
        
        <h3 className="text-xl font-semibold text-slate-200 mb-2">
          {isListening ? 'Listening...' : isAnalyzing ? 'Analyzing...' : 'Tap to Talk'}
        </h3>
        
        <p className="text-slate-400 mb-4">
          {isListening 
            ? 'Speak clearly about what you ate' 
            : isAnalyzing 
            ? 'Processing your meal...' 
            : 'Describe your meal or snack'
          }
        </p>
      </div>

      {transcript && (
        <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-slate-200">Transcript:</h4>
            <button
              onClick={clearTranscript}
              className="text-slate-400 hover:text-slate-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-300 text-left">{transcript}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
          {error.includes('permission') && (
            <div className="mt-3 flex space-x-2">
              <button
                onClick={toggleTextInput}
                className="flex-1 btn-secondary text-sm py-2"
              >
                <Type className="w-4 h-4 mr-2 inline" />
                Use Text Input Instead
              </button>
            </div>
          )}
        </div>
      )}

      {showTextInput && (
        <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-slate-200">Text Input</h4>
            <button
              onClick={toggleTextInput}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="input-field mb-3"
            rows="3"
            placeholder="Describe your meal or snack..."
            autoFocus
          />
          <div className="flex space-x-2">
            <button
              onClick={toggleTextInput}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleTextSubmit}
              disabled={!textInput.trim() || isAnalyzing}
              className="flex-1 btn-primary"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin inline" />
                  Analyzing...
                </>
              ) : (
                'Analyze Meal'
              )}
            </button>
          </div>
        </div>
      )}

      {!showTextInput && !error && (
        <div className="flex justify-center">
          <button
            onClick={toggleTextInput}
            className="btn-secondary text-sm py-2 px-4"
          >
            <Type className="w-4 h-4 mr-2 inline" />
            Or type instead
          </button>
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
