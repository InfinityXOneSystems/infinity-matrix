import React from 'react';
import { motion } from 'framer-motion';

const DashboardVisualization = () => {
  // Node data based on the user's description and visual reference
  const nodes = [
    { id: 'root', x: 300, y: 180, label: 'Rumi the Switch', type: 'main' },
    
    // Left branch
    { id: 'fetch', x: 120, y: 100, label: 'FETCH', type: 'action' },
    { id: 'bio', x: 80, y: 180, label: 'Biographia', type: 'source' },
    { id: 'why', x: 120, y: 260, label: 'Why?', type: 'query' },
    
    // Right branch - Subscriptions & Resources
    { id: 'res', x: 480, y: 80, label: 'Resource', type: 'data' },
    { id: 'promo', x: 480, y: 140, label: 'Promotion', type: 'data' },
    { id: 'trans', x: 480, y: 200, label: 'Transmission', type: 'data' },
    { id: 'sub1', x: 480, y: 260, label: 'Subscription', type: 'data' },
    { id: 'sub2', x: 480, y: 320, label: 'Subscription', type: 'data' },
  ];

  const edges = [
    { from: 'fetch', to: 'root' },
    { from: 'bio', to: 'root' },
    { from: 'why', to: 'root' },
    { from: 'root', to: 'res' },
    { from: 'root', to: 'promo' },
    { from: 'root', to: 'trans' },
    { from: 'root', to: 'sub1' },
    { from: 'root', to: 'sub2' },
  ];

  return (
    <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border border-[#0091FF]/40 bg-[#02040a]">
      {/* Window Header */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-[#0091FF]/20 border-b border-[#0091FF]/30 flex items-center px-3 justify-between z-10">
        <div className="flex items-center gap-2 text-[#0091FF]/80 text-xs font-mono">
          <span className="opacity-70">●</span>
          <span>Ron itte swoch</span>
        </div>
        <div className="flex items-center gap-2 text-[#0091FF]/50">
          <div className="w-2 h-2 rounded-full border border-current" />
          <div className="w-2 h-2 border border-current" />
        </div>
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 top-8 opacity-40"
        style={{
          backgroundImage: `radial-gradient(#0091FF 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Visualization Area */}
      <div className="absolute inset-0 top-8">
        <svg className="w-full h-full">
          <defs>
            {/* Enhanced Glow Filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#0091FF" floodOpacity="0.8" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* White Glow Filter for pulse */}
            <filter id="white-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feFlood floodColor="#FFFFFF" floodOpacity="1" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {edges.map((edge, i) => {
            const start = nodes.find(n => n.id === edge.from);
            const end = nodes.find(n => n.id === edge.to);
            
            // Bezier curve calculation
            const midX = (start.x + end.x) / 2;
            
            return (
              <motion.g key={`edge-${i}`}>
                <motion.path
                  d={`M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`}
                  fill="none"
                  stroke="#00C0FF"
                  strokeWidth="1.5"
                  strokeOpacity="0.8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
                {/* Animated Pulse */}
                <circle r="3" fill="#FFFFFF" filter="url(#white-glow)">
                  <animateMotion 
                    dur={`${1.5 + i * 0.3}s`}
                    repeatCount="indefinite"
                    path={`M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`}
                  />
                </circle>
              </motion.g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => (
            <motion.g 
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              filter="url(#glow)"
            >
              {/* Node Label Background */}
              <rect 
                x={node.x - (node.label.length * 3.5) - 10} 
                y={node.y - 10} 
                width={(node.label.length * 7) + 20} 
                height="20" 
                rx="4"
                fill="#050a14"
                stroke="#00C0FF"
                strokeWidth="1.5"
                strokeOpacity={node.type === 'main' ? "1" : "0.7"}
              />
              
              {/* Node Icon/Dot */}
              <circle cx={node.x - (node.label.length * 3.5)} cy={node.y} r="3.5" fill="#00C0FF" />

              {/* Node Text */}
              <text 
                x={node.x + 5} 
                y={node.y + 4} 
                textAnchor="middle" 
                fill={node.type === 'main' ? "#FFFFFF" : "#00C0FF"}
                fillOpacity={node.type === 'main' ? 1 : 0.9}
                fontSize="11"
                fontFamily="monospace"
              >
                {node.label}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
      
      {/* Side Panel Overlay (Decoration) */}
      <div className="absolute top-8 right-0 bottom-0 w-16 border-l border-[#0091FF]/30 bg-[#050a14]/60 backdrop-blur-[1px] flex flex-col gap-3 p-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="w-full h-1.5 bg-[#0091FF]/40 rounded" />
        ))}
      </div>
    </div>
  );
};

export default DashboardVisualization;