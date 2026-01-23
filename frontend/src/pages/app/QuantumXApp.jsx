
import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import BackgroundEnergy from '@/components/BackgroundEnergy';
import { Hammer, Code, Cpu, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuantumXApp = () => {
  return (
    <div className="min-h-screen bg-[#020410] text-white flex flex-col">
       <Helmet><title>Quantum X Builder | Infinity X</title></Helmet>
       <BackgroundEnergy />
       
       <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
          <div className="w-24 h-24 rounded-full bg-[#33DDFF]/20 flex items-center justify-center border border-[#33DDFF]/50 mb-8 shadow-[0_0_50px_rgba(51,221,255,0.3)]">
             <Hammer size={48} className="text-[#33DDFF]" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4 font-orbitron">Quantum <span className="text-[#33DDFF]">X</span></h1>
          <p className="text-white/60 max-w-md mb-8">
             Generative architectural engine ready. Describe your infrastructure to begin scaffolding.
          </p>

          <div className="glass-panel p-8 rounded-2xl border border-white/10 max-w-md w-full mb-8">
             <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-white/50 uppercase font-bold">Builder Core</span>
                <span className="text-xs text-[#33DDFF] flex items-center gap-1"><Cpu size={12} /> Ready</span>
             </div>
             
             <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg flex items-center gap-4">
                   <Code className="text-[#33DDFF]" />
                   <div className="text-left">
                      <div className="font-bold">Code Generation</div>
                      <div className="text-xs text-white/50">Waiting for prompt...</div>
                   </div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg flex items-center gap-4">
                   <Layers className="text-[#33DDFF]" />
                   <div className="text-left">
                      <div className="font-bold">Infrastructure</div>
                      <div className="text-xs text-white/50">Cloud agnostic deployment</div>
                   </div>
                </div>
             </div>
             
             <div className="mt-8">
                <Button className="w-full bg-[#33DDFF] text-black hover:bg-[#22CCEE]">Start New Project</Button>
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

export default QuantumXApp;
