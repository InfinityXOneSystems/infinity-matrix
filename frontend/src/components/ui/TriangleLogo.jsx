import React from 'react';
import { motion } from 'framer-motion';

const TriangleLogo = ({ className, size = 40 }) => {
  const blueColor = '#00008B'; // Deep Blue

  // Path logic:
  // We draw a triangle but leave a gap in the top-right side.
  // Triangle Vertices: Top (20, 4), Bottom-Right (36, 36), Bottom-Left (4, 36)
  // We start the path AFTER the gap on the right side, go to bottom-right, then bottom-left, then top, then end BEFORE the gap.
  
  // Gap coordinates calculation (approximate for visual balance):
  // Right side line goes from (20,4) to (36,36).
  // Gap Start (near top): x=23.2, y=10.4
  // Gap End (further down): x=25.6, y=15.2
  
  const pathD = "M 25.6 15.2 L 36 36 L 4 36 L 20 4 L 23.2 10.4";

  return (
    <div className={`flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible block"
      >
        <defs>
          <filter id="blue-glow" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="1.5" result="blur" />
             <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Layer 1: The Deep Blue Base Stroke (Thicker) */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={blueColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ filter: 'drop-shadow(0 0 2px rgba(0, 0, 139, 0.8))' }}
        />

        {/* Layer 2: The White Accent Overlay (Thinner, centered) 
            This provides the 'accent' and visibility against the dark background 
            while keeping the 'Deep Blue' identity via the outer borders. */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="white"
          strokeWidth="1"
          strokeOpacity="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }}
        />
      </svg>
    </div>
  );
};

export default TriangleLogo;