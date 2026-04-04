import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function TranscriptBox() {
  const { transcripts, interimTranscript, speechError } = useAppContext();
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts, interimTranscript]);

  const isEmpty = transcripts.length === 0 && !interimTranscript;

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[500px] overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-black/20">
        <h2 className="text-sm font-semibold tracking-wider text-gray-300 uppercase">Live Transcript</h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {speechError && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl mb-4">
            <p className="text-sm text-red-200">Speech Recognition Error: <span className="font-bold">{speechError}</span></p>
            <p className="text-xs text-red-300 mt-1">If this says 'not-allowed', check system mic settings.</p>
          </div>
        )}
        
        {isEmpty && !speechError ? (
          <div className="h-full flex items-center justify-center text-gray-500 italic">
            Start listening to see transcript here...
          </div>
        ) : (
          <>
            {transcripts.map((entry) => (
              <div 
                key={entry.id} 
                className={`p-3 rounded-xl transition-card ${
                  entry.isQuestion 
                    ? 'bg-secondary/10 border border-secondary/30 shadow-[0_0_15px_rgba(0,217,255,0.1)]' 
                    : 'bg-white/5 border border-white/5'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500 font-mono">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  {entry.isQuestion && (
                    <span className="text-[10px] uppercase font-bold text-secondary bg-secondary/20 px-2 py-0.5 rounded-full">
                      Question Detected
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-200 font-medium">
                  {entry.text}
                </p>
              </div>
            ))}
            
            {/* Interim Transcript (in-progress) */}
            {interimTranscript && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 opacity-70">
                <p className="text-sm text-gray-400 italic">
                  {interimTranscript}...
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
