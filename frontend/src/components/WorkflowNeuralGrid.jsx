
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';

const WorkflowNeuralGrid = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [clickedNode, setClickedNode] = useState(null);
  const [autoPulseNode, setAutoPulseNode] = useState(null);

  // Recursive Fractal Generation
  // Creates a hexagonal branching structure
  const generateFractalNodes = (depth = 3, center = { x: 200, y: 200 }) => {
    const nodes = [];
    const connections = [];

    // Helper for recursion
    const createBranch = (level, x, y, angle, parentId) => {
      const id = `node-l${level}-${Math.round(x)}-${Math.round(y)}`;
      
      // Prevent duplicate nodes at same position (though math should prevent this)
      if (!nodes.find(n => n.id === id)) {
        nodes.push({ id, x, y, level, parentId, angle });
        
        if (parentId) {
          connections.push({ from: parentId, to: id, level });
        }
      }

      if (level < depth) {
        // Branching Logic
        // Level 0 (Center) -> 6 branches (Hexagon)
        // Level 1+ -> 2 branches (Bifurcation)
        const branchCount = level === 0 ? 6 : 2;
        const radius = level === 0 ? 90 : (60 / Math.pow(1.1, level)); // Radius decreases slightly
        
        for (let i = 0; i < branchCount; i++) {
          let newAngle;
          
          if (level === 0) {
             // Hexagonal distribution
             newAngle = (i * 60) * (Math.PI / 180); 
          } else {
             // Bifurcation relative to parent angle
             // Spread gets narrower as we go deeper to avoid overlap
             const spread = 45 / Math.pow(1.5, level - 1); 
             const direction = i === 0 ? -1 : 1;
             newAngle = angle + (direction * spread * (Math.PI / 180));
          }

          const newX = x + Math.cos(newAngle) * radius;
          const newY = y + Math.sin(newAngle) * radius;

          createBranch(level + 1, newX, newY, newAngle, id);
        }
      }
    };

    // Initialize root
    createBranch(0, center.x, center.y, 0, null);

    return { nodes, connections };
  };

  const { nodes, connections } = useMemo(() => generateFractalNodes(3), []);

  // Determine path to root for highlighting
  const getPathToRoot = (targetNodeId) => {
    const path = new Set();
    if (!targetNodeId) return path;

    let currentId = targetNodeId;
    while (currentId) {
      path.add(currentId);
      const node = nodes.find(n => n.id === currentId);
      currentId = node ? node.parentId : null;
    }
    return path;
  };

  const activePath = useMemo(() => {
    if (hoveredNode) return getPathToRoot(hoveredNode);
    if (clickedNode) return getPathToRoot(clickedNode);
    if (autoPulseNode) return getPathToRoot(autoPulseNode);
    return new Set();
  }, [hoveredNode, clickedNode, autoPulseNode, nodes]);

  // Idle Animation: Random pulses if no user interaction
  useEffect(() => {
    if (hoveredNode || clickedNode) return;

    const interval = setInterval(() => {
      const leaves = nodes.filter(n => n.level === 3);
      const randomLeaf = leaves[Math.floor(Math.random() * leaves.length)];
      setAutoPulseNode(randomLeaf.id);
      
      setTimeout(() => setAutoPulseNode(null), 2000);
    }, 4000);

    return () => clearInterval(interval);
  }, [hoveredNode, clickedNode, nodes]);

  return (
    <div className="w-full h-full relative group">
      <svg viewBox="0 0 400 400" className="w-full h-full p-4 overflow-visible">
        <defs>
          <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connections Layer */}
        {connections.map((conn) => {
          const start = nodes.find(n => n.id === conn.from);
          const end = nodes.find(n => n.id === conn.to);
          const isActive = activePath.has(conn.to) && activePath.has(conn.from);

          return (
            <motion.line
              key={`${conn.from}-${conn.to}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={isActive ? "#39FF14" : "#0066FF"}
              strokeWidth={isActive ? 1.5 : 0.5}
              strokeOpacity={isActive ? 0.8 : 0.2}
              initial={false}
              animate={{
                stroke: isActive ? "#39FF14" : "#0066FF",
                strokeWidth: isActive ? 2 : 0.5,
                strokeOpacity: isActive ? 0.6 : 0.2
              }}
              transition={{ duration: 0.4 }}
            />
          );
        })}

        {/* Nodes Layer */}
        {nodes.map((node) => {
          const isActive = activePath.has(node.id);
          const isHovered = hoveredNode === node.id;
          const isRoot = node.level === 0;

          return (
            <motion.g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setClickedNode(clickedNode === node.id ? null : node.id)}
              style={{ cursor: 'pointer' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: node.level * 0.1, duration: 0.5 }}
            >
              {/* Hit Area for easier hovering */}
              <circle cx={node.x} cy={node.y} r={15} fill="transparent" />

              {/* Outer Ring */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isRoot ? 12 : 5}
                fill="transparent"
                stroke={isActive ? "#39FF14" : "#0066FF"}
                strokeWidth={isHovered ? 2 : 1}
                strokeOpacity={isActive || isHovered ? 0.9 : 0.3}
                animate={{
                  r: isHovered ? (isRoot ? 16 : 8) : (isRoot ? 12 : 5),
                  stroke: isActive || isHovered ? "#39FF14" : "#0066FF"
                }}
              />

              {/* Core */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isRoot ? 6 : 2.5}
                fill={isActive ? "#39FF14" : "#000"}
                stroke={isActive ? "#39FF14" : "#0066FF"}
                strokeWidth={1}
                filter={isActive ? "url(#glow-green)" : "url(#glow-blue)"}
                animate={{
                  fill: isActive ? "#39FF14" : "#050a14",
                  stroke: isActive ? "#39FF14" : "#0066FF"
                }}
              />
              
              {/* Pulse effect for active nodes */}
              {isActive && (
                 <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={isRoot ? 12 : 5}
                    stroke="#39FF14"
                    strokeWidth={1}
                    fill="transparent"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                 />
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* Info Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none">
         <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${activePath.size > 0 ? 'bg-[#39FF14] animate-pulse' : 'bg-[#0066FF]'}`} />
            <span className="text-[10px] font-mono text-[#0066FF] uppercase tracking-widest">
               {activePath.size > 0 ? 'SIGNAL DETECTED' : 'AWAITING INPUT'}
            </span>
         </div>
      </div>
    </div>
  );
};

export default WorkflowNeuralGrid;
