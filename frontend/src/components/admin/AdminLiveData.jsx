
import React, { useState, useEffect } from 'react';
import { 
  Activity, Server, Zap, AlertTriangle, 
  TrendingUp, TrendingDown, Globe, Shield, 
  Pause, Play, FileJson, FileText,
  BrainCircuit as Brain,
  Terminal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { logger } from '@/lib/logger'; // Import isolated logger

// --- CHART COMPONENT ---
const Sparkline = ({ data, color = "#39FF14", height = 40 }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
      <defs>
         <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
         </linearGradient>
      </defs>
      <path d={`M0,100 L0,${100 - ((data[0] - min) / range) * 100} ${points.split(' ').map((p, i) => `L${p}`).join(' ')} L100,100 Z`} fill={`url(#grad-${color})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const MetricCard = ({ label, value, subtext, trend, chartData, color = "green" }) => {
  const colorMap = {
    green: "text-[#39FF14] border-[#39FF14]",
    blue: "text-[#0066FF] border-[#0066FF]",
    red: "text-red-500 border-red-500",
    yellow: "text-yellow-500 border-yellow-500"
  };
  
  const themeColor = colorMap[color].split(" ")[0].replace("text-", ""); 

  return (
    <div className={`p-4 rounded-xl bg-[#111] border border-white/10 relative overflow-hidden group`}>
       <div className="flex justify-between items-start mb-2 relative z-10">
          <div>
             <div className="text-white/40 text-xs uppercase font-bold tracking-wider">{label}</div>
             <div className="text-2xl font-bold text-white mt-1">{value}</div>
          </div>
          <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold border bg-opacity-10", colorMap[color])}>
             {trend}
          </div>
       </div>
       <div className="text-[10px] text-white/30 font-mono mb-3 relative z-10">{subtext}</div>
       <div className="h-10 w-full opacity-50 group-hover:opacity-100 transition-opacity relative z-10">
          <Sparkline data={chartData} color={color === 'green' ? '#39FF14' : (color === 'blue' ? '#0066FF' : (color === 'red' ? '#EF4444' : '#EAB308'))} />
       </div>
       <div className={`absolute -right-10 -bottom-10 w-32 h-32 bg-${themeColor}/5 blur-3xl rounded-full group-hover:bg-${themeColor}/10 transition-colors`} />
    </div>
  );
};

const AdminLiveData = () => {
  const { toast } = useToast();
  const [isLive, setIsLive] = useState(true);
  const [systemLogs, setSystemLogs] = useState([]);
  
  // -- STATE --
  const [metrics, setMetrics] = useState({
    apiRequests: 0,
    errorRate: 0,
    latency: 0,
    activeUsers: 0
  });

  const [charts, setCharts] = useState({
    requests: Array(20).fill(0),
    latency: Array(20).fill(0),
    errors: Array(20).fill(0)
  });

  // Load logs from logger initially and on update
  useEffect(() => {
    // Subscribe to isolated logger
    const unsubscribe = logger.subscribe((logs) => {
      setSystemLogs([...logs]); // Create new ref to trigger render
    });
    return unsubscribe;
  }, []);

  // -- SIMULATION ENGINE --
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // 1. Update Metrics
      const newRequests = Math.floor(Math.random() * 500) + 1200;
      const newLatency = Math.floor(Math.random() * 50) + 20;
      const newErrorRate = (Math.random() * 0.5).toFixed(2);
      
      setMetrics({
        apiRequests: newRequests,
        latency: newLatency,
        errorRate: newErrorRate,
        activeUsers: Math.floor(Math.random() * 50) + 850
      });

      setCharts(prev => ({
        requests: [...prev.requests.slice(1), newRequests],
        latency: [...prev.latency.slice(1), newLatency],
        errors: [...prev.errors.slice(1), parseFloat(newErrorRate)]
      }));

    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="h-full flex flex-col bg-transparent text-white overflow-hidden rounded-tl-2xl border-l-2 border-t-2 border-white/20">
       
       {/* HEADER */}
       <div className="h-20 border-b-2 border-white/20 flex items-center px-8 justify-between bg-black/40 backdrop-blur-xl shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#39FF14]/10 rounded-xl flex items-center justify-center border-2 border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.3)]">
               <Activity className="text-[#39FF14] animate-pulse" size={28} />
            </div>
            <div>
               <h1 className="font-bold text-2xl tracking-wide text-white">Live<span className="text-[#39FF14]">Operations</span></h1>
               <div className="flex items-center gap-2 text-xs font-mono text-[#39FF14]/80">
                  <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#39FF14] animate-pulse' : 'bg-red-500'}`} />
                  {isLive ? 'SYSTEM ONLINE • OBSERVABILITY ACTIVE' : 'FEED PAUSED'}
               </div>
            </div>
         </div>
         <div className="flex items-center gap-3">
             <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsLive(!isLive)}
                className={cn("border-white/20 gap-2", isLive ? "text-[#39FF14]" : "text-yellow-500")}
             >
                {isLive ? <Pause size={14} /> : <Play size={14} />}
                {isLive ? 'Pause Feed' : 'Resume Feed'}
             </Button>
         </div>
       </div>

       {/* DASHBOARD CONTENT */}
       <div className="flex-1 overflow-y-auto p-6 bg-transparent custom-scrollbar space-y-6">
          
          {/* TOP METRICS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <MetricCard 
                label="API Requests / sec" 
                value={metrics.apiRequests} 
                subtext="Total inbound traffic" 
                trend="+12%" 
                chartData={charts.requests} 
                color="blue"
             />
             <MetricCard 
                label="Avg Latency (ms)" 
                value={metrics.latency} 
                subtext="Global edge response" 
                trend="-5ms" 
                chartData={charts.latency} 
                color="green"
             />
             <MetricCard 
                label="Error Rate (%)" 
                value={metrics.errorRate} 
                subtext="5xx Server Errors" 
                trend="Stable" 
                chartData={charts.errors} 
                color="red"
             />
             <MetricCard 
                label="Active Users" 
                value={metrics.activeUsers} 
                subtext="Currently Online" 
                trend="+45" 
                chartData={charts.requests} 
                color="yellow"
             />
          </div>

          {/* SYSTEM LOG STREAM (Isolated) */}
          <div className="glass-panel p-6 rounded-xl border border-white/10 bg-black/40 h-[400px] flex flex-col">
             <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Terminal className="text-[#39FF14]" size={18} /> Admin-Only Event Stream
             </h3>
             <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-xs space-y-2 p-2 bg-black/50 rounded-lg border border-white/5">
                {systemLogs.length === 0 ? (
                   <div className="h-full flex items-center justify-center text-white/30 italic">
                      Waiting for system events...
                   </div>
                ) : (
                   <AnimatePresence initial={false}>
                      {systemLogs.map((log) => (
                         <motion.div 
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-3 pb-1 border-b border-white/5 last:border-0"
                         >
                            <span className="text-white/30 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                            <span className={cn(
                               "uppercase font-bold shrink-0 w-16",
                               log.type === 'error' ? "text-red-500" :
                               log.type === 'warning' ? "text-yellow-500" :
                               log.type === 'success' ? "text-green-500" :
                               log.type === 'system' ? "text-blue-400" :
                               "text-white/60"
                            )}>
                               {log.type}
                            </span>
                            <span className="text-white/80">{log.message}</span>
                         </motion.div>
                      ))}
                   </AnimatePresence>
                )}
             </div>
          </div>

       </div>
    </div>
  );
};

export default AdminLiveData;
