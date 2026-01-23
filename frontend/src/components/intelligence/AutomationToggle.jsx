
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Zap, GitMerge, Power } from 'lucide-react';

const AutomationToggle = ({ currentMode, onModeChange }) => {
  const modes = [
    { id: 'auto', label: 'Auto', icon: Zap, color: '#39FF14' },
    { id: 'hybrid', label: 'Hybrid', icon: GitMerge, color: '#FFFF00' },
    { id: 'manual', label: 'Manual', icon: Power, color: '#FF3333' },
  ];

  return (
    <div className="p-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-1 shadow-inner">
      {modes.map((mode) => {
        const isActive = currentMode === mode.id;
        const Icon = mode.icon;
        
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={cn(
              "relative px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 overflow-hidden group",
              isActive ? "text-black" : "text-white/50 hover:text-white"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 w-full h-full"
                style={{ backgroundColor: mode.color }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <span className="relative z-10 flex items-center gap-2">
              <Icon size={12} className={cn(isActive ? "text-black" : "text-current")} />
              {mode.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default AutomationToggle;
