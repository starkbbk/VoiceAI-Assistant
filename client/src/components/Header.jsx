import React, { useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import StatusIndicator from './StatusIndicator';

export default function Header({ onToggleSidebar, isSidebarOpen }) {
  const { isConnected, isListening, toggleListening, speechSupported } = useAppContext();
  
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('pdfFile', file);

    try {
      // Assuming server runs on the same host but port 5001
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/upload-pdf`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        // Optional: show a small success indication or console log
        console.log("PDF Uploaded Successfully: ", data.message);
        alert(`Success! Read ${data.pages} pages. The AI will now use this context.`);
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Network error while uploading PDF.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input
      }
    }
  };

  return (
    <header className="glass-panel w-full py-4 px-6 grid grid-cols-3 items-center z-50 sticky top-0 bg-black/60 backdrop-blur-md">
      {/* LEFT: Branding */}
      <div className="flex items-center gap-3 justify-start">
        <div className="bg-primary/20 p-2 rounded-lg text-2xl">🎙️</div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden sm:block">
          VoiceAI Assistant
        </h1>
      </div>
      
      {/* CENTER: Status Indicator */}
      <div className="flex justify-center">
        <StatusIndicator />
      </div>

      {/* RIGHT: Status & Controls */}
      <div className="flex items-center gap-4 justify-end">
        {/* Hidden File Input */}
        <input 
          type="file" 
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {/* PDF Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`relative flex items-center justify-center h-10 px-3 rounded-full transition-all duration-300 border border-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-wait ${
            isUploading ? 'bg-primary/50' : 'bg-black/30 hover:bg-white/10 text-white'
          }`}
          title="Upload PDF Context"
        >
          <span className="text-sm font-medium flex items-center gap-2">
            {isUploading ? '⏳ Uploading' : '📄 PDF'}
          </span>
        </button>

        <button
          onClick={toggleListening}
          disabled={!speechSupported}
          className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 border border-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            isListening 
              ? 'bg-primary shadow-[0_0_15px_rgba(108,99,255,0.6)]' 
              : 'bg-black/30 hover:bg-white/10'
          }`}
          title={isListening ? "Pause Listening (Alt+L)" : "Start Listening (Alt+L)"}
        >
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30 pointer-events-none" />
          )}
          <span className="text-lg">{isListening ? '⏸️' : '🎙️'}</span>
        </button>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/30 border border-white/5">
          <div className={`w-2 h-2 rounded-full shadow-lg ${isConnected ? 'bg-secondary animate-pulse-slow shadow-secondary/50' : 'bg-red-500 shadow-red-500/50'}`} />
          <span className="text-sm text-gray-300 font-medium hidden sm:block">
            {isConnected ? 'Connected to AI Server' : 'Disconnected'}
          </span>
        </div>

        <button 
          onClick={onToggleSidebar}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center cursor-pointer"
          aria-label="Toggle Controls"
        >
          {isSidebarOpen ? (
            <span className="text-xl text-white">✕</span>
          ) : (
            <span className="text-xl text-white">☰</span>
          )}
        </button>
      </div>
    </header>
  );
}
