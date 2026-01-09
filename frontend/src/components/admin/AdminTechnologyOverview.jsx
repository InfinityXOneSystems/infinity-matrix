
import React from 'react';
import { 
  Brain, Code2, Globe, Bot, TrendingUp, BarChart2, 
  Zap, Clock, AlertTriangle, CheckCircle2, Shield, 
  Workflow, Database, ArrowRight, Sparkles, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Copy of data from the original TechnologyPage
const COMPARISON_DATA = [
  {
    stage: "Idea Validation",
    traditional: { time: "2-4 Weeks", friction: "High", desc: "Manual research, surveys, intuition" },
    currentAI: { time: "2-3 Days", friction: "Medium", desc: "Chat-based brainstorming, fragmented context" },
    infinityX: { time: "10 Minutes", friction: "Zero", desc: "Instant simulation, market analysis, probability scoring" }
  },
  {
    stage: "System Architecture",
    traditional: { time: "1-2 Months", friction: "High", desc: "Hiring architects, drafting specs" },
    currentAI: { time: "1 Week", friction: "Medium", desc: "Generating code snippets, manual assembly" },
    infinityX: { time: "Instant", friction: "Zero", desc: "Autonomous full-stack generation & deployment" }
  },
  {
    stage: "Execution & Ops",
    traditional: { time: "Ongoing", friction: "High", desc: "Human management, burnout, error prone" },
    currentAI: { time: "Ongoing", friction: "Medium", desc: "Human-in-loop required for every step" },
    infinityX: { time: "Autonomous", friction: "Zero", desc: "Self-healing swarm agents, persistent memory" }
  }
];

const SYSTEM_MODULES = [
  {
    id: 'vision-cortex',
    title: 'Vision Cortex',
    icon: Brain,
    color: '#39FF14',
    desc: 'The central neural core. Acts as your strategist, predictor, and invention machine.',
    stats: { roi: '+450%', efficiency: '10x' },
    features: ['Strategy Engine', 'Market Prediction', 'Problem Solver', 'Invention Lab'],
    link: '/vision-cortex'
  },
  {
    id: 'quantum-x',
    title: 'Quantum X Builder',
    icon: Code2,
    color: '#0066FF',
    desc: 'Autonomous software foundry. Generates full-stack apps, business plans, and dashboards instantly.',
    stats: { roi: '+1200%', speed: '< 2min' },
    features: ['App Generation', 'Backend Logic', 'UI/UX Design', 'Business Plans'],
    link: '/quantum-x-builder'
  },
  {
    id: 'intelligence',
    title: 'Infinity Intelligence',
    icon: Globe,
    color: '#D946EF',
    desc: 'Deep-dive vertical knowledge across 12 major industries and 120 sub-sectors.',
    stats: { coverage: '100%', depth: 'Lvl 5' },
    features: ['Real Estate', 'Finance', 'Healthcare', 'Tech Sector'],
    link: '/intelligence'
  },
  {
    id: 'agent-builder',
    title: 'Agent Builder',
    icon: Bot,
    color: '#00FFFF',
    desc: 'Create custom autonomous agents with specific skills, personalities, and goals.',
    stats: { capacity: 'Unlimited', autonomy: 'Full' },
    features: ['Multi-Skill', 'Personality', 'Goal Oriented', 'Auto-Deploy'],
    link: '/agent-creator'
  },
  {
    id: 'x1-predict',
    title: 'X1 Predict',
    icon: TrendingUp,
    color: '#FFA500',
    desc: 'Global forecasting engine for markets, social trends, and business outcomes.',
    stats: { accuracy: '94.2%', range: 'Global' },
    features: ['Market Trends', 'Social Sentiment', 'Risk Analysis', 'Consensus'],
    link: '/predict'
  },
  {
    id: 'simulation',
    title: 'Simulation Engine',
    icon: BarChart2,
    color: '#FF3333',
    desc: 'Run Monte Carlo simulations to foresee business outcomes across multiple timelines.',
    stats: { scenarios: 'Infinite', clarity: '100%' },
    features: ['Optimistic', 'Realistic', 'Pessimistic', 'Decision Markers'],
    link: '/simulate'
  }
];

const AdminTechnologyOverview = () => {
  return (
    <div className="space-y-12 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Technology Architecture</h1>
          <p className="text-white/50">Internal system breakdown and performance metrics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">Export Docs</Button>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SYSTEM_MODULES.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <div
                  key={mod.id}
                  className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-[#39FF14]/50 transition-all duration-500 group relative overflow-hidden flex flex-col h-full bg-[#050505]/40"
              >
                  <div className="mb-6 flex justify-between items-start relative z-10">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-[#39FF14] group-hover:text-black transition-colors duration-300">
                        <Icon size={32} style={{ color: mod.color }} className="group-hover:text-black transition-colors" />
                    </div>
                    <div className="text-right">
                        {Object.entries(mod.stats).map(([k, v], j) => (
                          <div key={j} className="text-xs font-mono text-white/40 uppercase mb-1">
                              {k}: <span className="text-[#39FF14] font-bold">{v}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{mod.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 relative z-10 flex-1">{mod.desc}</p>

                  <div className="space-y-2 mb-8 relative z-10">
                    {mod.features.map(feat => (
                        <div key={feat} className="flex items-center gap-2 text-xs text-white/50">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" />
                          {feat}
                        </div>
                    ))}
                  </div>

                  <Link to={mod.link} className="relative z-10 mt-auto">
                    <Button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-wider group-hover:border-[#39FF14]/50 group-hover:text-[#39FF14]">
                        Admin Access <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
              </div>
            );
        })}
      </div>

      {/* Comparison Chart */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-bold text-white">Efficiency Analysis: Gen-3 vs Gen-4</h3>
          </div>
          {/* Header Row */}
          <div className="grid grid-cols-4 border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest text-white/60 sticky top-0 backdrop-blur-md z-20">
            <div className="p-6">Workflow Stage</div>
            <div className="p-6 border-l border-white/10">Traditional</div>
            <div className="p-6 border-l border-white/10">Current AI (LLMs)</div>
            <div className="p-6 border-l border-white/10 bg-[#39FF14]/10 text-[#39FF14] flex items-center justify-between">
                Infinity X AI
                <Sparkles size={14} className="animate-pulse" />
            </div>
          </div>

          {/* Rows */}
          {COMPARISON_DATA.map((row, i) => (
            <div key={i} className="grid grid-cols-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                <div className="p-6 flex flex-col justify-center border-r border-white/5">
                  <h4 className="font-bold text-white text-lg mb-1">{row.stage}</h4>
                </div>
                
                {/* Traditional */}
                <div className="p-6 border-r border-white/5 text-white/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                      <Clock size={12} /> {row.traditional.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                      <AlertTriangle size={12} /> {row.traditional.friction} Friction
                  </div>
                  <p className="text-xs italic opacity-70">{row.traditional.desc}</p>
                </div>

                {/* Current AI */}
                <div className="p-6 border-r border-white/5 text-white/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-yellow-400">
                      <Clock size={12} /> {row.currentAI.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-yellow-400">
                      <Activity size={12} /> {row.currentAI.friction} Friction
                  </div>
                  <p className="text-xs italic opacity-70">{row.currentAI.desc}</p>
                </div>

                {/* Infinity X */}
                <div className="p-6 bg-[#39FF14]/5 text-white space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#39FF14]" />
                  <div className="flex items-center gap-2 text-xs font-bold text-[#39FF14]">
                      <Zap size={12} /> {row.infinityX.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#39FF14]">
                      <CheckCircle2 size={12} /> {row.infinityX.friction} Friction
                  </div>
                  <p className="text-xs font-medium text-white/90">{row.infinityX.desc}</p>
                </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminTechnologyOverview;
