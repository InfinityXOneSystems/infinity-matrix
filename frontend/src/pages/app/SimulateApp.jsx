
import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import BackgroundEnergy from '@/components/BackgroundEnergy';
import { Rocket, PlayCircle, GitBranch, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const SimulateApp = () => {
  return (
    <div className="min-h-screen bg-[#020410] text-white flex flex-col">
       <Helmet><title>Simulation Core | Infinity X</title></Helmet>
       <BackgroundEnergy />
       
       <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
          <div className="w-24 h-24 rounded-full bg-[#D946EF]/20 flex items-center justify-center border border-[#D946EF]/50 mb-8 shadow-[0_0_50px_rgba(217,70,239,0.3)]">
             <Rocket size={48} className="text-[#D946EF]" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4 font-orbitron">Simulation <span className="text-[#D946EF]">Core</span></h1>
          <p className="text-white/60 max-w-md mb-8">
             Monte Carlo simulation environment ready. Test strategies in a risk-free sandbox.
          </p>

          <div className="glass-panel p-8 rounded-2xl border border-white/10 max-w-md w-full mb-8">
             <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-white/50 uppercase font-bold">Sandbox Status</span>
                <span className="text-xs text-[#D946EF] flex items-center gap-1"><ShieldCheck size={12} /> Secure</span>
             </div>
             
             <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg flex items-center gap-4">
                   <GitBranch className="text-[#D946EF]" />
                   <div className="text-left">
                      <div className="font-bold">Scenario Branching</div>
                      <div className="text-xs text-white/50">10,000+ iterations available</div>
                   </div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg flex items-center gap-4">
                   <PlayCircle className="text-[#D946EF]" />
                   <div className="text-left">
                      <div className="font-bold">War Games</div>
                      <div className="text-xs text-white/50">Ready to execute</div>
                   </div>
                </div>
             </div>
             
             <div className="mt-8">
                <Button className="w-full bg-[#D946EF] text-white hover:bg-[#C026D3]">Run Simulation</Button>
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

export default SimulateApp;
