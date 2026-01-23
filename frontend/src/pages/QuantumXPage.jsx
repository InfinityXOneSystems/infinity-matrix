

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Play, Settings, Layers, 
  Rocket, RefreshCcw, Check, Sparkles, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// New Components
import BuildStream from '@/components/quantum/BuildStream';
import CodeHologram from '@/components/quantum/CodeHologram';
import { BUILDER_AGENTS, PROJECT_TYPES, MOCK_FILE_SYSTEM } from '@/lib/quantum-data';
import BackgroundEnergy from '@/components/BackgroundEnergy';
import TriangleLogo from '@/components/ui/TriangleLogo';

const QuantumXPage = () => {
  // --- STATES ---
  const [viewState, setViewState] = useState('config'); // config | building | complete
  const [interventionMode, setInterventionMode] = useState(false);
  
  // Project Config
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0].id);
  const [projectPrompt, setProjectPrompt] = useState('');
  
  // Build Simulation
  const [activeAgentId, setActiveAgentId] = useState('architect');
  const [buildLogs, setBuildLogs] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [progress, setProgress] = useState(0);

  // --- ACTIONS ---

  const startBuild = () => {
    if (!projectPrompt.trim()) return;
    setViewState('building');
    addLog('system', 'Initializing Quantum X Neural Grid...');
    addLog('system', `Loading specialized agents for ${PROJECT_TYPES.find(p => p.id === projectType).label}...`);
    
    setTimeout(() => {
       autonomousLoop();
    }, 1500);
  };

  const addLog = (type, message, agentId = null) => {
    const agent = BUILDER_AGENTS.find(a => a.id === agentId);
    setBuildLogs(prev => [...prev, {
      id: Date.now(),
      type, // 'system' | 'agent' | 'user' | 'error'
      message,
      agentName: agent?.name,
      agentColor: agent?.color
    }]);
  };

  const handleIntervention = (message) => {
    setInterventionMode(true);
    if (message) {
      addLog('user', message);
      setTimeout(() => {
         addLog('agent', "Acknowledged. Adjusting parameters based on user override.", activeAgentId);
      }, 1000);
    }
  };

  const resumeBuild = () => {
    setInterventionMode(false);
    addLog('system', "Resuming autonomous sequence...");
    autonomousLoop(); // Restart loop
  };

  // --- AUTONOMOUS LOOP SIMULATION ---
  const autonomousLoop = useCallback(() => {
    if (interventionMode || viewState === 'complete') return;

    let step = 0;
    const steps = [
      { agent: 'architect', msg: "Analyzing requirements. Structuring component hierarchy.", file: null },
      { agent: 'architect', msg: "Schema defined. Handoff to Backend Core.", file: 'schema.sql' },
      { agent: 'backend', msg: "Initializing Node.js Express server...", file: 'server.js' },
      { agent: 'backend', msg: "endpoints configured. Latency optimized.", file: null },
      { agent: 'frontend', msg: "Drafting UI layout with React + Tailwind.", file: 'App.jsx' },
      { agent: 'frontend', msg: "Injecting animation loops and glassmorphism.", file: 'styles.css' },
      { agent: 'security', msg: "Scanning for vulnerabilities... No threats detected.", file: null },
      { agent: 'architect', msg: "Build sequence complete. Preparing for deployment.", file: null },
    ];

    const runStep = (index) => {
      if (interventionMode) return; // Stop if paused
      if (index >= steps.length) {
        setViewState('complete');
        setProgress(100);
        return;
      }

      const s = steps[index];
      setActiveAgentId(s.agent);
      setActiveFile(s.file || activeFile); // Keep previous file if null
      addLog('agent', s.msg, s.agent);
      setProgress(Math.round(((index + 1) / steps.length) * 100));

      const delay = Math.random() * 2000 + 2000; // 2-4 seconds per step
      setTimeout(() => runStep(index + 1), delay);
    };

    runStep(0);

  }, [interventionMode, viewState, activeFile]);


  return (
    <div className="h-screen w-screen bg-[#020410] text-white flex flex-col overflow-hidden font-sans selection:bg-[#39FF14] selection:text-black">
      <Helmet><title>Quantum X Builder | Infinity X</title></Helmet>

      {/* --- HEADER --- */}
      <header className="h-16 border-b border-silver-border-color bg-[#020410]/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
           <Link to="/" className="text-white/50 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
           <div className="h-6 w-px bg-white/10" />
           <div className="flex items-center gap-2">
              <TriangleLogo size={24} />
              <span className="font-bold tracking-widest text-lg font-orbitron">
                 QUANTUM <span className="text-[#39FF14]">BUILDER</span>
              </span>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           {viewState === 'building' && (
              <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                 <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                 <span className="text-xs font-mono text-[#39FF14]">
                    AUTONOMOUS MODE ACTIVE
                 </span>
                 <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden ml-2">
                    <motion.div 
                       className="h-full bg-[#39FF14]" 
                       initial={{ width: 0 }}
                       animate={{ width: `${progress}%` }}
                    />
                 </div>
              </div>
           )}
           <Button variant="ghost" size="icon" className="text-white/50 hover:text-white"><Settings size={18} /></Button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex overflow-hidden relative">
        <BackgroundEnergy />
        
        {/* VIEW: CONFIGURATION */}
        <AnimatePresence>
          {viewState === 'config' && (
            <motion.div 
               key="config"
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
               className="absolute inset-0 z-20 flex items-center justify-center p-6"
            >
               <div className="w-full max-w-2xl glass-panel p-8 rounded-3xl border border-silver-border-color shadow-[0_0_50px_rgba(0,102,255,0.1)]">
                  <div className="text-center mb-10">
                     <div className="w-16 h-16 rounded-2xl bg-[#0066FF]/20 border border-[#0066FF]/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,102,255,0.3)]">
                        <Rocket size={32} className="text-[#0066FF]" />
                     </div>
                     <h1 className="text-4xl font-bold mb-3 tracking-tight">Initialize Build Sequence</h1>
                     <p className="text-white/50">Define your parameters. The autonomous swarm will handle the rest.</p>
                  </div>

                  <div className="space-y-8">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {PROJECT_TYPES.map(t => (
                           <button 
                              key={t.id}
                              onClick={() => setProjectType(t.id)}
                              className={cn(
                                 "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300",
                                 projectType === t.id 
                                    ? "bg-[#0066FF]/20 border-[#0066FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.2)]" 
                                    : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                              )}
                           >
                              <t.icon size={24} />
                              <span className="text-xs font-bold uppercase">{t.label}</span>
                           </button>
                        ))}
                     </div>

                     <div className="space-y-3">
                        <Label className="text-xs uppercase tracking-widest text-[#39FF14]">Project Directive</Label>
                        <Input 
                           value={projectPrompt}
                           onChange={e => setProjectPrompt(e.target.value)}
                           placeholder="e.g., A minimalist dashboard for tracking crypto assets with dark mode..."
                           className="h-14 bg-black/40 border-white/20 text-lg focus:border-[#39FF14]"
                        />
                     </div>

                     <Button 
                        onClick={startBuild}
                        disabled={!projectPrompt.trim()}
                        className="w-full h-16 text-lg font-bold bg-[#39FF14] hover:bg-[#32cc12] text-black tracking-widest uppercase shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:scale-[1.02] transition-all"
                     >
                        <Play size={20} className="mr-3 fill-current" /> Launch Agents
                     </Button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* VIEW: BUILDING (Split Screen) */}
        {(viewState === 'building' || viewState === 'complete') && (
           <div className="flex w-full h-full">
              
              {/* LEFT: INTERACTION / LOGS (35%) */}
              <motion.div 
                 initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                 className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 border-r border-silver-border-color bg-[#020410]/50"
              >
                 <BuildStream 
                    activeAgentId={activeAgentId} 
                    buildLogs={buildLogs} 
                    onIntervene={handleIntervention}
                    interventionMode={interventionMode}
                    onResume={resumeBuild}
                 />
              </motion.div>

              {/* RIGHT: VISUALIZATION (65%) */}
              <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                 className="hidden lg:flex flex-1 bg-black/80 p-6 flex-col gap-6 relative"
              >
                 {/* Live Status Overlay */}
                 <div className="flex justify-between items-center text-white/40 text-xs uppercase tracking-widest font-mono">
                    <span className="flex items-center gap-2">
                       <Activity size={12} className="text-[#39FF14]" /> Live Compilation
                    </span>
                    <span>Session ID: {Date.now().toString().slice(-6)}</span>
                 </div>

                 {/* The Code/Preview Hologram */}
                 <div className="flex-1">
                    <CodeHologram 
                       activeFile={activeFile} 
                       buildState={viewState} 
                       interventionMode={interventionMode}
                    />
                 </div>

                 {/* Complete State Overlay */}
                 {viewState === 'complete' && (
                    <motion.div 
                       initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                       className="absolute bottom-10 left-1/2 -translate-x-1/2 glass-panel px-8 py-4 rounded-full border border-[#39FF14] bg-[#39FF14]/10 shadow-[0_0_30px_rgba(57,255,20,0.3)] flex items-center gap-4"
                    >
                       <CheckCircleIcon />
                       <span className="font-bold text-[#39FF14]">System Architecture Deployed</span>
                       <div className="h-4 w-px bg-[#39FF14]/30" />
                       <button className="text-white hover:text-white/80 text-sm underline">View Production URL</button>
                    </motion.div>
                 )}
              </motion.div>
           </div>
        )}
      </main>
    </div>
  );
};

const CheckCircleIcon = () => (
  <div className="w-6 h-6 rounded-full bg-[#39FF14] flex items-center justify-center text-black">
     <Check size={14} strokeWidth={4} />
  </div>
);

export default QuantumXPage;
