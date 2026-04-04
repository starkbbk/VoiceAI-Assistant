import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SERVER_URL || '';

/**
 * Custom hook to manage socket.io connection for AI interactions.
 */
export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [status, setStatus] = useState('Idle');
  const [history, setHistory] = useState([]);
  
  const socketRef = useRef(null);

  useEffect(() => {
    // Note: We use relative / path if proxying, or configure full url if needed.
    const socket = io(URL, {
      path: '/socket.io/',
      transports: ['websocket', 'polling']
    });
    
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setStatus('Idle');
    });

    socket.on('status', (newStatus) => {
      setStatus(newStatus === 'processing' ? 'Processing...' : newStatus === 'answered' ? 'Answering' : 'Idle');
    });

    socket.on('ai-response', (data) => {
      setAiResponse(data);
      setHistory(prev => {
        const newHistory = [data, ...prev];
        if (newHistory.length > 50) return newHistory.slice(0, 50);
        return newHistory;
      });
      // automatically set status to answered is handled by event, let's keep it safe here
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendTranscription = useCallback((text, isQuestion) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('transcription', { text, isQuestion });
    }
  }, []);

  return {
    isConnected,
    aiResponse,
    status,
    history,
    sendTranscription
  };
}
