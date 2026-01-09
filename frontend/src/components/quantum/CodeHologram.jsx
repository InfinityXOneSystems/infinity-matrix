
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, Terminal, Eye, Play, 
  Maximize2, Minimize2, Cpu, Activity,
  Lock, RefreshCw
} from 'lucide-react';
import { MOCK_FILE_SYSTEM } from '@/lib/quantum-data';
import { cn } from '@/lib/utils';

const CodeHologram = ({ activeFile, buildState, interventionMode }) => {
  const [typedCode, setTypedCode] = useState('');
  const [viewMode, setViewMode] = useState('split'); // 'code', 'preview', 'split'
  const [previewUpdate, setPreviewUpdate] = useState(0);

  // Typewriter effect for code
  useEffect(() => {
    if (!activeFile) return;
    const fullCode = MOCK_FILE_SYSTEM[activeFile] || '// Initializing...';
    setTypedCode('');
    
    let i = 0;
    const speed = 10; // Typing speed
    
    const interval = setInterval(() => {
      if (i < fullCode.length) {
        setTypedCode(fullCode.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setPreviewUpdate(prev => prev + 1); // Trigger preview refresh
      }
    }, speed);

    return () => clearInterval(interval);
  }, [activeFile]);

  return (
    <div className="flex flex-col h-full bg-[#050a14] rounded-2xl overflow-hidden border border-silver-border-color shadow-2xl relative">
      
      {/* Header / Tabs */}
      <div className="h-12 bg-black/40 border-b border-white/10 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          {Object.keys(MOCK_FILE_SYSTEM).map(file => (
            <div 
              key={file}
              className={cn(
                "text-xs px-3 py-1.5 rounded-t-lg border-t border-l border-r border-transparent cursor-default transition-all",
                activeFile === file 
                  ? "bg-[#050a14] text-[#0066FF] border-white/10 font-bold" 
                  : "text-white/40 hover:text-white/70"
              )}
            >
              {file}
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
             onClick={() => setViewMode(viewMode === 'split' ? 'code' : 'split')}
             className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-[#0066FF] transition-colors"
             title="Toggle View"
          >
             {viewMode === 'split' ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* CODE EDITOR SIDE */}
        <div className={cn(
          "bg-[#020410] overflow-hidden transition-all duration-500 flex flex-col relative",
          viewMode === 'preview' ? "w-0 opacity-0" : viewMode === 'split' ? "w-1/2 border-r border-white/10" : "w-full"
        )}>
           <div className="absolute top-2 right-4 text-[10px] text-white/20 font-mono pointer-events-none">
              LIVE_WRITE_STREAM :: {activeFile || 'IDLE'}
           </div>
           
           <div className="flex-1 p-4 font-mono text-xs leading-relaxed overflow-y-auto custom-scrollbar">
              <pre>
                <code className="language-javascript text-white/80">
                  {typedCode}
                  <span className="inline-block w-2 h-4 bg-[#39FF14] ml-1 animate-pulse align-middle" />
                </code>
              </pre>
           </div>
           
           {/* Status Bar */}
           <div className="h-6 bg-[#0066FF]/10 border-t border-[#0066FF]/20 flex items-center px-3 gap-4 text-[10px] text-[#0066FF]">
              <span className="flex items-center gap-1"><Terminal size={10} /> BUS_1: ONLINE</span>
              <span className="flex items-center gap-1"><Cpu size={10} /> CPU: 42%</span>
              <span className="ml-auto flex items-center gap-1">UTF-8</span>
           </div>
        </div>

        {/* PREVIEW SIDE */}
        <div className={cn(
          "bg-white relative transition-all duration-500 flex flex-col",
          viewMode === 'code' ? "w-0 opacity-0" : viewMode === 'split' ? "w-1/2" : "w-full"
        )}>
          {/* Fake Browser Bar */}
          <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-2">
             <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
             </div>
             <div className="flex-1 bg-white h-5 rounded mx-2 border border-gray-200 text-[10px] flex items-center px-2 text-gray-400 font-mono">
                localhost:3000/preview
             </div>
             <RefreshCw size={12} className={cn("text-gray-400", buildState === 'building' && "animate-spin")} />
          </div>

          {/* Preview Content */}
          <div className="flex-1 bg-gray-50 p-4 relative overflow-hidden">
             {buildState === 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                   Waiting for build configuration...
                </div>
             )}
             
             {buildState !== 'idle' && (
                <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 flex flex-col">
                   {/* Simulated App UI */}
                   <div className="h-32 bg-slate-900 flex items-center justify-center text-white">
                      <div className="text-center">
                         <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse" />
                         <div className="h-4 w-32 bg-white/20 rounded mx-auto" />
                      </div>
                   </div>
                   <div className="p-4 space-y-3">
                      <div className="h-4 w-3/4 bg-gray-100 rounded" />
                      <div className="h-4 w-1/2 bg-gray-100 rounded" />
                      <div className="grid grid-cols-2 gap-2 mt-4">
                         <div className="h-20 bg-blue-50 rounded" />
                         <div className="h-20 bg-green-50 rounded" />
                      </div>
                   </div>
                   
                   {/* Locked Overlay if not complete */}
                   {buildState !== 'complete' && buildState !== 'deployed' && !interventionMode && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                         <Lock size={32} className="mb-2 text-[#39FF14]" />
                         <span className="text-xs font-mono uppercase tracking-widest">Build in Progress</span>
                         <span className="text-[10px] text-white/50 mt-1">Preview locked until compilation</span>
                      </div>
                   )}
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CodeHologram;
