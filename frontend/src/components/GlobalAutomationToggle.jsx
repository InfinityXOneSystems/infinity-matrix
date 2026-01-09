
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Hand, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const GlobalAutomationToggle = ({ compact = false, className }) => {
  // Persist state in localStorage for quick prototyping
  const [mode, setMode] = useState(() => localStorage.getItem('automation_mode') || 'full-auto');
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('automation_mode', mode);
  }, [mode]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    toast({
      description: (
        <div className="flex flex-col gap-1">
          <span className="font-bold text-[#39FF14]">System Reconfigured</span>
          <span>Switching to {newMode.toUpperCase().replace('-', ' ')} protocol.</span>
        </div>
      ),
      className: "border-[#39FF14] bg-black text-white"
    });
  };

  const options = [
    { 
      id: 'full-auto', 
      label: compact ? 'AUTO' : 'Full Auto', 
      icon: <Zap size={14} />,
      desc: 'Autonomous Execution'
    },
    { 
      id: 'hybrid', 
      label: compact ? 'HYBRID' : 'Hybrid', 
      icon: <Activity size={14} />,
      desc: 'Human-in-the-loop'
    },
    { 
      id: 'manual', 
      label: compact ? 'MANUAL' : 'Manual', 
      icon: <Hand size={14} />,
      desc: 'Direct Control'
    },
  ];

  const getModeStyles = (optionId) => {
    if (mode === optionId) {
      switch (optionId) {
        case 'full-auto':
          return "text-black bg-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.5)] border-[#39FF14]";
        case 'hybrid':
          return "text-black bg-[#FFFF00] shadow-[0_0_20px_rgba(255,255,0,0.5)] border-[#FFFF00]";
        case 'manual':
          return "text-white bg-[#FF0000] shadow-[0_0_20px_rgba(255,0,0,0.5)] border-[#FF0000]";
        default:
          return "";
      }
    }
    return "text-white/40 hover:text-white bg-transparent border-transparent hover:bg-white/5";
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {!compact && (
        <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-widest text-white/50">
          <Sparkles size={10} className="text-[#39FF14]" /> System Control
        </div>
      )}
      
      <div className="flex bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-lg relative overflow-hidden">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleModeChange(option.id)}
            className={cn(
              "relative px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border border-transparent",
              getModeStyles(option.id)
            )}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        {!compact && (
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="mt-2 text-[10px] uppercase tracking-widest font-mono"
            style={{
              color: mode === 'full-auto' ? '#39FF14' : mode === 'hybrid' ? '#FFFF00' : '#FF4444'
            }}
          >
            {options.find(o => o.id === mode)?.desc}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalAutomationToggle;
