
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Brain, Hammer, Activity, Play, Zap, Bot,
  Shield, Code, Globe, Cpu, Sparkles, Star, 
  BarChart3, Settings, Lock, CheckCircle2,
  ChevronDown, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BackgroundEnergy from '@/components/BackgroundEnergy';
import SEOHead from '@/components/SEOHead';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useContent } from '@/hooks/useContent';

// --- VISUAL COMPONENTS ---

const SystemHologram = ({ id, color }) => {
  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-black/20">
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80 z-10" />
       
       {/* Ambient Glow */}
       <div 
          className="absolute inset-0 opacity-30 blur-[60px]"
          style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
       />

       {/* Animated Core */}
       <motion.div 
          className="relative z-0 opacity-80"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
       >
          <div className="w-64 h-64 border border-dashed rounded-full flex items-center justify-center border-opacity-30" style={{ borderColor: color }}>
             <div className="w-48 h-48 border border-dotted rounded-full flex items-center justify-center border-opacity-40" style={{ borderColor: color }}>
                <Cpu size={80} style={{ color }} className="animate-pulse" />
             </div>
          </div>
       </motion.div>
       
       {/* Floating Particles */}
       {[...Array(8)].map((_, i) => (
          <motion.div
             key={i}
             className="absolute w-1 h-1 rounded-full bg-white z-20"
             style={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%` 
             }}
             animate={{ 
                y: [0, -100], 
                opacity: [0, 1, 0] 
             }}
             transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
       ))}
    </div>
  );
};

// --- DATA: INTERNAL SYSTEMS ---
const SYSTEMS = [
  {
    id: 'vision-cortex',
    title: 'Vision Cortex',
    subTitle: 'Cognitive Engine',
    desc: 'The central nervous system. Processes multimodal data streams to derive actionable signal.',
    color: '#3399FF',
    icon: <Brain />,
    features: ['Multimodal Processing', 'Real-time Signal', 'Adaptive Learning'],
    stats: [{ label: 'Latency', value: '12ms' }, { label: 'Accuracy', value: '99.9%' }]
  },
  {
    id: 'simulation',
    title: 'Simulation System',
    subTitle: 'Predictive Modeling',
    desc: 'Run Monte Carlo simulations on business strategies before deploying capital.',
    color: '#D946EF',
    icon: <Play />,
    features: ['Infinite Scenarios', 'Digital Twins', 'Risk Modeling'],
    stats: [{ label: 'Sims/Sec', value: '1M+' }, { label: 'Depth', value: 'L5' }]
  },
  {
    id: 'prediction',
    title: 'Prediction System',
    subTitle: 'Future Forecasting',
    desc: 'AI-driven market forecasting and trend analysis with 94% historical accuracy.',
    color: '#39FF14',
    icon: <Activity />,
    features: ['Trend Analysis', 'Market Scouting', 'Anomaly Detection'],
    stats: [{ label: 'Horizon', value: '3-12mo' }, { label: 'Confidence', value: 'High' }]
  },
  {
    id: 'quantum-x',
    title: 'Quantum X',
    subTitle: 'Generative Builder',
    desc: 'Generative architectural engine capable of scaffolding complex software infrastructures.',
    color: '#00FFFF',
    icon: <Hammer />,
    features: ['Code Generation', 'Auto-Scaling', 'Self-Healing'],
    stats: [{ label: 'Build Time', value: '<2min' }, { label: 'Stack', value: 'Full' }]
  },
  {
    id: 'agent-builder',
    title: 'Agent Builder',
    subTitle: 'Autonomous Workers',
    desc: 'Create, train, and deploy specialized AI agents to handle specific tasks.',
    color: '#FFD700',
    icon: <Bot />,
    features: ['No-Code Studio', 'Swarm Logic', 'Role Definition'],
    stats: [{ label: 'Agents', value: 'Unlimited' }, { label: 'Deploy', value: 'Instant' }]
  },
  {
    id: 'modes',
    title: 'System Modes',
    subTitle: 'Operational Control',
    desc: 'Switch between Auto, Hybrid, and Manual modes to control the level of autonomy.',
    color: '#FF3333',
    icon: <Settings />,
    features: ['Full Autonomy', 'Human-in-Loop', 'Direct Control'],
    stats: [{ label: 'Control', value: '100%' }, { label: 'Safety', value: 'Max' }]
  }
];

const TechnologyPage = () => {
  const [activeSystem, setActiveSystem] = useState(null);
  const { toast } = useToast();
  
  // Use CMS Content
  const heroTitle = useContent('tech.hero.title', 'INTELLIGENCE SYSTEMS');
  const heroDesc = useContent('tech.hero.desc', 'Explore the core technologies powering the Infinity X network.');

  const handleRequestAccess = (e) => {
    e.preventDefault();
    toast({
      title: "Access Requested",
      description: "You have been added to the secure waitlist.",
      className: "bg-black border-[#39FF14] text-white"
    });
  };

  return (
    <>
      <SEOHead 
        title="Intelligence Systems | Infinity X"
        description="Explore the Vision Cortex, Simulation Core, and Agent Builder technologies."
      />

      <div className="relative min-h-screen bg-transparent overflow-x-hidden text-white font-sans selection:bg-[#39FF14] selection:text-black pb-32">
        <div className="fixed inset-0 z-[-1]">
           <BackgroundEnergy />
        </div>

        {/* HERO SECTION */}
        <section className="relative pt-32 pb-16 px-6 text-center z-10 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 md:mb-10 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-black/40 backdrop-blur-md shadow-lg"
          >
             <div className="w-2 h-2 rounded-full bg-[#66FF33] animate-pulse" />
             <span className="text-white/90 text-[10px] md:text-xs tracking-widest uppercase font-bold">Internal Systems v4.2</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-8 md:mb-10 drop-shadow-2xl font-orbitron"
          >
             {heroTitle}
          </motion.h1>
          
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="text-lg md:text-2xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed mb-10 drop-shadow-md"
          >
             {heroDesc}
          </motion.p>
        </section>

        {/* SYSTEMS GRID */}
        <section className="relative px-4 md:px-6 max-w-[1600px] mx-auto z-10 mb-24">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SYSTEMS.map((sys, i) => (
                 <motion.div
                    key={sys.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setActiveSystem(activeSystem === sys.id ? null : sys.id)}
                    className={cn(
                       "group relative glass-panel p-1 rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col",
                       activeSystem === sys.id ? "border-[#39FF14] shadow-[0_0_30px_rgba(57,255,20,0.2)]" : "border-white/10 hover:border-[#39FF14]/50"
                    )}
                 >
                    <div className="aspect-[16/9] overflow-hidden rounded-xl mb-0 relative bg-black/50 w-full">
                       <SystemHologram id={sys.id} color={sys.color} />
                       
                       <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent pt-24 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#39FF14] transition-all duration-300">
                             {sys.title}
                          </h3>
                          <p className="text-[#3399FF] text-xs uppercase tracking-widest font-mono group-hover:text-white transition-colors duration-300 mb-2">
                             {sys.subTitle}
                          </p>
                       </div>
                       
                       {activeSystem === sys.id && (
                          <div className="absolute top-4 right-4 bg-[#39FF14] text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse z-20">
                             ACTIVE
                          </div>
                       )}
                    </div>
                    <div className="p-4 bg-white/5">
                      <p className="text-white/60 text-sm">{sys.desc}</p>
                    </div>
                 </motion.div>
              ))}
           </div>
        </section>

        {/* DYNAMIC REVEAL SECTION */}
        <AnimatePresence mode="wait">
           {activeSystem && (
              <motion.section 
                 key={activeSystem}
                 initial={{ opacity: 0, height: 0, scale: 0.98 }}
                 animate={{ opacity: 1, height: 'auto', scale: 1 }}
                 exit={{ opacity: 0, height: 0, scale: 0.98 }}
                 transition={{ duration: 0.4, ease: "circOut" }}
                 className="relative z-20 mb-24 px-4 md:px-6"
              >
                 <div className="max-w-7xl mx-auto">
                    <div className="glass-panel rounded-3xl border border-[#39FF14]/30 shadow-[0_0_80px_rgba(0,0,0,0.6)] bg-black/80 backdrop-blur-xl relative overflow-hidden">
                       {(() => {
                          const selected = SYSTEMS.find(s => s.id === activeSystem);
                          return (
                             <div className="p-8 md:p-12 relative z-10">
                                <h2 className="text-4xl font-bold text-white mb-6">
                                   Deploy <span style={{ color: selected.color }}>{selected.title}</span>
                                </h2>
                                <p className="text-white/70 text-lg mb-8 max-w-2xl">{selected.desc}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                   <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                      <h3 className="text-sm font-bold text-white uppercase mb-4">Core Capabilities</h3>
                                      <ul className="space-y-3">
                                         {selected.features.map(f => (
                                            <li key={f} className="flex items-center gap-3 text-white/80">
                                               <CheckCircle2 size={16} style={{ color: selected.color }} /> {f}
                                            </li>
                                         ))}
                                      </ul>
                                   </div>
                                   <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                      <h3 className="text-sm font-bold text-white uppercase mb-4">System Metrics</h3>
                                      <div className="grid grid-cols-2 gap-4">
                                         {selected.stats.map(s => (
                                            <div key={s.label}>
                                               <div className="text-2xl font-bold text-white">{s.value}</div>
                                               <div className="text-xs text-white/40 uppercase">{s.label}</div>
                                            </div>
                                         ))}
                                      </div>
                                   </div>
                                </div>

                                <div className="flex justify-end">
                                  <Link to={`/app/${selected.id}`}>
                                   <Button className="bg-[#39FF14] text-black hover:bg-[#32cc12] font-bold uppercase tracking-widest px-8 py-6 rounded-xl">
                                      Launch System <ArrowRight size={20} className="ml-2" />
                                   </Button>
                                  </Link>
                                </div>
                             </div>
                          );
                       })()}
                    </div>
                 </div>
              </motion.section>
           )}
        </AnimatePresence>

      </div>
    </>
  );
};

export default TechnologyPage;
