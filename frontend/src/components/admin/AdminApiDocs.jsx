
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, Shield, Database, Lock, Code, 
  Terminal, FileJson, Play, Copy, Check,
  ChevronDown, ChevronRight, Activity, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import TriangleLogo from '@/components/ui/TriangleLogo'; // Import the updated logo

const Endpoint = ({ method, path, description, params, response, authRequired = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ description: "Endpoint copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const methodColors = {
    GET: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    POST: "text-green-400 bg-green-400/10 border-green-400/20",
    PUT: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    DELETE: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden mb-4 transition-all hover:border-white/20">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-4 overflow-hidden">
          <span className={cn("px-2.5 py-0.5 rounded text-xs font-bold border shrink-0 w-16 text-center", methodColors[method])}>
            {method}
          </span>
          <span className="font-mono text-sm text-white/80 truncate" title={path}>{path}</span>
          <span className="text-sm text-white/40 hidden md:inline-block">- {description}</span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {authRequired && <Lock size={14} className="text-white/30" title="Auth Required" />}
          {isOpen ? <ChevronDown size={16} className="text-white/40" /> : <ChevronRight size={16} className="text-white/40" />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10 bg-black/40"
          >
            <div className="p-4 space-y-6">
              <div className="flex justify-between items-start">
                 <p className="text-sm text-white/70">{description}</p>
                 <Button variant="ghost" size="sm" onClick={() => handleCopy(`${method} ${path}`)}>
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                 </Button>
              </div>

              {params && (
                <div>
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Parameters</h4>
                  <div className="bg-black/40 rounded border border-white/10 p-3 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-white/30 border-b border-white/10">
                          <th className="pb-2 font-normal">Name</th>
                          <th className="pb-2 font-normal">Type</th>
                          <th className="pb-2 font-normal">Required</th>
                          <th className="pb-2 font-normal">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {params.map((p, i) => (
                          <tr key={i} className="border-b border-white/5 last:border-0">
                            <td className="py-2 font-mono text-blue-300">{p.name}</td>
                            <td className="py-2 text-white/60">{p.type}</td>
                            <td className="py-2 text-white/60">{p.required ? 'Yes' : 'No'}</td>
                            <td className="py-2 text-white/60">{p.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Example Response</h4>
                <div className="relative">
                  <pre className="bg-[#0f0f12] p-4 rounded-lg border border-white/10 overflow-x-auto custom-scrollbar">
                    <code className="text-xs font-mono text-green-300/90 leading-relaxed">
                      {JSON.stringify(response, null, 2)}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminApiDocs = () => {
  const [activeSection, setActiveSection] = useState('prediction');
  
  const sections = [
    { id: 'prediction', label: 'Prediction Engine', icon: <Activity size={16} /> },
    { id: 'trading', label: 'Paper Trading', icon: <Zap size={16} /> },
    { id: 'simulation', label: 'Business Sim', icon: <Server size={16} /> },
    { id: 'analysis', label: 'Market Analysis', icon: <Database size={16} /> },
  ];

  const apiData = {
    prediction: [
      {
        method: "POST",
        path: "/api/v1/predict/generate",
        description: "Generate AI price prediction signal for a specific asset.",
        params: [
          { name: "symbol", type: "string", required: true, desc: "Asset ticker (e.g., BTC, ETH)" },
          { name: "timeframe", type: "string", required: false, desc: "1h, 4h, 1d, 1w (default: 1d)" },
          { name: "indicators", type: "array", required: false, desc: "List of technical indicators to include" }
        ],
        response: {
          success: true,
          data: {
            symbol: "BTC",
            signal: "BULLISH",
            confidence: 87.5,
            target_price: 45200.00,
            analysis: {
              rsi: 65.4,
              macd: "positive_divergence",
              sentiment: 0.82
            },
            timestamp: "2024-03-20T14:30:00Z"
          }
        }
      },
      {
        method: "GET",
        path: "/api/v1/predict/history/:symbol",
        description: "Retrieve historical prediction accuracy for an asset.",
        params: [
          { name: "symbol", type: "string", required: true, desc: "Asset ticker" },
          { name: "limit", type: "integer", required: false, desc: "Number of records (max 100)" }
        ],
        response: {
          success: true,
          data: [
            { date: "2024-03-19", predicted: 41000, actual: 41200, accuracy: 99.5 },
            { date: "2024-03-18", predicted: 40500, actual: 40100, accuracy: 99.0 }
          ]
        }
      }
    ],
    trading: [
      {
        method: "POST",
        path: "/api/v1/trading/order",
        description: "Execute a paper trade (buy/sell).",
        params: [
          { name: "symbol", type: "string", required: true, desc: "Asset ticker" },
          { name: "side", type: "string", required: true, desc: "BUY or SELL" },
          { name: "amount", type: "float", required: true, desc: "Quantity to trade" },
          { name: "type", type: "string", required: false, desc: "MARKET or LIMIT (default: MARKET)" }
        ],
        response: {
          success: true,
          orderId: "ord_88239102",
          status: "FILLED",
          details: {
            price: 42150.00,
            cost: 4215.00,
            fee: 4.21,
            executed_at: "2024-03-20T14:35:01Z"
          }
        }
      },
      {
        method: "GET",
        path: "/api/v1/trading/portfolio",
        description: "Get current portfolio holdings and balance.",
        params: [],
        response: {
          success: true,
          data: {
            cash_balance: 95400.50,
            equity: 104200.00,
            holdings: [
              { symbol: "BTC", quantity: 0.15, avg_price: 41000, current_price: 42150, pnl: 172.50 },
              { symbol: "ETH", quantity: 2.5, avg_price: 2200, current_price: 2250, pnl: 125.00 }
            ]
          }
        }
      }
    ],
    simulation: [
      {
        method: "POST",
        path: "/api/v1/simulation/run",
        description: "Run a full business simulation based on parameters.",
        params: [
          { name: "initial_investment", type: "float", required: true, desc: "Starting capital" },
          { name: "market_condition", type: "string", required: true, desc: "BOOMING, STABLE, RECESSION" },
          { name: "sector", type: "string", required: true, desc: "Industry sector ID" },
          { name: "timeline_years", type: "integer", required: false, desc: "Simulation duration (default: 5)" }
        ],
        response: {
          success: true,
          simulation_id: "sim_9912",
          scenarios: {
            optimistic: { roi: 150, revenue_trend: [100, 150, 250, 400, 600] },
            realistic: { roi: 45, revenue_trend: [100, 120, 150, 180, 220] },
            pessimistic: { roi: -10, revenue_trend: [100, 90, 85, 95, 105] }
          },
          risk_analysis: {
            score: 42,
            factors: ["High Volatility", "Regulatory Uncertainty"]
          }
        }
      },
      {
        method: "GET",
        path: "/api/v1/simulation/export/:id",
        description: "Export simulation results as JSON or PDF.",
        params: [
          { name: "id", type: "string", required: true, desc: "Simulation ID" },
          { name: "format", type: "string", required: false, desc: "json or pdf (default: json)" }
        ],
        response: {
          success: true,
          download_url: "https://api.infinityx.ai/exports/sim_9912.pdf",
          expires_in: 3600
        }
      }
    ],
    analysis: [
      {
        method: "GET",
        path: "/api/v1/analysis/market/:sector",
        description: "Get comprehensive market analysis for a sector.",
        params: [
          { name: "sector", type: "string", required: true, desc: "Sector Identifier" },
          { name: "depth", type: "string", required: false, desc: "FULL or SUMMARY" }
        ],
        response: {
          success: true,
          data: {
            sector: "Technology",
            trend: "UPTREND",
            sentiment_score: 0.75,
            key_competitors: ["CompA", "CompB", "CompC"],
            growth_rate_yoy: 12.5,
            opportunities: ["AI Integration", "Cloud Migration"]
          }
        }
      },
      {
        method: "POST",
        path: "/api/v1/analysis/competitor/compare",
        description: "Compare your business model against competitors.",
        params: [
          { name: "target_competitors", type: "array", required: true, desc: "List of competitor IDs or names" },
          { name: "metrics", type: "array", required: false, desc: "Specific metrics to compare" }
        ],
        response: {
          success: true,
          comparison: {
            market_share_gap: -15.2,
            pricing_strategy: "UNDERPRICED",
            feature_parity: 85
          }
        }
      }
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[#050505]">
      {/* Header */}
      <div className="p-6 border-b border-white/10 shrink-0">
         <div className="flex items-center gap-3 mb-2">
            <TriangleLogo size={24} className="flex-shrink-0" /> {/* Use the new logo */}
            <h2 className="text-2xl font-bold text-white ml-2">API Reference</h2> {/* Adjust margin to accommodate logo+text */}
         </div>
         <p className="text-white/60 text-sm max-w-3xl">
            Complete documentation for the Infinity X Intelligence Engine. All endpoints are prefixed with <span className="font-mono text-[#39FF14] bg-white/5 px-1 rounded">/api/v1</span>. 
            Authentication via Bearer Token required for all non-public routes.
         </p>
         
         <div className="flex gap-4 mt-4 text-xs font-mono text-white/40">
            <div className="flex items-center gap-2">
               <Shield size={12} className="text-[#39FF14]" /> Rate Limit: 100 req/min
            </div>
            <div className="flex items-center gap-2">
               <Lock size={12} className="text-[#39FF14]" /> Auth: Bearer JWT
            </div>
            <div className="flex items-center gap-2">
               <FileJson size={12} className="text-[#39FF14]" /> Format: JSON
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Navigation */}
        <div className="w-64 border-r border-white/10 p-4 shrink-0 overflow-y-auto custom-scrollbar bg-black/20">
           <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4 px-2">Modules</h3>
           <div className="space-y-1">
             {sections.map(section => (
               <button
                 key={section.id}
                 onClick={() => setActiveSection(section.id)}
                 className={cn(
                   "w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 text-sm transition-all",
                   activeSection === section.id 
                     ? "bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30" 
                     : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                 )}
               >
                 {section.icon}
                 {section.label}
               </button>
             ))}
           </div>

           <div className="mt-8 px-2">
             <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Client Libraries</h3>
             <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-white/60 p-2 rounded border border-white/5 hover:border-white/20 cursor-pointer">
                   <span>Node.js</span> <span className="text-[#39FF14]">v2.1.0</span>
                </div>
                <div className="flex items-center justify-between text-white/60 p-2 rounded border border-white/5 hover:border-white/20 cursor-pointer">
                   <span>Python</span> <span className="text-[#39FF14]">v1.4.2</span>
                </div>
             </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
           <div className="max-w-4xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {sections.find(s => s.id === activeSection)?.label}
                    <span className="text-xs font-normal text-white/40 bg-white/5 px-2 py-1 rounded ml-2">
                       {apiData[activeSection].length} Endpoints
                    </span>
                 </h3>
                 <Button variant="outline" size="sm" className="border-white/10 text-white/60 hover:text-white">
                    <Code size={14} className="mr-2" /> Export Spec (OpenAPI)
                 </Button>
              </div>

              <div>
                {apiData[activeSection].map((endpoint, i) => (
                  <Endpoint key={i} {...endpoint} />
                ))}
              </div>

              {apiData[activeSection].length === 0 && (
                 <div className="text-center py-20 text-white/40 border border-dashed border-white/10 rounded-xl">
                    <p>No endpoints documented for this section yet.</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApiDocs;
