
import React from 'react';
import { motion } from 'framer-motion';

const BackgroundEnergy = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#020410]">
      {/* 
         DEEP BLUE & NEON GREEN OVERHAUL
         - Base: Very dark blue/black (#020410)
         - Accents: Neon Green (#39FF14) and Electric Blue (#0066FF)
         - Style: Cybernetic/Neural Network Energy
      */}
      
      {/* 1. Deep Foundation Gradient - Darker, richer blue base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#010208] via-[#050a1f] to-[#010208]" />

      {/* 2. Neural Grid Texture - Subtle overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `linear-gradient(rgba(57, 255, 20, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.3) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* 3. Primary Rotating Energy Field - Deep Blue & Neon Green Mix */}
      <motion.div 
        className="absolute inset-[-50%]"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 60,
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{ opacity: 0.4 }}
      >
        <div 
            className="absolute inset-0 w-full h-full opacity-40 blur-[120px]"
            style={{
                background: 'conic-gradient(from 0deg at 50% 50%, #020410 0%, #0044AA 25%, #020410 50%, #22880a 75%, #020410 100%)',
                transform: 'scale(1.5)'
            }}
        />
      </motion.div>

      {/* 4. Secondary Counter-Flow - Highlighting Neon Green */}
      <motion.div 
        className="absolute inset-[-50%]"
        animate={{ rotate: -360 }}
        transition={{ 
          duration: 70,
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{ opacity: 0.3 }}
      >
        <div 
            className="absolute inset-0 w-full h-full opacity-30 blur-[100px]"
            style={{
                background: 'conic-gradient(from 180deg at 45% 55%, transparent 0%, #39FF14 20%, transparent 40%, #0066FF 60%, transparent 100%)',
                transform: 'scale(1.4)'
            }}
        />
      </motion.div>

      {/* 5. Deep Blue Side Glows - Ambient Depth */}
      <motion.div 
        className="absolute top-[30%] left-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen blur-[150px]"
        animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: 'radial-gradient(circle, #0033CC 0%, transparent 70%)' }}
      />

      {/* 6. Neon Green Pulse - Right Side - Sharper focus */}
      <motion.div 
        className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full mix-blend-screen blur-[120px]"
        animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ background: 'radial-gradient(circle, #39FF14 0%, transparent 70%)' }}
      />

      {/* 7. Center Core Glow - Combining both colors */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full mix-blend-screen blur-[130px]"
        animate={{ 
            scale: [0.9, 1.1, 0.9], 
            opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: 'radial-gradient(circle, #0088AA 0%, transparent 60%)' }}
      />
      
      {/* 8. Floating Particles / Digital Noise */}
      <svg className="absolute inset-0 opacity-[0.15] w-full h-full pointer-events-none mix-blend-color-dodge">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
      </svg>
    </div>
  );
};

export default BackgroundEnergy;
