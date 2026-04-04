import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function AIResponsePanel() {
  const { aiResponse } = useAppContext();

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col h-[280px] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">✨</span>
        <h2 className="text-sm font-semibold tracking-wider text-gray-300 uppercase">AI Response</h2>
      </div>

      {aiResponse ? (
        <div className="flex-1 flex flex-col pt-2 overflow-y-auto pr-2">
          <div className="bg-white/5 p-3 rounded-lg border border-white/10 mb-4">
            <span className="text-xs text-secondary font-mono mb-1 block">Q:</span>
            <p className="text-sm text-gray-300 italic">"{aiResponse.question}"</p>
          </div>
          
          <div className="flex-1">
            <span className="text-xs text-primary font-mono mb-1 block">A:</span>
            <p className="text-[15px] leading-relaxed text-white typing-cursor animate-[type_0.5s_ease-out]">
              {aiResponse.answer}
            </p>
            <span className="block text-xs text-gray-500 font-mono mt-4">
              Received at {new Date(aiResponse.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-center text-sm text-gray-500 max-w-[200px]">
            Waiting for a question to answer...
          </p>
        </div>
      )}
    </div>
  );
}
