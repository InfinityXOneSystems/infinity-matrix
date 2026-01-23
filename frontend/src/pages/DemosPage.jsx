
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Activity, Users, Mic, Calendar, 
  Mail, CreditCard, Share2, Play, CheckCircle, 
  ArrowRight, Zap, Target, Search, BarChart2,
  Bot, Clock, Shield, Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import PredictionChart from '@/components/prediction/PredictionChart';
import ScenarioChart from '@/components/simulation/ScenarioChart';

// --- Demo Sub-Components ---

const PredictionDemo = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([42000, 42100, 42050, 42200, 42150, 42300, 42250]);

  const runPrediction = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        signal: 'STRONG BUY',
        confidence: '94.2%',
        target: '$44,500',
        timeframe: '24h'
      });
      setChartData(prev => [...prev, 42400, 42600, 42550, 42800]);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input placeholder="Enter Symbol (e.g., BTC, TSLA)" className="bg-black/40 border-white/10 text-white focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]" defaultValue="BTC" />
        <Button onClick={runPrediction} disabled={analyzing} className="bg-[#39FF14] text-black hover:bg-[#32cc12] font-bold shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-all">
          {analyzing ? <Activity className="animate-spin" /> : <Zap size={18} className="mr-2" />}
          Analyze
        </Button>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-white/10 bg-black/40 min-h-[300px] flex flex-col justify-center relative overflow-hidden">
        {analyzing ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(57,255,20,0.2)]" />
            <p className="text-[#39FF14] font-mono animate-pulse text-glow-green">Running Neural Inference...</p>
          </div>
        ) : result ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                  {result.signal} <span className="text-sm bg-[#39FF14]/20 text-[#39FF14] px-2 py-1 rounded border border-[#39FF14]/30 shadow-[0_0_10px_rgba(57,255,20,0.1)]">{result.confidence} Conf.</span>
                </h3>
                <p className="text-white/60 mt-1">Target: {result.target} within {result.timeframe}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/40 uppercase font-bold">Model</div>
                <div className="text-[#0066FF] font-bold drop-shadow-[0_0_8px_rgba(0,102,255,0.6)]">Vision-Cortex v4</div>
              </div>
            </div>
            <div className="h-48 w-full">
              <PredictionChart data={chartData} color="#39FF14" height={192} />
            </div>
          </div>
        ) : (
          <div className="text-center text-white/30">
            <Target size={48} className="mx-auto mb-4 opacity-50" />
            <p>Enter a symbol above to generate live AI predictions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const LeadGenDemo = () => {
  const [leads, setLeads] = useState([]);
  const [searching, setSearching] = useState(false);

  const findLeads = () => {
    setSearching(true);
    setLeads([]);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      const newLead = {
        id: count,
        name: ['TechCorp Inc.', 'Nexus Solutions', 'Global Ventures', 'Alpha Dynamics'][count % 4],
        contact: ['ceo@techcorp.com', 'info@nexus.io', 'sales@global.com', 'admin@alpha.dy'][count % 4],
        score: Math.floor(Math.random() * 30) + 70
      };
      setLeads(prev => [newLead, ...prev]);
      if (count >= 4) {
        clearInterval(interval);
        setSearching(false);
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input placeholder="Industry / Keywords" className="bg-black/40 border-white/10 text-white" defaultValue="SaaS Startups" />
        <Button onClick={findLeads} disabled={searching} className="bg-[#0066FF] text-white hover:bg-[#0055EE] shadow-[0_0_15px_rgba(0,102,255,0.3)] hover:shadow-[0_0_20px_rgba(0,102,255,0.5)] transition-all">
          {searching ? 'Scraping...' : 'Find Leads'}
        </Button>
      </div>

      <div className="glass-panel rounded-xl border border-white/10 bg-black/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/40 uppercase text-xs font-bold">
            <tr>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Contact</th>
              <th className="p-4 text-right">Lead Score</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && !searching && (
              <tr><td colSpan="4" className="p-8 text-center text-white/30">No leads found yet. Start a search.</td></tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-white/5 animate-in slide-in-from-left-4 fade-in">
                <td className="p-4 font-bold text-white">{lead.name}</td>
                <td className="p-4 text-white/70 font-mono text-xs">{lead.contact}</td>
                <td className="p-4 text-right">
                  <span className="text-[#39FF14] font-bold text-shadow-glow">{lead.score}%</span>
                </td>
                <td className="p-4 text-right">
                  <Button size="sm" variant="outline" className="h-7 text-xs border-white/10 hover:bg-[#39FF14] hover:text-black hover:border-[#39FF14] transition-colors">Email</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const VoiceDemo = () => {
  const [status, setStatus] = useState('idle');
  const [transcript, setTranscript] = useState('');

  const toggleVoice = () => {
    if (status === 'idle') {
      setStatus('listening');
      setTranscript('');
      setTimeout(() => {
        setStatus('processing');
        setTimeout(() => {
          setTranscript("Schedule a meeting with the engineering team for tomorrow at 2 PM.");
          setStatus('speaking');
          setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      <div className="relative">
        <motion.button
          onClick={toggleVoice}
          animate={status === 'listening' ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] border-2 backdrop-blur-md",
            status === 'idle' ? "bg-white/5 border-white/20 text-white hover:border-[#39FF14] hover:text-[#39FF14] hover:shadow-[0_0_20px_rgba(57,255,20,0.2)]" :
            status === 'listening' ? "bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_40px_rgba(255,0,0,0.4)]" :
            status === 'processing' ? "bg-blue-500/10 border-blue-500 text-blue-500 animate-pulse shadow-[0_0_40px_rgba(0,102,255,0.4)]" :
            "bg-[#39FF14]/10 border-[#39FF14] text-[#39FF14] shadow-[0_0_40px_rgba(57,255,20,0.4)]"
          )}
        >
          <Mic size={40} />
        </motion.button>
        {status === 'speaking' && (
           <motion.div 
             className="absolute -inset-4 border border-[#39FF14] rounded-full opacity-50"
             animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
             transition={{ repeat: Infinity, duration: 1 }}
           />
        )}
      </div>

      <div className="text-center h-20">
        <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
          {status === 'idle' ? 'Tap to Speak' : status}
        </p>
        {transcript && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-lg font-medium max-w-md mx-auto leading-relaxed text-glow"
          >
            "{transcript}"
          </motion.div>
        )}
      </div>
    </div>
  );
};

const SocialDemo = () => {
  const [posts, setPosts] = useState([]);
  const [generating, setGenerating] = useState(false);

  const generatePost = () => {
    setGenerating(true);
    setTimeout(() => {
      setPosts(prev => [{
        id: Date.now(),
        content: "🚀 Just deployed our new neural architecture! System efficiency up by 45%. #AI #Tech #Innovation",
        likes: 0,
        shares: 0,
        time: "Just now"
      }, ...prev]);
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {['Twitter', 'LinkedIn', 'Instagram'].map(p => (
            <div key={p} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 transition-colors cursor-pointer">{p}</div>
          ))}
        </div>
        <Button onClick={generatePost} disabled={generating} className="bg-[#0066FF] text-white hover:bg-[#0055EE] shadow-[0_0_15px_rgba(0,102,255,0.3)]">
          {generating ? 'Generating...' : 'Auto-Generate Content'}
        </Button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {posts.length === 0 && <div className="text-center py-10 text-white/30">No posts generated yet.</div>}
        {posts.map(post => (
          <div key={post.id} className="glass-panel p-4 rounded-xl border border-white/10 bg-black/40 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0066FF] to-[#39FF14]" />
              <div>
                <div className="font-bold text-white text-sm">Infinity Bot</div>
                <div className="text-[10px] text-white/40">{post.time}</div>
              </div>
            </div>
            <p className="text-white/80 text-sm mb-4">{post.content}</p>
            <div className="flex gap-4 border-t border-white/10 pt-3">
              <button className="text-xs text-white/40 flex items-center gap-1 hover:text-[#39FF14] transition-colors"><Activity size={12} /> Boost</button>
              <button className="text-xs text-white/40 flex items-center gap-1 hover:text-[#0066FF] transition-colors"><Share2 size={12} /> Share</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Page Component ---

const DemosPage = () => {
  const [activeTab, setActiveTab] = useState('prediction');
  const { toast } = useToast();

  const demos = [
    { id: 'prediction', label: 'Prediction Engine', icon: TrendingUp, comp: <PredictionDemo />, desc: "Real-time market forecasting using LSTM neural networks." },
    { id: 'lead_gen', label: 'Lead Generation', icon: Users, comp: <LeadGenDemo />, desc: "Autonomous web scraping and lead qualification." },
    { id: 'voice', label: 'Voice Assistant', icon: Mic, comp: <VoiceDemo />, desc: "Natural language processing with real-time audio synthesis." },
    { id: 'social', label: 'Social Auto-Pilot', icon: Share2, comp: <SocialDemo />, desc: "Content generation and scheduling across platforms." },
    { id: 'paper_trading', label: 'Paper Trading', icon: Activity, comp: <div className="text-center p-10 text-white/40">Interactive Trading Interface Available in Full Dashboard</div>, desc: "Risk-free strategy testing environment." },
    { id: 'simulation', label: 'Simulation Engine', icon: BarChart2, comp: <div className="h-64"><ScenarioChart scenarios={{optimistic:[10,30,50], realistic:[10,20,30], pessimistic:[10,15,20]}} height={256} /></div>, desc: "Monte Carlo simulations for business outcomes." },
  ];

  const activeDemo = demos.find(d => d.id === activeTab);

  return (
    <>
      <Helmet>
        <title>Live Demos | Infinity X</title>
      </Helmet>

      {/* REMOVED OPAQUE BG - Now uses transparent background to show global energy */}
      <div className="min-h-screen bg-transparent pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              System <span className="text-[#39FF14] text-glow-green">Showcase</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Experience the power of autonomous intelligence. Select a module below to launch a live interactive demonstration.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-2">
              {demos.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => setActiveTab(demo.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all border text-left",
                    activeTab === demo.id 
                      ? "bg-[#39FF14]/10 border-[#39FF14] text-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.2)]" 
                      : "bg-white/5 border-transparent text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <demo.icon size={20} />
                  <span className="font-medium text-sm">{demo.label}</span>
                  {activeTab === demo.id && <ArrowRight size={16} className="ml-auto" />}
                </button>
              ))}

              <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-[#0066FF]/20 to-purple-500/20 border border-[#0066FF]/30 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-2">Ready for the real thing?</h3>
                <p className="text-xs text-white/70 mb-4">Get full access to all 20+ modules in the dashboard.</p>
                <Button className="w-full bg-[#0066FF] hover:bg-[#0055EE] text-white border-none shadow-[0_0_15px_rgba(0,102,255,0.4)]">
                  Get Started
                </Button>
              </div>
            </div>

            {/* Main Demo Area */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-panel p-8 rounded-3xl border border-white/10 bg-black/40 min-h-[600px] flex flex-col relative overflow-hidden"
                >
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#39FF14]/5 blur-[100px] pointer-events-none" />

                  {/* Header */}
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <activeDemo.icon className="text-[#39FF14]" />
                        {activeDemo.label}
                      </h2>
                      <p className="text-white/50">{activeDemo.desc}</p>
                    </div>
                    <div className="flex gap-2">
                       <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(57,255,20,0.1)]">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          Live Demo
                       </div>
                    </div>
                  </div>

                  {/* Demo Content */}
                  <div className="flex-1 relative z-10 bg-black/20 rounded-xl border border-white/5 p-6 backdrop-blur-sm">
                    {activeDemo.comp}
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-8 flex justify-end gap-4 relative z-10">
                    <Button variant="ghost" onClick={() => toast({ title: "Documentation", description: "Opening API docs..." })} className="hover:text-[#39FF14]">
                       View API Docs
                    </Button>
                    <Button className="bg-[#39FF14] text-black hover:bg-[#32cc12] font-bold shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-shadow">
                       Deploy This System
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default DemosPage;
