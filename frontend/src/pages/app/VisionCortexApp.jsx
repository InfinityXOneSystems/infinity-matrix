
import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import BackgroundEnergy from '@/components/BackgroundEnergy';
import { Brain, Eye, Activity, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const VisionCortexApp = () => {
  return (
    <div className="min-h-screen bg-[#020410] text-white flex flex-col">
       <Helmet><title>Vision Cortex | Infinity X</title></Helmet>
       <BackgroundEnergy />
       
       <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
          <div className="w-24 h-24 rounded-full bg-[#3399FF]/20 flex items-center justify-center border border-[#3399FF]/50 mb-8 shadow-[0_0_50px_rgba(51,153,255,0.3)]">
             <Brain size={48} className="text-[#3399FF]" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4 font-orbitron">Vision <span className="text-[#3399FF]">Cortex</span></h1>
          <p className="text-white/60 max-w-md mb-8">
             The central cognitive engine is online. Processing multimodal data streams.
          </p>

          <div className="glass-panel p-8 rounded-2xl border border-white/10 max-w-md w-full mb-8">
             <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-white/50 uppercase font-bold">System Status</span>
                <span className="text-xs text-[#39FF14] flex items-center gap-1"><Activity size={12} /> Operational</span>
             </div>
             
             <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg flex items-center gap-4">
                   <Eye className="text-[#3399FF]" />
                   <div className="text-left">
                      <div className="font-bold">Visual Analysis</div>
                      <div className="text-xs text-white/50">Processing video feeds...</div>
                   </div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg flex items-center gap-4">
                   <Zap className="text-[#3399FF]" />
                   <div className="text-left">
                      <div className="font-bold">Signal Detection</div>
                      <div className="text-xs text-white/50">Monitoring 14M data points...</div>
                   </div>
                </div>
             </div>
             
             <div className="mt-8">
                <Button className="w-full bg-[#3399FF] text-white hover:bg-[#2288EE]">Initialize Scan</Button>
             </div>
          </div>
          
          <div className="mt-8">
             <Link to="/">
                <Button variant="ghost" className="text-white/50 hover:text-white">Return Home</Button>
             </Link>
          </div>
       </div>
    </div>
  );
};

export default VisionCortexApp;
