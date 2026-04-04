import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSocket } from '../hooks/useSocket';
import { isQuestion } from '../utils/questionDetector';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [transcripts, setTranscripts] = useState([]); // Stores history of recognized text with timestamps

  const {
    isConnected,
    aiResponse,
    status,
    history,
    sendTranscription
  } = useSocket();

  const handleFinalTranscript = (text) => {
    const questionFlag = isQuestion(text);
    
    // Add to local transcript log
    setTranscripts(prev => [...prev, {
      id: Date.now(),
      text,
      isQuestion: questionFlag,
      timestamp: new Date().toISOString()
    }]);

    // Automatically send to socket
    sendTranscription(text, questionFlag);
  };

  const submitText = (text) => {
    // Manually typed inputs are ALWAYS treated as questions/prompts
    setTranscripts(prev => [...prev, {
      id: Date.now(),
      text,
      isQuestion: true,
      timestamp: new Date().toISOString()
    }]);

    sendTranscription(text, true);
  };

  const {
    isListening,
    transcript, // accumulated
    interimTranscript,
    error: speechError,
    isSupported: speechSupported,
    startListening,
    stopListening,
    toggleListening
  } = useSpeechRecognition({ onFinalTranscript: handleFinalTranscript });

  const value = {
    // Socket & AI State
    isConnected,
    aiResponse,
    status,
    history,
    
    // Speech Recognition
    isListening,
    interimTranscript,
    transcripts, // array of { text, isQuestion, timestamp } objects
    speechError,
    speechSupported,
    toggleListening,
    submitText
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
