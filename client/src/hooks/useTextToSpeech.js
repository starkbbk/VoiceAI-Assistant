import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for interacting with SpeechSynthesis
 */
export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const handleVoicesChanged = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    handleVoicesChanged(); // initial load
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text) => {
    if (!isEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Cancel any ongoing speech

    const msg = new SpeechSynthesisUtterance(text);
    
    // Attempt to use a natural voice if available
    const naturalVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.lang === 'en-US');
    if (naturalVoice) {
      msg.voice = naturalVoice;
    }

    msg.onstart = () => setIsSpeaking(true);
    msg.onend = () => setIsSpeaking(false);
    msg.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(msg);
  }, [isEnabled, voices]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const toggleTTS = useCallback(() => {
    setIsEnabled(v => {
      if (v) stop(); // if disabling, stop ongoing speech
      return !v;
    });
  }, [stop]);

  return {
    isSpeaking,
    isEnabled,
    speak,
    stop,
    toggleTTS
  };
}
