
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, Activity, 
  BarChart2, Target, Zap, 
  Wallet, Search, ArrowLeft, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import ChatWidget from '@/components/ChatWidget';
import PredictionChart from '@/components/prediction/PredictionChart';
import BackgroundEnergy from '@/components/BackgroundEnergy';
import TriangleLogo from '@/components/ui/TriangleLogo';
import { cn } from '@/lib/utils';

// --- Components ---
const PredictionCard = ({ symbol, prediction, confidence, onPredict }) => (
  <div className="glass-panel p-6 rounded-xl border border-[#C0C0C0] relative overflow-hidden bg-black/40 backdrop-blur-md">
    <div className="absolute top-0 right-0 p-12 bg-gradient-to-bl from-[#39FF14]/10 to-transparent rounded-bl-full" />
    
    <div className="relative z-10">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
         <Target className="text-[#39FF14]" size={20} /> AI Forecast
      </h3>
      
      {prediction ? (
        <div className="space-y-4">
           <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-full border flex items-center justify-center",
                prediction === 'BULLISH' ? "bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14]" : "bg-red-500/20 border-red-500 text-red-500"
              )}>
                 {prediction === 'BULLISH' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
              </div>
              <div>
                 <div className="text-2xl font-bold text-white">{prediction}</div>
                 <div className="text-sm text-white/60">Target: {prediction === 'BULLISH' ? '+4.2%' : '-2.8%'} (24h)</div>
              </div>
           </div>
           
           <div>
              <div className="flex justify-between text-xs text-white/40 mb-1">
                 <span>Confidence Score</span>
                 <span>{confidence}%</span>
              </div>
              <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${confidence}%` }} 
                   className={cn("h-full", confidence > 75 ? "bg-[#39FF14]" : "bg-yellow-500")}
                 />
              </div>
           </div>
        </div>
      ) : (
        <div className="text-center py-8">
           <p className="text-white/40 text-sm mb-4">Run neural analysis on {symbol} to generate predictive signals.</p>
           <Button onClick={onPredict} className="w-full bg-[#39FF14] text-black font-bold hover:bg-[#32cc12]">
              <Zap size={16} className="mr-2" /> Generate Signal
           </Button>
        </div>
      )}
    </div>
  </div>
);

const PredictPage = () => {
  const { toast } = useToast();
  const [activeSymbol, setActiveSymbol] = useState('BTC');
  const [price, setPrice] = useState(42500);
  const [history, setHistory] = useState([42100, 42250, 42180, 42300, 42420, 42380, 42500]);
  const [prediction, setPrediction] = useState(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [orderAmount, setOrderAmount] = useState('');
  
  // Paper Trading State
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem('predict_portfolio');
    return saved ? JSON.parse(saved) : { cash: 100000, holdings: {}, history: [] };
  });

  useEffect(() => {
    localStorage.setItem('predict_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  // Price Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prev => {
        const change = (Math.random() - 0.5) * (prev * 0.002);
        const newPrice = prev + change;
        setHistory(h => [...h.slice(-19), newPrice]);
        return newPrice;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePredict = () => {
    setIsAnalysing(true);
    setTimeout(() => {
       const isBullish = Math.random() > 0.4;
       setPrediction({
         direction: isBullish ? 'BULLISH' : 'BEARISH',
         confidence: Math.floor(Math.random() * 20) + 75
       });
       setIsAnalysing(false);
       toast({
         title: "Prediction Generated",
         description: `AI Confidence: ${Math.floor(Math.random() * 20) + 75}%`,
         className: "border-[#39FF14] text-white bg-black"
       });
    }, 2000);
  };

  const executeOrder = (type) => {
    if (!orderAmount || isNaN(orderAmount) || orderAmount <= 0) return;
    const amount = parseFloat(orderAmount);
    const totalCost = amount * price;

    if (type === 'BUY') {
       if (totalCost > portfolio.cash) {
         toast({ title: "Insufficient Funds", variant: "destructive" });
         return;
       }
       setPortfolio(prev => ({
         ...prev,
         cash: prev.cash - totalCost,
         holdings: {
           ...prev.holdings,
           [activeSymbol]: (prev.holdings[activeSymbol] || 0) + amount
         },
         history: [{ type: 'BUY', symbol: activeSymbol, amount, price, time: new Date().toISOString() }, ...prev.history]
       }));
       toast({ title: "Order Filled", description: `Bought ${amount} ${activeSymbol} @ $${price.toFixed(2)}` });
    } else {
       if (!portfolio.holdings[activeSymbol] || portfolio.holdings[activeSymbol] < amount) {
         toast({ title: "Insufficient Holdings", variant: "destructive" });
         return;
       }
       setPortfolio(prev => ({
         ...prev,
         cash: prev.cash + totalCost,
         holdings: {
           ...prev.holdings,
           [activeSymbol]: prev.holdings[activeSymbol] - amount
         },
         history: [{ type: 'SELL', symbol: activeSymbol, amount, price, time: new Date().toISOString() }, ...prev.history]
       }));
       toast({ title: "Order Filled", description: `Sold ${amount} ${activeSymbol} @ $${price.toFixed(2)}` });
    }
    setOrderAmount('');
  };

  const equity = portfolio.cash + Object.entries(portfolio.holdings).reduce((acc, [sym, qty]) => {
     const currentP = sym === activeSymbol ? price : 0; 
     return acc + (qty * currentP);
  }, 0);

  const pnl = equity - 100000;

  return (
    <>
      <Helmet><title>Predict | Infinity X</title></Helmet>
      
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
               <TriangleLogo className="text-[#39FF14]" size={20} />
               <span className="font-bold text-white tracking-wider">PREDICT</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-4 items-center bg-white/5 px-4 py-1.5 rounded-lg border border-white/10">
               <div className="text-right">
                  <div className="text-[9px] text-white/40 uppercase font-bold">Virtual Equity</div>
                  <div className="text-sm font-mono font-bold text-white">${equity.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
               </div>
               <div className="text-right border-l border-white/10 pl-4">
                  <div className="text-[9px] text-white/40 uppercase font-bold">P&L</div>
                  <div className={cn("text-sm font-mono font-bold", pnl >= 0 ? "text-[#39FF14]" : "text-red-500")}>
                     {pnl >= 0 ? '+' : ''}{pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
               </div>
            </div>
          </div>
        </div>
        
        {/* Content Body */}
        <div className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Main Workspace - Left Side */}
          <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-4 lg:p-6 gap-6">
             
             {/* Search & Ticker */}
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                <div className="flex items-center gap-4 w-full">
                   <div className="relative group w-full max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                      <Input 
                         placeholder="Search Symbol (BTC, ETH, SPY)..." 
                         className="pl-10 bg-black/40 border-[#C0C0C0] text-white focus:border-[#39FF14] h-10 rounded-lg backdrop-blur-sm"
                         value={activeSymbol}
                         onChange={(e) => { setActiveSymbol(e.target.value.toUpperCase()); setPrediction(null); }}
                      />
                   </div>
                   <div className="flex gap-2">
                      {['BTC', 'ETH', 'SOL'].map(s => (
                         <button 
                           key={s} 
                           onClick={() => { setActiveSymbol(s); setPrediction(null); }}
                           className={cn(
                             "px-3 py-1.5 text-xs font-bold rounded border transition-colors backdrop-blur-sm",
                             activeSymbol === s ? "bg-[#39FF14] text-black border-[#39FF14]" : "text-white/60 border-white/10 hover:border-white/40 bg-black/40"
                           )}
                         >
                            {s}
                         </button>
                      ))}
                   </div>
                </div>
             </div>
  
             {/* Market Overview */}
             <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 shrink-0">
                <div className="xl:col-span-2 glass-panel p-6 rounded-2xl border border-[#C0C0C0] bg-black/40 backdrop-blur-md">
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                            {activeSymbol} <span className="text-lg text-white/40 font-normal">USD</span>
                         </h1>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="text-2xl font-mono text-[#39FF14]">${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span className="text-xs px-2 py-0.5 bg-[#39FF14]/10 text-[#39FF14] rounded border border-[#39FF14]/20">+1.24%</span>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         {['1H', '1D', '1W', '1M', '1Y'].map(t => (
                            <button key={t} className="px-2 py-1 text-[10px] text-white/40 hover:text-white hover:bg-white/10 rounded">{t}</button>
                         ))}
                      </div>
                   </div>
                   <PredictionChart data={history} height={250} />
                </div>
  
                <div className="space-y-6">
                   <PredictionCard 
                      symbol={activeSymbol} 
                      prediction={isAnalysing ? null : prediction?.direction}
                      confidence={prediction?.confidence}
                      onPredict={handlePredict}
                   />
                   
                   <div className="glass-panel p-6 rounded-xl border border-[#C0C0C0] bg-black/40 backdrop-blur-md">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
                         <Activity size={16} className="text-[#0066FF]" /> Market Vitals
                      </h3>
                      <div className="space-y-3">
                         <div className="flex justify-between text-sm">
                            <span className="text-white/40">24h Vol</span>
                            <span className="text-white">$42.1B</span>
                         </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-white/40">Dominance</span>
                            <span className="text-white">52.4%</span>
                         </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-white/40">RSI (14)</span>
                            <span className="text-[#39FF14]">62.4</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
  
             {/* Trading & Portfolio */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                {/* Paper Trading */}
                <div className="glass-panel p-6 rounded-2xl border border-[#C0C0C0] bg-black/40 backdrop-blur-md flex flex-col">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-white flex items-center gap-2">
                         <Wallet size={18} className="text-[#39FF14]" /> Paper Trading
                      </h3>
                   </div>
  
                   <div className="flex-1 flex flex-col gap-4">
                      <div className="flex gap-2 p-1 bg-black/40 rounded-lg border border-white/10">
                         <button className="flex-1 py-2 text-sm font-bold bg-[#39FF14] text-black rounded shadow-lg">Buy</button>
                         <button className="flex-1 py-2 text-sm font-bold text-white/40 hover:text-white">Sell</button>
                      </div>
                      
                      <div className="space-y-4 py-4">
                         <div>
                            <label className="text-xs text-white/40 mb-1 block">Order Type</label>
                            <select className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-white text-sm outline-none">
                               <option>Market</option>
                               <option>Limit</option>
                            </select>
                         </div>
                         <div>
                            <label className="text-xs text-white/40 mb-1 block">Amount ({activeSymbol})</label>
                            <Input 
                               type="number" 
                               placeholder="0.00" 
                               value={orderAmount}
                               onChange={(e) => setOrderAmount(e.target.value)}
                               className="bg-black/40 border-white/10 text-white" 
                            />
                         </div>
                      </div>
  
                      <Button onClick={() => executeOrder('BUY')} className="w-full mt-auto bg-[#39FF14] text-black font-bold hover:bg-[#32cc12]">
                         Place Buy Order
                      </Button>
                   </div>
                </div>
  
                {/* Positions */}
                <div className="glass-panel p-6 rounded-2xl border border-[#C0C0C0] bg-black/40 backdrop-blur-md flex flex-col overflow-hidden min-h-[300px]">
                   <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                      <BarChart2 size={18} className="text-[#0066FF]" /> Positions
                   </h3>
                   
                   <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {Object.keys(portfolio.holdings).length === 0 ? (
                         <div className="h-full flex flex-col items-center justify-center text-white/20">
                            <Search size={32} className="mb-2" />
                            <p className="text-sm">No active positions</p>
                         </div>
                      ) : (
                         <table className="w-full text-sm">
                            <thead>
                               <tr className="text-white/40 text-left border-b border-white/10">
                                  <th className="pb-2 font-normal">Asset</th>
                                  <th className="pb-2 font-normal text-right">Qty</th>
                                  <th className="pb-2 font-normal text-right">Value</th>
                               </tr>
                            </thead>
                            <tbody>
                               {Object.entries(portfolio.holdings).map(([sym, qty]) => (
                                  <tr key={sym} className="border-b border-white/5 last:border-0">
                                     <td className="py-3 text-white font-bold">{sym}</td>
                                     <td className="py-3 text-white/80 text-right">{qty}</td>
                                     <td className="py-3 text-[#39FF14] text-right font-mono">
                                        ${(qty * (sym === activeSymbol ? price : price * 0.9)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                     </td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      )}
                   </div>
                </div>
             </div>
  
          </div>
  
          {/* Right Sidebar - Chat Interface */}
          <div className="w-full lg:w-[350px] border-l border-white/10 bg-black/60 backdrop-blur-xl h-[50vh] lg:h-full shrink-0 relative flex flex-col">
             <ChatWidget 
                mode="sidebar" 
                title="Predictive Agent"
                subtitle="Market Analyst"
                initialMessages={[
                  { id: '1', role: 'system', content: 'Prediction Engine v2.1 Online. I can analyze market sentiment, technical indicators, and on-chain metrics for you.' }
                ]}
             />
          </div>
  
        </div>
      </div>
    </>
  );
};

export default PredictPage;
