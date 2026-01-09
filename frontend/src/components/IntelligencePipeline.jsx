
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Sparkles, BrainCircuit, ShieldCheck, Hammer, Rocket, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const IntelligencePipeline = () => {
  const [hoveredStep, setHoveredStep] = useState(null);

  const steps = [
    { 
      id: 'vision', 
      label: 'Vision', 
      icon: Eye, 
      color: '#39FF14', // Lime Green
      desc: 'Analyzing global data streams'
    },
    { 
      id: 'prediction', 
      label: 'Prediction', 
      icon: Sparkles, 
      color: '#FFFF00', // Yellow
      desc: 'Forecasting market vectors'
    },
    { 
      id: 'strategy', 
      label: 'Strategy', 
      icon: BrainCircuit, 
      color: '#0066FF', // Blue
      desc: 'Formulating optimal paths'
    },
    { 
      id: 'validation', 
      label: 'Validation', 
      icon: ShieldCheck, 
      color: '#8A2BE2', // Purple
      desc: 'Risk assessment protocols'
    },
    { 
      id: 'create', 
      label: 'Create', 
      icon: Hammer, 
      color: '#FF8C00', // Orange
      desc: 'Autonomous execution'
    },
    { 
      id: 'launch', 
      label: 'Launch', 
      icon: Rocket, 
      color: '#FF0000', // Red
      desc: 'Deployment & Scaling'
    },
  ];

  return (
    <div className="w-full relative py-12 px-4 md:px-8">
      {/* Outer Tech Box Container */}
      <div className="relative glass-panel rounded-xl border border-[#0066FF]/30 bg-black/40 overflow-hidden p-8 md:p-12">
        
        {/* Decorative Tech Corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#0066FF] rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#0066FF] rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#0066FF] rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#0066FF] rounded-br-lg" />

        {/* Scanline Background Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,102,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
        
        {/* Connection Line Background */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#0066FF]/20 to-transparent -translate-y-1/2 hidden md:block" />

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-4 items-start">
          {steps.map((step, index) => {
            const isHovered = hoveredStep === step.id;
            const Icon = step.icon;

            return (
              <div 
                key={step.id}
                className="relative flex flex-col items-center group cursor-pointer"
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Connector Line (Mobile hidden, desktop handled by absolute bg above, but we add active highlights) */}
                {index < steps.length - 1 && (
                   <div className="hidden md:block absolute top-1/2 -right-1/2 w-full h-[2px] z-0">
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: hoveredStep === step.id ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ backgroundColor: step.color, transformOrigin: 'left' }}
                        className="h-full w-full opacity-50"
                      />
                   </div>
                )}

                {/* Hexagon/Circle Icon Container */}
                <motion.div
                  className="relative z-10 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-black/60 border border-[#0066FF]/30 backdrop-blur-md mb-4"
                  animate={{
                    borderColor: isHovered ? step.color : 'rgba(0, 102, 255, 0.3)',
                    boxShadow: isHovered ? `0 0 30px ${step.color}40` : 'none',
                    scale: isHovered ? 1.1 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon 
                    size={28} 
                    color={step.color} 
                    className="transition-colors duration-300"
                    strokeWidth={1.5}
                  />
                  
                  {/* Orbiting Ring Animation when hovered */}
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 rounded-full border border-dashed"
                      style={{ borderColor: step.color }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </motion.div>

                {/* Text Content */}
                <div className="text-center space-y-1 relative z-20 h-24">
                  <h3 
                    className="font-bold uppercase tracking-wider text-sm md:text-lg transition-colors duration-300"
                    style={{ color: step.color }}
                  >
                    {step.label}
                  </h3>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -5 }}
                    className="text-[10px] md:text-xs text-white/50 max-w-[100px] mx-auto leading-tight hidden md:block"
                  >
                    {step.desc}
                  </motion.p>
                </div>
                
                {/* Mobile Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="md:hidden absolute top-8 -right-4 text-[#0066FF]/30">
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-8 pt-8 border-t border-[#0066FF]/10 flex flex-col items-center justify-center gap-4">
           <div className="flex items-center gap-2">
              <div className="flex gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
                 <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse delay-75" />
                 <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse delay-150" />
              </div>
              <span className="text-[#0066FF] text-xs md:text-sm font-mono uppercase tracking-[0.3em]">System Active</span>
              <div className="flex gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse delay-150" />
                 <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse delay-75" />
                 <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
              </div>
           </div>
           
           <div className="border border-[#39FF14] px-6 py-2 rounded-lg shadow-[0_0_15px_rgba(57,255,20,0.4)] bg-black/50">
             <h4 className="text-3xl md:text-4xl font-bold text-white tracking-widest uppercase text-glow">
               Fully Autonomous
             </h4>
           </div>
        </div>

      </div>
    </div>
  );
};

export default IntelligencePipeline;
