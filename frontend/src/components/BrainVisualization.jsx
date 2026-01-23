import React from 'react';
import { motion } from 'framer-motion';

const BrainVisualization = () => {
  // Circuit board lines data - background
  const circuitLines = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x1: Math.random() * 400,
    y1: Math.random() * 400,
    x2: Math.random() * 400,
    y2: Math.random() * 400,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  // Brain geometry nodes (simplified polygonal structure)
  const brainNodes = [
    { x: 220, y: 130 }, { x: 260, y: 110 }, { x: 300, y: 120 }, { x: 330, y: 150 },
    { x: 330, y: 190 }, { x: 310, y: 220 }, { x: 270, y: 230 }, { x: 230, y: 220 },
    { x: 200, y: 180 }, { x: 210, y: 150 }, { x: 250, y: 150 }, { x: 290, y: 160 },
    { x: 280, y: 190 }, { x: 240, y: 190 }, { x: 265, y: 170 } // Center-ish
  ];

  // Specific connections to form the polygonal mesh
  const brainConnections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0],
    [0, 10], [1, 10], [1, 11], [2, 11], [3, 11], [3, 12], [4, 12], [5, 12], [6, 13],
    [7, 13], [8, 13], [9, 10], [10, 14], [11, 14], [12, 14], [13, 14], [10, 13]
  ];

  // Background circuit paths (schematic style)
  const circuitPaths = [
    "M 50 50 L 100 50 L 120 80",
    "M 350 50 L 300 50 L 280 80",
    "M 50 350 L 100 350 L 120 320",
    "M 350 350 L 300 350 L 280 320",
    "M 20 200 L 80 200 L 100 180",
    "M 380 200 L 320 200 L 300 220",
    "M 150 20 L 150 60",
    "M 250 20 L 250 60",
    "M 150 380 L 150 340",
    "M 250 380 L 250 340"
  ];

  return (
    <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center overflow-hidden rounded-2xl">
      
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001a33] via-transparent to-transparent opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#0091FF] opacity-[0.03] blur-[80px] rounded-full" />

      <motion.div
        className="relative w-full h-full"
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          
          {/* Background Circuit Lines */}
          {circuitPaths.map((path, i) => (
            <motion.path
              key={`bg-circuit-${i}`}
              d={path}
              fill="none"
              stroke="#0091FF"
              strokeWidth="0.5"
              strokeOpacity="0.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.2 }}
              transition={{ duration: 2, delay: i * 0.1 }}
            />
          ))}

          {/* Circuit Nodes (Dots) */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.circle
              key={`bg-dot-${i}`}
              cx={Math.random() * 400}
              cy={Math.random() * 400}
              r={Math.random() * 1.5 + 0.5}
              fill="#0091FF"
              opacity="0.3"
              animate={{ opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
            />
          ))}

          {/* Head Silhouette Profile */}
          <motion.path
            d="M 180 380 
               C 140 380, 120 350, 120 320 
               C 120 300, 130 290, 135 270 
               C 138 260, 125 255, 115 240 
               C 105 225, 115 210, 130 200
               C 135 195, 135 185, 135 170
               C 135 100, 180 50, 250 50
               C 320 50, 360 100, 360 170
               C 360 220, 350 250, 320 280"
            fill="none"
            stroke="#0091FF"
            strokeWidth="2"
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(0,145,255,0.6)]"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />

          {/* Brain Network Group */}
          <g className="filter drop-shadow-[0_0_5px_rgba(0,145,255,0.4)]">
            {/* Brain Connections */}
            {brainConnections.map(([start, end], i) => (
              <motion.line
                key={`brain-conn-${i}`}
                x1={brainNodes[start].x}
                y1={brainNodes[start].y}
                x2={brainNodes[end].x}
                y2={brainNodes[end].y}
                stroke="#0091FF"
                strokeWidth="0.8"
                strokeOpacity="0.6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 1 + i * 0.02 }}
              />
            ))}

            {/* Brain Nodes */}
            {brainNodes.map((node, i) => (
              <motion.circle
                key={`brain-node-${i}`}
                cx={node.x}
                cy={node.y}
                r="1.5"
                fill="#0091FF"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5 + i * 0.05 }}
              />
            ))}

            {/* Central Glowing Core (Diamond/Cube) */}
            <motion.g
              transform="translate(265, 170)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.8, type: "spring" }}
            >
              {/* Core Glow */}
              <motion.circle
                r="25"
                fill="#0091FF"
                fillOpacity="0.2"
                className="blur-md"
                animate={{ r: [20, 30, 20], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Diamond Shape Outer */}
              <motion.rect
                x="-12"
                y="-12"
                width="24"
                height="24"
                fill="none"
                stroke="#0091FF"
                strokeWidth="1.5"
                transform="rotate(45)"
                className="drop-shadow-[0_0_10px_rgba(0,145,255,0.8)]"
              />
              
              {/* Diamond Shape Inner */}
              <motion.rect
                x="-6"
                y="-6"
                width="12"
                height="12"
                fill="#0091FF"
                transform="rotate(45)"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Radiating Lines from Core */}
              {[0, 90, 180, 270].map((angle, i) => (
                <motion.line
                  key={`ray-${i}`}
                  x1="0"
                  y1="-15"
                  x2="0"
                  y2="-25"
                  stroke="#0091FF"
                  strokeWidth="1"
                  transform={`rotate(${angle})`}
                  opacity="0.6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 3 + i * 0.1, duration: 0.5 }}
                />
              ))}
            </motion.g>
          </g>

          {/* Extended Neural Pathways (Lines extending from brain) */}
          <motion.path
             d="M 265 230 L 260 260 L 280 300 L 350 350"
             fill="none"
             stroke="#0091FF"
             strokeWidth="1"
             strokeOpacity="0.3"
             initial={{ pathLength: 0 }}
             animate={{ pathLength: 1 }}
             transition={{ delay: 2, duration: 1.5 }}
          />
          <motion.path
             d="M 230 220 L 220 250 L 200 280 L 150 320"
             fill="none"
             stroke="#0091FF"
             strokeWidth="1"
             strokeOpacity="0.3"
             initial={{ pathLength: 0 }}
             animate={{ pathLength: 1 }}
             transition={{ delay: 2.2, duration: 1.5 }}
          />

          {/* Floating Particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.circle
              key={`float-p-${i}`}
              r="1"
              fill="#fff"
              initial={{ 
                cx: 265 + (Math.random() - 0.5) * 100, 
                cy: 170 + (Math.random() - 0.5) * 100,
                opacity: 0 
              }}
              animate={{ 
                y: [0, -20, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}

        </svg>
      </motion.div>
    </div>
  );
};

export default BrainVisualization;