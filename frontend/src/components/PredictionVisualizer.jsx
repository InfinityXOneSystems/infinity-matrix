
import React from 'react';
import { motion } from 'framer-motion';

const PredictionVisualizer = ({ industryName }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-silver-border-color bg-black/40 h-full flex flex-col">
      <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
        <div className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
        {industryName} Forecast Model
      </h3>

      <div className="flex-1 relative flex items-center justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

        {/* Central Gauge */}
        <div className="relative w-48 h-48">
          {/* Outer Ring */}
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-white/10 border-t-[#39FF14] border-r-[#0066FF]"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner Ring */}
          <motion.div 
            className="absolute inset-4 rounded-full border-2 border-dashed border-white/20"
            animate={{ rotate: -180 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          {/* Central Data */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">87%</span>
            <span className="text-[10px] text-[#39FF14] uppercase tracking-widest font-bold mt-1">Confidence</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-xs text-white/60">
          <span>Signal Strength</span>
          <span className="text-white">Strong Buy</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#0066FF] to-[#39FF14]" 
            initial={{ width: 0 }}
            animate={{ width: "87%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default PredictionVisualizer;
