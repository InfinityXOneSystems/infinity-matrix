
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, Eye, Network } from 'lucide-react';

const ArchitectAvatar = ({ type }) => {
  // Common container styles for consistency
  const containerClass = "w-full h-full flex items-center justify-center relative overflow-hidden bg-black/50";

  const renderAvatar = () => {
    switch (type) {
      case 'vision':
        return (
          <div className={containerClass}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,102,255,0.3)_0%,_transparent_70%)]" />
            
            {/* Brain/Mind Core */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative z-10"
            >
              <Brain size={80} className="text-[#0066FF] opacity-80" strokeWidth={1} />
            </motion.div>

            {/* Orbiting Thoughts */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-full h-full border border-[#0066FF]/20 rounded-full"
                style={{ width: `${120 + i * 40}px`, height: `${120 + i * 40}px` }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear", repeatType: "loop" }}
              >
                <div className="w-3 h-3 bg-[#0066FF] rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#0066FF]" />
              </motion.div>
            ))}
          </div>
        );

      case 'quantum':
        return (
          <div className={containerClass}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.2)_0%,_transparent_70%)]" />
            
            {/* Geometric Construct */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative z-10 w-32 h-32 border-2 border-cyan-400/50 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-2 border-cyan-400/70 flex items-center justify-center"
              >
                <motion.div
                   animate={{ rotate: 180, scale: [1, 0.8, 1] }}
                   transition={{ duration: 8, repeat: Infinity }}
                   className="w-16 h-16 bg-cyan-400/20 backdrop-blur-md border border-cyan-400 flex items-center justify-center"
                >
                  <Cpu size={32} className="text-cyan-200" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Floating Particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-sm"
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{ 
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </div>
        );

      case 'analyst':
        return (
          <div className={containerClass}>
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent_0%,_rgba(57,255,20,0.1)_50%,_transparent_100%)]" />
            
            {/* The Eye / Sensor */}
            <div className="relative z-10">
              <motion.div
                animate={{ scaleY: [0.1, 1, 0.1] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                className="mb-4 flex justify-center"
              >
                 <Eye size={64} className="text-[#39FF14]" strokeWidth={1.5} />
              </motion.div>

              {/* Data Streams */}
              <div className="flex gap-1 items-end h-16 justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-[#39FF14]/50"
                    animate={{ height: ["20%", "80%", "40%", "100%", "20%"] }}
                    transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
                  />
                ))}
              </div>
            </div>

            {/* Scanline */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-[#39FF14]/20 to-transparent h-1/4 w-full pointer-events-none"
              animate={{ top: ["-25%", "125%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        );

      case 'strategist':
        return (
          <div className={containerClass}>
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(217,70,239,0.2)_0%,_transparent_70%)]" />
             
             {/* Constellation Network */}
             <div className="relative w-full h-full">
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 15 }}
                  transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
                >
                   <Network size={80} className="text-fuchsia-500 opacity-60" />
                </motion.div>

                {/* Connecting Nodes */}
                {[...Array(5)].map((_, i) => (
                   <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-fuchsia-500 rounded-full shadow-[0_0_10px_#d946ef]"
                      style={{ 
                         top: `${30 + Math.random() * 40}%`, 
                         left: `${30 + Math.random() * 40}%` 
                      }}
                      animate={{ 
                         scale: [1, 1.5, 1],
                         opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ duration: 2 + Math.random(), repeat: Infinity }}
                   />
                ))}
                
                {/* Connecting Lines (SVG overlay) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                   <motion.path
                      d="M100,100 L200,150 L150,250 L50,200 Z"
                      fill="none"
                      stroke="#d946ef"
                      strokeWidth="1"
                      strokeOpacity="0.3"
                      animate={{ d: "M110,110 L210,140 L160,260 L40,190 Z" }}
                      transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
                   />
                </svg>
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-[#050a14] relative overflow-hidden group-hover:shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] transition-all duration-500">
      {renderAvatar()}
      
      {/* Overlay Glitch/Tech Effect on Hover */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 border-2 border-white/5 group-hover:border-[#39FF14]/50 transition-colors duration-300 pointer-events-none rounded-xl" />
    </div>
  );
};

export default ArchitectAvatar;
