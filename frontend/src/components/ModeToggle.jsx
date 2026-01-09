
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ModeToggle = ({ className }) => {
  const [mode, setMode] = useState('full-auto');

  const options = [
    { id: 'full-auto', label: 'Full Auto' },
    { id: 'hybrid', label: 'Hybrid' },
    { id: 'manual', label: 'Manual' },
  ];

  const descriptions = {
    'full-auto': 'Unleash Vision Cortex',
    'hybrid': 'Collaborate with Vision Cortex',
    'manual': 'Take Full Control',
  };

  const getModeStyles = (optionId) => {
    if (mode === optionId) {
      switch (optionId) {
        case 'full-auto':
          return {
            textClass: "text-[#39FF14] drop-shadow-[0_0_5px_rgba(57,255,20,0.8)]",
            borderClass: "border-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.4)] inset-shadow-[0_0_10px_rgba(57,255,20,0.2)]",
          };
        case 'hybrid':
          return {
            textClass: "text-[#FFFF00] drop-shadow-[0_0_5px_rgba(255,255,0,0.8)]",
            borderClass: "border-[#FFFF00] shadow-[0_0_15px_rgba(255,255,0,0.4)]",
          };
        case 'manual':
          return {
            textClass: "text-[#FF0000] drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]",
            borderClass: "border-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.4)]",
          };
        default:
          return { textClass: "", borderClass: "" };
      }
    }
    return {
      textClass: "text-white/40 hover:text-white/80",
      borderClass: "",
    };
  };

  return (
    <div className={cn("flex flex-col items-center gap-4 relative z-30", className)}>
      <p className="text-xl text-white font-medium leading-relaxed mb-2 text-center text-shadow-sm"> 
        How easy do you want to make your life or business?
      </p>

      {/* Main Toggle Container */}
      <div className="bg-black/60 backdrop-blur-xl p-1.5 rounded-full flex gap-2 border border-white/10 shadow-2xl">
        {options.map((option) => {
          const isActive = mode === option.id;
          const { textClass, borderClass } = getModeStyles(option.id);
          
          return (
            <button
              key={option.id}
              onClick={() => setMode(option.id)}
              className={cn(
                "relative px-6 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 min-w-[100px]",
                textClass
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mode-active"
                  className={cn(
                    "absolute inset-0 rounded-full border bg-black/40", 
                    borderClass
                  )}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{option.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Description Box */}
      <AnimatePresence mode="wait">
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          key={mode}
          className="text-center mt-2"
        >
          <div className={cn(
             "inline-block px-6 py-2 rounded-lg border bg-black/60 backdrop-blur-md transition-colors duration-500",
             mode === 'full-auto' ? "border-[#39FF14]/50 shadow-[0_0_20px_rgba(57,255,20,0.2)]" :
             mode === 'hybrid' ? "border-[#FFFF00]/50 shadow-[0_0_20px_rgba(255,255,0,0.2)]" :
             "border-[#FF0000]/50 shadow-[0_0_20px_rgba(255,0,0,0.2)]"
          )}>
            <p className={cn(
              "text-lg md:text-xl font-medium tracking-wide",
              mode === 'full-auto' ? "text-[#39FF14] drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]" :
              mode === 'hybrid' ? "text-[#FFFF00] drop-shadow-[0_0_8px_rgba(255,255,0,0.6)]" :
              "text-[#FF0000] drop-shadow-[0_0_8px_rgba(255,0,0,0.6)]"
            )}>
              {descriptions[mode]}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ModeToggle;
