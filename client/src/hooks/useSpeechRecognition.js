import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook managing Web Speech API
 */
export function useSpeechRecognition({ onFinalTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(isListening);
  const onFinalTranscriptRef = useRef(onFinalTranscript);

  // Keep refs updated
  useEffect(() => {
    onFinalTranscriptRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    // Check support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentInterim = '';
      let currentFinal = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          currentFinal += event.results[i][0].transcript;
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }

      if (currentFinal) {
        setTranscript(prev => prev + ' ' + currentFinal);
        if (onFinalTranscriptRef.current) {
          onFinalTranscriptRef.current(currentFinal);
        }
      }
      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      // Auto restart if it's supposed to be listening (persistent listening mode)
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.error("Could not restart recognition automatically", e);
          setIsListening(false);
        }
      }
    };

    return () => {
      recognition.stop();
    };
  }, []); // Run ONCE on mount

  const startListening = useCallback(() => {
    setError(null);
    if (!isSupported) return;
    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (e) {
      console.error(e);
      // If it's already started, ignore
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (!isSupported) return;
    setIsListening(false);
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      console.error(e);
    }
  }, [isSupported]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    toggleListening
  };
}
