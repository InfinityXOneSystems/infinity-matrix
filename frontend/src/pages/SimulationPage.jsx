
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BarChart2, TrendingUp, AlertTriangle, Target, 
  Play, Download, RefreshCw, 
  Activity, Shield, PieChart, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import ChatWidget from '@/components/ChatWidget';
import ScenarioChart from '@/components/simulation/ScenarioChart';
import BackgroundEnergy from '@/components/BackgroundEnergy';
import TriangleLogo from '@/components/ui/TriangleLogo';
import { cn } from '@/lib/utils';

const SimulationPage = () => {
  const { toast } = useToast();
  
  // Inputs
  const [businessName, setBusinessName] = useState('');
  const [investment, setInvestment] = useState(50000);
  const [marketCondition, setMarketCondition] = useState('Stable');
  
  // State
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState(null);

  const runSimulation = () => {
    if (!businessName) {
      toast({ title: "Input Required", description: "Please enter a business name.", variant: "destructive" });
      return;
    }

    setIsSimulating(true);
    toast({ title: "Simulation Initiated", description: "Crunching numbers across 3 timelines...", className: "bg-[#0066FF] text-white border-none" });

    setTimeout(() => {
      // Mock Data Generation
      const baseGrowth = marketCondition === 'Booming' ? 1.4 : marketCondition === 'Stable' ? 1.15 : 0.95;
      const initialRev = investment * 0.8; 

      const generateTrend = (multiplier) => {
        let current = initialRev;
        const trend = [];
        for (let i = 0; i < 5; i++) {
          current = current * (baseGrowth * multiplier) * (1 + (Math.random() * 0.1 - 0.05));
          trend.push(Math.round(current));
        }
        return trend;
      };

      setResults({
        scenarios: {
          optimistic: generateTrend(1.2),
          realistic: generateTrend(1.0),
          pessimistic: generateTrend(0.8)
        },
        metrics: {
          roi: Math.floor(Math.random() * 150) + 20,
          breakEvenYear: Math.floor(Math.random() * 3) + 1,
          riskScore: Math.floor(Math.random() * 100),
          marketShare: (Math.random() * 5).toFixed(1)
        },
        analysis: {
          market: "High saturation in entry-level tier, but blue ocean opportunity in enterprise segment.",
          competitor: "3 Main competitors hold 60% share. Aggressive pricing strategy recommended.",
          risk: "Supply chain volatility is the primary risk factor given current global conditions."
        }
      });
      setIsSimulating(false);
      toast({ title: "Simulation Complete", description: "Analysis ready for review." });
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Simulate | Infinity X</title>
      </Helmet>

      {/* Full Screen Layout Wrapper */}
      <div className="relative w-full h-[100dvh] flex flex-col bg-[#02040a] overflow-hidden">
        <BackgroundEnergy />

        {/* Custom Header */}
        <div className="relative z-20 h-16 border-b border-white/10 bg-[#020410]/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors">
              <Home size={18} />
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-2">
               <TriangleLogo className="text-[#0066FF]" size={20} />
               <span className="font-bold text-white tracking-wider">SIMULATE</span>
            </div>
          </div>
          
          <div className="flex gap-2">
             <Button variant="ghost" size="sm" className="text-white/40 hover:text-white" onClick={() => { setResults(null); setBusinessName(''); }}>
                <RefreshCw size={14} className="mr-2" /> Reset
             </Button>
          </div>
        </div>

        {/* Content Body */}
        <div className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Main Workspace */}
          <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-4 lg:p-6 gap-6">
             
             {/* Input Panel */}
             <div className="glass-panel p-6 rounded-2xl border border-[#C0C0C0] bg-black/40 backdrop-blur-md shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div>
                      <label className="text-xs text-white/40 mb-1.5 block font-bold uppercase">Business / Project Name</label>
                      <Input 
                         placeholder="e.g. NeoCafe Solutions" 
                         value={businessName}
                         onChange={(e) => setBusinessName(e.target.value)}
                         className="bg-black/40 text-white border-white/10 focus:border-[#0066FF]"
                      />
                   </div>
                   <div>
                      <label className="text-xs text-white/40 mb-1.5 block font-bold uppercase">Initial Investment ($)</label>
                      <Input 
                         type="number"
                         value={investment}
                         onChange={(e) => setInvestment(e.target.value)}
                         className="bg-black/40 text-white border-white/10 focus:border-[#0066FF]"
                      />
                   </div>
                   <div>
                      <label className="text-xs text-white/40 mb-1.5 block font-bold uppercase">Market Condition</label>
                      <select 
                         className="w-full h-10 rounded-md bg-black/40 border border-white/10 text-white px-3 text-sm focus:border-[#0066FF] outline-none"
                         value={marketCondition}
                         onChange={(e) => setMarketCondition(e.target.value)}
                      >
                         <option>Booming</option>
                         <option>Stable</option>
                         <option>Recession</option>
                         <option>Volatile</option>
                      </select>
                   </div>
                   <div className="flex items-end">
                      <Button 
                         onClick={runSimulation}
                         disabled={isSimulating}
                         className="w-full bg-[#0066FF] text-white hover:bg-[#0055DD] font-bold shadow-[0_0_15px_rgba(0,102,255,0.4)]"
                      >
                         {isSimulating ? 'Simulating...' : 'Run Simulation'} <Play size={16} className="ml-2" />
                      </Button>
                   </div>
                </div>
             </div>

             {/* Results Area */}
             <AnimatePresence>
               {results ? (
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="flex-1 flex flex-col gap-6"
                  >
                     {/* Top Metrics */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="glass-panel p-4 rounded-xl border border-[#C0C0C0] bg-black/40 backdrop-blur-md">
                           <div className="text-xs text-white/40 uppercase font-bold mb-1">Proj. ROI (5yr)</div>
                           <div className="text-2xl font-mono font-bold text-[#39FF14]">{results.metrics.roi}%</div>
                        </div>
                        <div className="glass-panel p-4 rounded-xl border border-[#C0C0C0] bg-black/40 backdrop-blur-md">
                           <div className="text-xs text-white/40 uppercase font-bold mb-1">Break-Even</div>
                           <div className="text-2xl font-mono font-bold text-white">Year {results.metrics.breakEvenYear}</div>
                        </div>
                        <div className="glass-panel p-4 rounded-xl border border-[#C0C0C0] bg-black/40 backdrop-blur-md">
                           <div className="text-xs text-white/40 uppercase font-bold mb-1">Risk Score</div>
                           <div className={`text-2xl font-mono font-bold ${results.metrics.riskScore > 50 ? 'text-red-500' : 'text-[#0066FF]'}`}>
                              {results.metrics.riskScore}/100
                           </div>
                        </div>
                        <div className="glass-panel p-4 rounded-xl border border-[#C0C0C0] bg-black/40 backdrop-blur-md">
                           <div className="text-xs text-white/40 uppercase font-bold mb-1">Proj. Market Share</div>
                           <div className="text-2xl font-mono font-bold text-white">{results.metrics.marketShare}%</div>
                        </div>
                     </div>

                     {/* Main Chart Section */}
                     <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-[350px]">
                        
                        {/* Chart */}
                        <div className="xl:col-span-2 glass-panel p-6 rounded-2xl border border-[#C0C0C0] bg-black/40 backdrop-blur-md flex flex-col">
                           <div className="flex justify-between items-center mb-6">
                              <h3 className="font-bold text-white flex items-center gap-2">
                                 <TrendingUp size={18} className="text-[#39FF14]" /> Revenue Projections (5 Years)
                              </h3>
                              <div className="flex gap-2">
                                 <span className="text-[10px] text-[#39FF14] flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#39FF14]"/> Optimistic</span>
                                 <span className="text-[10px] text-[#0066FF] flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#0066FF]"/> Realistic</span>
                                 <span className="text-[10px] text-red-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/> Pessimistic</span>
                              </div>
                           </div>
                           <div className="flex-1 w-full min-h-[250px] pb-6">
                              <ScenarioChart scenarios={results.scenarios} />
                           </div>
                        </div>

                        {/* Analysis Text */}
                        <div className="glass-panel p-6 rounded-2xl border border-[#C0C0C0] bg-black/40 backdrop-blur-md flex flex-col gap-6 overflow-y-auto">
                           <div>
                              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                 <PieChart size={14} className="text-[#0066FF]" /> Market Analysis
                              </h4>
                              <p className="text-xs text-white/70 leading-relaxed border-l-2 border-[#0066FF] pl-3">
                                 {results.analysis.market}
                              </p>
                           </div>
                           <div>
                              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                 <Target size={14} className="text-[#39FF14]" /> Competitor Landscape
                              </h4>
                              <p className="text-xs text-white/70 leading-relaxed border-l-2 border-[#39FF14] pl-3">
                                 {results.analysis.competitor}
                              </p>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                     <div className="p-6 rounded-full bg-white/5 mb-4 border border-white/10">
                        <BarChart2 size={48} className="text-white" />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">Ready to Simulate</h3>
                     <p className="max-w-md text-sm">Enter your business parameters above and launch the simulation engine to generate financial timelines.</p>
                  </div>
               )}
             </AnimatePresence>
          </div>

          {/* Right Sidebar - Chat */}
          <div className="w-full lg:w-[350px] border-l border-white/10 bg-black/60 backdrop-blur-xl h-[50vh] lg:h-full shrink-0 relative flex flex-col">
             <ChatWidget 
                mode="sidebar" 
                title="Business Strategist" 
                subtitle="Simulation AI"
                initialMessages={[
                  { id: '1', role: 'system', content: 'Simulation Engine Online. I can help interpret financial models and suggest risk mitigation strategies.' }
                ]}
             />
          </div>

        </div>
      </div>
    </>
  );
};

export default SimulationPage;
