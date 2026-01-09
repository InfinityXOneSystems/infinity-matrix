
import React from 'react';
import { motion } from 'framer-motion';

const PredictionChart = ({ data, color = "#39FF14", height = 200 }) => {
  if (!data || data.length < 2) return <div className="h-[200px] flex items-center justify-center text-white/20 text-xs">Awaiting Market Data...</div>;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  // Create path points
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 80 - 10; // 10% padding top/bottom
    return `${x},${y}`;
  }).join(' ');

  // Create area path (close the loop at bottom)
  const areaPoints = `${points} 100,100 0,100`;

  return (
    <div className="w-full relative overflow-hidden rounded-lg" style={{ height }}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area Fill */}
        <motion.path
          d={`M ${areaPoints}`}
          fill={`url(#gradient-${color})`}
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Line Stroke */}
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Blinking Dot at the end */}
        {data.length > 0 && (
          <motion.circle
             cx="100" 
             cy={100 - ((data[data.length - 1] - min) / range) * 80 - 10}
             r="2"
             fill="#fff"
             stroke={color}
             strokeWidth="1"
             animate={{ r: [2, 4, 2], opacity: [1, 0.5, 1] }}
             transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </svg>
      
      {/* Grid Lines Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 border-t border-b border-white/10 flex flex-col justify-between">
         <div className="border-b border-white/5 border-dashed h-1/4 w-full" />
         <div className="border-b border-white/5 border-dashed h-1/4 w-full" />
         <div className="border-b border-white/5 border-dashed h-1/4 w-full" />
      </div>
    </div>
  );
};

export default PredictionChart;
