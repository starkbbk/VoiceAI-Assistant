import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function StatusIndicator() {
  const { isListening, status } = useAppContext();

  let displayStatus = "⚫ Idle";
  let classes = "text-gray-400";
  let pulseClass = "";

  if (status === 'Processing...') {
    displayStatus = "🟡 Processing...";
    classes = "text-yellow-400";
    pulseClass = "animate-pulse";
  } else if (status === 'Answering') {
    displayStatus = "🔵 Answering";
    classes = "text-secondary";
    // Using slow pulse from tailwind config
    pulseClass = "animate-pulse-slow"; 
  } else if (isListening) {
    displayStatus = "🟢 Listening";
    classes = "text-green-400";
    pulseClass = "animate-pulse";
  }

  return (
    <div className={`px-4 py-1.5 rounded-full bg-black/40 border border-white/10 flex items-center gap-2 transition-card`}>
      <div className={`text-sm font-medium tracking-wide ${classes} flex items-center gap-2`}>
        <span className={pulseClass}>{displayStatus.split(" ")[0]}</span>
        <span>{displayStatus.substring(displayStatus.indexOf(" ") + 1)}</span>
      </div>
    </div>
  );
}
