
import React from 'react';
import { motion } from 'framer-motion';

const ZigZagBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Left Side Zigzag - Electric Blue */}
      <div className="absolute left-0 top-0 bottom-0 w-[20%] opacity-40">
        <svg height="100%" width="100%" preserveAspectRatio="none">
           <defs>
              <linearGradient id="gradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" style={{stopColor: '#0066FF', stopOpacity: 0.6}} />
                 <stop offset="100%" style={{stopColor: '#0066FF', stopOpacity: 0}} />
              </linearGradient>
           </defs>
           <motion.path 
              d="M0,0 L100,50 L0,100 L100,150 L0,200 L100,250 L0,300 L100,350 L0,400 L100,450 L0,500 L100,550 L0,600 L100,650 L0,700 L100,750 L0,800 L100,850 L0,900 L100,950 L0,1000 V1000 H0 Z"
              fill="url(#gradLeft)"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
           />
        </svg>
      </div>

      {/* Right Side Zigzag - Neon Green */}
      <div className="absolute right-0 top-0 bottom-0 w-[20%] opacity-40">
        <svg height="100%" width="100%" preserveAspectRatio="none" style={{ transform: 'scaleX(-1)' }}>
           <defs>
              <linearGradient id="gradRight" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" style={{stopColor: '#39FF14', stopOpacity: 0.6}} />
                 <stop offset="100%" style={{stopColor: '#39FF14', stopOpacity: 0}} />
              </linearGradient>
           </defs>
           <motion.path 
              d="M0,0 L100,50 L0,100 L100,150 L0,200 L100,250 L0,300 L100,350 L0,400 L100,450 L0,500 L100,550 L0,600 L100,650 L0,700 L100,750 L0,800 L100,850 L0,900 L100,950 L0,1000 V1000 H0 Z"
              fill="url(#gradRight)"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
           />
        </svg>
      </div>
      
      {/* 3D Depth Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.1]"
        style={{
           backgroundImage: 'linear-gradient(rgba(0, 102, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 102, 255, 0.5) 1px, transparent 1px)',
           backgroundSize: '40px 40px',
           transform: 'perspective(500px) rotateX(20deg)',
           transformOrigin: 'center 80%'
        }}
      />
    </div>
  );
};

export default ZigZagBackground;
