import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function ControlPanel() {
  const { isListening, toggleListening, speechSupported } = useAppContext();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Hotkey: Alt+L to toggle listening
      if (e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        toggleListening();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleListening]);

  if (!speechSupported) {
    return (
      <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-4 text-center">
        <h3 className="text-red-400 font-semibold mb-2">Speech Recognition Not Supported</h3>
        <p className="text-gray-400 text-sm">Please try using the latest Google Chrome on a desktop device.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
      <div className="text-center">
        <p className="text-xs text-gray-500">Keyboard Shortcut: <kbd className="bg-black/30 px-1.5 py-0.5 rounded border border-gray-700">Alt+L</kbd> to toggle listening</p>
      </div>


    </div>
  );
}
