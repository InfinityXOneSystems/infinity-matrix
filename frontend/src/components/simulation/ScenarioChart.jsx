
import React from 'react';
import { motion } from 'framer-motion';

const ScenarioChart = ({ scenarios, height = 300 }) => {
  if (!scenarios) return null;

  const { optimistic, realistic, pessimistic } = scenarios;
  const years = [1, 2, 3, 4, 5];
  
  // Find global max to normalize the chart
  const allValues = [...optimistic, ...realistic, ...pessimistic];
  const maxVal = Math.max(...allValues) * 1.1; // Add 10% headroom

  const createPath = (data) => {
    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (val / maxVal) * 100;
      return `${x},${y}`;
    }).join(' ');
  };

  const optimPath = createPath(optimistic);
  const realPath = createPath(realistic);
  const pessPath = createPath(pessimistic);

  return (
    <div className="w-full relative h-full select-none" style={{ height }}>
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        
        {/* Grid Lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2" />

        {/* Optimistic */}
        <motion.polyline
          points={optimPath}
          fill="none"
          stroke="#39FF14"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Realistic */}
        <motion.polyline
          points={realPath}
          fill="none"
          stroke="#3399FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          vectorEffect="non-scaling-stroke"
        />

        {/* Pessimistic */}
        <motion.polyline
          points={pessPath}
          fill="none"
          stroke="#EF4444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
          vectorEffect="non-scaling-stroke"
        />

      </svg>

      {/* Tooltip-like markers (Static for now) */}
      <div className="absolute top-0 right-0 flex flex-col gap-2 p-2 bg-black/40 backdrop-blur-sm rounded border border-white/10 text-[10px]">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-[#39FF14]" /> <span className="text-white">Optimistic</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-[#3399FF]" /> <span className="text-white">Realistic</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-[#EF4444]" /> <span className="text-white">Pessimistic</span>
        </div>
      </div>

      {/* X-Axis Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-white/40 translate-y-4">
        <span>Year 1</span>
        <span>Year 2</span>
        <span>Year 3</span>
        <span>Year 4</span>
        <span>Year 5</span>
      </div>
    </div>
  );
};

export default ScenarioChart;
