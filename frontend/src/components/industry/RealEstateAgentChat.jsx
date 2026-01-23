
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Brain, Zap, Activity, Shield, Search, 
  TrendingUp, Building2, Map, DollarSign, 
  Terminal, Wifi, AlertTriangle, Layers,
  ChevronDown, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// --- AGENT DEFINITIONS (12 Agents) ---
const AGENTS = [
  // Vision Cortex Agents (Analysis/Detection)
  { id: 'vc_1', name: 'Nexus-7', role: 'Market Scanner', system: 'Vision Cortex', icon: Search, color: '#39FF14', desc: 'Scans 400+ MLS feeds simultaneously.' },
  { id: 'vc_2', name: 'Vantage', role: 'Foreclosure Hunter', system: 'Vision Cortex', icon: AlertTriangle, color: '#39FF14', desc: 'Identifies pre-foreclosure signals.' },
  { id: 'vc_3', name: 'Specter', role: 'Distress Signal', system: 'Vision Cortex', icon: Activity, color: '#39FF14', desc: 'Detects financial distress patterns.' },
  { id: 'vc_4', name: 'Oracle', role: 'ROI Predictor', system: 'Vision Cortex', icon: TrendingUp, color: '#39FF14', desc: 'Projects 5-10 year appreciation.' },
  { id: 'vc_5', name: 'Sentry', role: 'Risk Assessor', system: 'Vision Cortex', icon: Shield, color: '#39FF14', desc: 'Evaluates environmental & regulatory risk.' },
  { id: 'vc_6', name: 'Prism', role: 'Pattern Recognizer', system: 'Vision Cortex', icon: Layers, color: '#39FF14', desc: 'Correlates macro trends with local pricing.' },
  
  // Quantum X Agents (Construction/Valuation)
  { id: 'qx_1', name: 'Architect', role: 'Dev Feasibility', system: 'Quantum X', icon: Building2, color: '#0066FF', desc: 'Simulates zoning and build capacity.' },
  { id: 'qx_2', name: 'Constructor', role: 'Cost Estimator', system: 'Quantum X', icon: Terminal, color: '#0066FF', desc: 'Real-time material & labor costing.' },
  { id: 'qx_3', name: 'Valuator', role: 'Asset Pricing', system: 'Quantum X', icon: DollarSign, color: '#0066FF', desc: 'High-frequency AVM modeling.' },
  { id: 'qx_4', name: 'Structura', role: 'Zoning Analyst', system: 'Quantum X', icon: Map, color: '#0066FF', desc: 'Parses municipal zoning codes.' },
  { id: 'qx_5', name: 'Yield', role: 'Cashflow Optimizer', system: 'Quantum X', icon: Zap, color: '#0066FF', desc: 'Optimizes cap rates and IRR.' },
  { id: 'qx_6', name: 'Titan', role: 'Portfolio Manager', system: 'Quantum X', icon: Brain, color: '#0066FF', desc: 'Balancing logic for multi-asset portfolios.' }
];

// --- QUANTUM JITTER HOOK ---
const useQuantumJitter = () => {
  const [metrics, setMetrics] = useState({
    interestRate: 6.85,
    foreclosureIndex: 1240,
    marketSentiment: 42,
    activeListings: 14502
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        interestRate: +(prev.interestRate + (Math.random() - 0.5) * 0.02).toFixed(3),
        foreclosureIndex: Math.floor(prev.foreclosureIndex + (Math.random() - 0.5) * 5),
        marketSentiment: Math.min(100, Math.max(0, Math.floor(prev.marketSentiment + (Math.random() - 0.5) * 2))),
        activeListings: Math.floor(prev.activeListings + (Math.random() - 0.5) * 10)
      }));
    }, 800); // 800ms jitter
    return () => clearInterval(interval);
  }, []);

  return metrics;
};

const RealEstateAgentChat = () => {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [messages, setMessages] = useState([
    { id: 1, role: 'system', content: 'Quantum Parallel Link Established. Real-time feed active.' },
    { id: 2, role: 'assistant', agentId: 'vc_1', content: 'Scanning local markets. Detected 3 distressed assets in Sector 7G.' }
  ]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const scrollRef = useRef(null);
  const metrics = useQuantumJitter();

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulated Agent Activity
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
        const alerts = [
          `Detected interest rate fluctuation: ${metrics.interestRate}%`,
          `New pre-foreclosure identified in Downtown district.`,
          `Zoning update parsed for North Sector. Density bonus applicable.`,
          `Cap rate compression detected in multi-family units.`,
          `Material cost update: Lumber +2.1% this week.`,
          `Sentiment shift: Market Confidence at ${metrics.marketSentiment}.`
        ];
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        
        setMessages(prev => [...prev.slice(-4), { // Keep only last 5 messages to prevent overflow in sticky view
          id: Date.now(),
          role: 'assistant',
          agentId: randomAgent.id,
          content: randomAlert
        }]);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [metrics]);

  return (
    <div className="flex flex-col h-full bg-[#020410]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background Energy Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#39FF14] to-transparent animate-pulse" />
         <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0066FF] to-transparent animate-pulse delay-700" />
      </div>

      {/* Header / Agent Selector */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 z-10 bg-black/40">
        <div className="relative">
          <button 
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#39FF14] transition-all group min-w-[240px]"
          >
             <div 
               className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/20 shadow-lg"
               style={{ backgroundColor: `${selectedAgent.color}20`, color: selectedAgent.color }}
             >
                <selectedAgent.icon size={16} />
             </div>
             <div className="text-left flex-1">
                <div className="text-xs text-white/40 uppercase font-bold tracking-wider">{selectedAgent.system}</div>
                <div className="text-sm font-bold text-white group-hover:text-[#39FF14] transition-colors">{selectedAgent.name}</div>
             </div>
             <ChevronDown size={14} className={cn("text-white/40 transition-transform", isSelectorOpen && "rotate-180")} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isSelectorOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 w-[320px] bg-[#020410] border border-[#39FF14]/30 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
              >
                 <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {AGENTS.map(agent => (
                       <button
                         key={agent.id}
                         onClick={() => { setSelectedAgent(agent); setIsSelectorOpen(false); }}
                         className={cn(
                           "w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left border border-transparent",
                           selectedAgent.id === agent.id 
                             ? "bg-[#39FF14]/10 border-[#39FF14]/30" 
                             : "hover:bg-white/5 hover:border-white/10"
                         )}
                       >
                          <div className="p-2 rounded bg-black/40" style={{ color: agent.color }}>
                             <agent.icon size={14} />
                          </div>
                          <div>
                             <div className="text-xs font-bold text-white">{agent.name}</div>
                             <div className="text-[10px] text-white/50">{agent.role}</div>
                          </div>
                       </button>
                    ))}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Metrics Ticker */}
        <div className="hidden md:flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider flex items-center gap-1">
                 <Wifi size={10} className="text-[#39FF14] animate-pulse" /> Live Stream
              </span>
              <span className="font-mono text-xs text-[#39FF14]">{metrics.interestRate}% APR</span>
           </div>
           <div className="h-8 w-px bg-white/10" />
           <div className="flex flex-col items-end">
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Foreclosure Idx</span>
              <span className="font-mono text-xs text-[#0066FF]">{metrics.foreclosureIndex}</span>
           </div>
           <div className="h-8 w-px bg-white/10" />
           <div className="flex flex-col items-end">
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Sentiment</span>
              <span className="font-mono text-xs text-[#D946EF]">{metrics.marketSentiment}/100</span>
           </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4" ref={scrollRef}>
         {messages.map((msg) => {
            const agent = AGENTS.find(a => a.id === msg.agentId) || AGENTS[0];
            return (
               <motion.div 
                 key={msg.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="flex gap-4 items-start"
               >
                  {msg.role === 'system' ? (
                     <div className="flex items-center gap-2 w-full text-[10px] text-white/30 uppercase font-bold tracking-widest justify-center my-2">
                        <Terminal size={12} /> {msg.content}
                     </div>
                  ) : (
                     <>
                        <div 
                           className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-lg"
                           style={{ 
                              backgroundColor: `${agent.color}10`, 
                              borderColor: `${agent.color}40`, 
                              color: agent.color 
                           }}
                        >
                           <agent.icon size={14} />
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-white">{agent.name}</span>
                              <span className="text-[10px] text-white/40 px-1.5 py-0.5 rounded border border-white/10 bg-white/5">{agent.role}</span>
                              <span className="text-[10px] text-white/20 ml-auto font-mono">{new Date(msg.id).toLocaleTimeString()}</span>
                           </div>
                           <div className="text-sm text-white/80 leading-relaxed bg-white/5 p-3 rounded-lg rounded-tl-none border border-white/10">
                              {msg.content}
                           </div>
                        </div>
                     </>
                  )}
               </motion.div>
            );
         })}
      </div>

      {/* Quick Input (Read Only / Trigger) */}
      <div className="p-4 bg-black/60 border-t border-white/10 flex gap-3">
         <input 
            placeholder={`Command ${selectedAgent.name}...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#39FF14] outline-none transition-colors font-mono"
         />
         <Button className="bg-[#39FF14] text-black hover:bg-[#32cc12] font-bold">
            <Zap size={16} />
         </Button>
      </div>
    </div>
  );
};

export default RealEstateAgentChat;
