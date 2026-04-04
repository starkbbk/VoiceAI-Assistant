import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function HistoryPanel() {
  const { history, submitText } = useAppContext();
  const [textInput, setTextInput] = useState('');

  // If no history, don't force it open, but we still render it
  const hasHistory = history.length > 0;

  return (
    <div className="glass-panel w-full rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-[500px]">
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between p-4 bg-black/20 hover:bg-white/5 transition-colors gap-4">
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <span className="text-lg">📚</span>
          <h2 className="text-sm font-semibold tracking-wider text-gray-300 uppercase">
            Q&A History {hasHistory && <span className="bg-primary px-2 py-0.5 rounded-full text-[10px] text-white ml-2">{history.length}</span>}
          </h2>
        </div>

        <form 
          className="flex w-full md:flex-1 md:max-w-lg gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const val = textInput.trim();
            if (val) {
              submitText(val);
              setTextInput('');
            }
          }}
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type a message manually..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors"
          />
          <button 
            type="submit"
            disabled={!textInput.trim()}
            className="bg-primary/80 hover:bg-primary disabled:opacity-50 disabled:hover:bg-primary/80 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>

      <div className="border-t border-white/10 flex-1 overflow-y-auto p-4 space-y-4">
        {!hasHistory ? (
          <div className="h-full flex items-center justify-center text-gray-500 italic">
            No Q&A history yet. Ask a question!
          </div>
        ) : (
          history.map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-3 transition-card">
              <div className="flex justify-between items-start bg-secondary/10 border border-secondary/20 shadow-[0_0_15px_rgba(0,217,255,0.1)] p-3 rounded-lg">
                <div className="flex gap-2 text-sm text-gray-100">
                  <span className="text-secondary font-bold drop-shadow-[0_0_5px_rgba(0,217,255,0.5)]">Q:</span>
                  <p>"{item.question}"</p>
                </div>
                <span className="text-xs text-gray-400 font-mono shrink-0 whitespace-nowrap ml-4">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="w-full h-px bg-white/5" />
              
              <div className="flex gap-2 text-sm text-green-50 bg-green-500/10 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)] p-3 rounded-lg">
                <span className="text-green-400 font-bold drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]">A:</span>
                <p className="leading-relaxed">{item.answer}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
