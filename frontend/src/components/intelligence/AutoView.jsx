
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Network, Zap, ShieldCheck, Activity } from 'lucide-react';
import WorkflowNeuralGrid from '@/components/WorkflowNeuralGrid';
import { cn } from '@/lib/utils';
import { getSystemMetrics, getActiveAgents, getLogStream, safeMap } from '@/lib/intelligence-data';

const AutoView = () => {
  const [logs, setLogs] = useState(getLogStream());
  const [agents, setAgents] = useState(getActiveAgents());
  const [metrics, setMetrics] = useState(getSystemMetrics());

  // Simulate live system
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(getSystemMetrics());
      // Rotate logs for liveliness
      setLogs(prev => [
        { id: Date.now(), time: new Date().toLocaleTimeString(), type: 'info', msg: `Neural pulse #${Math.floor(Math.random()*9000)} verified.` },
        ...prev.slice(0, 6)
      ]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* LEFT: Neural Visualization */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2 glass-panel rounded-2xl p-1 relative overflow-hidden min-h-[400px] flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.3)]"
      >
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
           <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_10px_#39FF14]" />
           <span className="text-[#39FF14] text-[10px] font-mono tracking-widest uppercase font-bold">Vision Cortex: Autonomous</span>
        </div>
        
        <div className="flex-1 bg-black/40 rounded-xl overflow-hidden relative">
           <WorkflowNeuralGrid />
           
           {/* Overlay Metrics */}
           <div className="absolute bottom-4 right-4 flex gap-3">
              <div className="px-4 py-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-xs text-white/70 font-mono flex items-center gap-2">
                 <Cpu size={12} className="text-[#39FF14]" />
                 <span className="text-[#39FF14]">CPU:</span> {metrics.cpu}%
              </div>
              <div className="px-4 py-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-xs text-white/70 font-mono flex items-center gap-2">
                 <Activity size={12} className="text-[#0066FF]" />
                 <span className="text-[#0066FF]">NET:</span> {metrics.network} Mb/s
              </div>
           </div>
        </div>
      </motion.div>

      {/* RIGHT: Agent Status & Logs */}
      <div className="space-y-6 flex flex-col h-full">
        {/* Active Agents Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#39FF14]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
              <Network size={16} className="text-[#39FF14]" /> Active Swarm
            </h3>
            <span className="text-[10px] font-mono text-white/40 border border-white/10 px-2 py-1 rounded bg-white/5">{agents.length} NODES</span>
          </div>
          
          <div className="space-y-3 relative z-10">
            {safeMap(agents, (agent) => {
              const Icon = agent.icon;
              return (
                <div key={agent.id} className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all cursor-default">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/50 shadow-inner" style={{ color: agent.color }}>
                     <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-center mb-0.5">
                       <h4 className="text-xs font-bold text-white truncate group-hover:text-[#39FF14] transition-colors">{agent.name}</h4>
                       <span className="text-[9px] uppercase tracking-wider opacity-60 font-mono" style={{ color: agent.color }}>{agent.status}</span>
                     </div>
                     <p className="text-[10px] text-white/40 truncate font-light">{agent.task}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Live Terminal Log */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 glass-panel rounded-2xl p-6 flex flex-col min-h-[250px] relative overflow-hidden"
        >
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0066FF] to-transparent opacity-50" />
          
          <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2 mb-4">
            <Terminal size={16} className="text-[#0066FF]" /> System Stream
          </h3>
          
          <div className="flex-1 overflow-hidden relative font-mono text-[10px] md:text-xs space-y-2">
             <div className="absolute inset-0 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {logs.map((log) => (
                    <motion.div 
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-3 text-white/70 border-l-2 pl-3 py-1.5 bg-white/0 hover:bg-white/5 transition-colors rounded-r"
                      style={{ 
                        borderColor: log.type === 'success' ? '#39FF14' : log.type === 'warning' ? '#FFFF00' : '#0066FF'
                      }}
                    >
                      <span className="text-white/30 shrink-0 font-light">{log.time}</span>
                      <span className={cn(
                        "font-medium",
                        log.type === 'success' && "text-[#39FF14]",
                        log.type === 'warning' && "text-[#FFFF00]",
                        log.type === 'info' && "text-white/80"
                      )}>
                        {log.msg}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AutoView;
