import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import StatusIndicator from './components/StatusIndicator';
import ControlPanel from './components/ControlPanel';
import TranscriptBox from './components/TranscriptBox';
import AIResponsePanel from './components/AIResponsePanel';
import HistoryPanel from './components/HistoryPanel';

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative pb-10 overflow-x-hidden">
      {/* Background Orbs Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/15 blur-[120px]" />
      </div>

      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
      
      {/* Slide-out Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar / Burger Menu Panel */}
      <div className={`fixed top-[73px] right-0 h-[calc(100vh-73px)] w-96 max-w-full p-6 bg-gray-900/95 backdrop-blur-xl border-l border-white/10 z-50 transform transition-transform duration-300 overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold font-mono text-white">Controls</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white p-2">✕</button>
          </div>
          <ControlPanel />
          <AIResponsePanel />
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6 relative items-start">
        <div className="lg:col-span-2 w-full">
          <HistoryPanel />
        </div>
        <div className="hidden lg:block lg:col-span-1 w-full">
          <TranscriptBox />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
