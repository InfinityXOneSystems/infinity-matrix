
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, AlertTriangle, CheckCircle2, 
  Play, Pause, RefreshCw, ChevronRight,
  MessageSquare, User, Bot, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { BUILDER_AGENTS } from '@/lib/quantum-data';

const BuildStream = ({ 
  activeAgentId, 
  buildLogs, 
  onIntervene, 
  interventionMode,
  onResume 
}) => {
  const scrollRef = useRef(null);
  const [input, setInput] = useState('');

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [buildLogs]);

  const activeAgent = BUILDER_AGENTS.find(a => a.id === activeAgentId) || BUILDER_AGENTS[0];

  return (
    <div className="flex flex-col h-full bg-[#050a14]/90 border-r border-silver-border-color backdrop-blur-xl relative z-10">
      
      {/* 1. Agent Status Header */}
      <div className="p-4 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-3">
           <div className="relative">
              <div 
                className="w-12 h-12 rounded-xl overflow-hidden border-2 transition-colors duration-500"
                style={{ borderColor: activeAgent.color }}
              >
                 <img src={activeAgent.avatar} alt={activeAgent.name} className="w-full h-full object-cover" />
              </div>
              <div 
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black flex items-center justify-center"
                style={{ backgroundColor: activeAgent.color }}
              >
                 <Zap size={8} className="text-black" fill="currentColor" />
              </div>
           </div>
           <div>
              <h3 className="font-bold text-white text-sm">{activeAgent.name}</h3>
              <div className="text-[10px] text-white/50 flex items-center gap-1.5 uppercase tracking-wide">
                 <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: activeAgent.color }} />
                 {activeAgent.role}
              </div>
           </div>
        </div>
      </div>

      {/* 2. Thought Stream / Logs */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
      >
        <AnimatePresence initial={false}>
          {buildLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex gap-3 text-sm",
                log.type === 'user' ? "flex-row-reverse" : ""
              )}
            >
              {/* Avatar Icon */}
              <div className={cn(
                "w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5",
                log.type === 'system' ? "bg-white/5 text-white/40" :
                log.type === 'error' ? "bg-red-500/10 text-red-500" :
                log.type === 'user' ? "bg-[#0066FF]/20 text-[#0066FF]" :
                "bg-[#39FF14]/10 text-[#39FF14]"
              )}>
                 {log.type === 'user' ? <User size={12} /> : 
                  log.type === 'error' ? <AlertTriangle size={12} /> : 
                  log.type === 'system' ? <Terminal size={12} /> :
                  <Bot size={12} />}
              </div>

              {/* Message Content */}
              <div className={cn(
                "flex-1 p-3 rounded-lg border",
                log.type === 'user' ? "bg-[#0066FF]/10 border-[#0066FF]/30 text-white rounded-tr-none" :
                log.type === 'error' ? "bg-red-500/5 border-red-500/20 text-red-200" :
                "bg-white/5 border-white/10 text-white/80 rounded-tl-none"
              )}>
                {log.type === 'agent' && (
                   <div className="text-[10px] uppercase tracking-wider opacity-50 mb-1" style={{ color: log.agentColor }}>
                      {log.agentName}
                   </div>
                )}
                <div className="leading-relaxed whitespace-pre-wrap font-mono text-xs">
                   {log.message}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator if active */}
        {!interventionMode && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center text-[10px] text-white/30 pl-10">
              <span className="w-1 h-1 bg-current rounded-full animate-bounce" />
              <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
              Thinking...
           </motion.div>
        )}
      </div>

      {/* 3. Intervention Controls */}
      <div className="p-4 bg-black/40 border-t border-white/10">
         {interventionMode ? (
            <div className="space-y-3">
               <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold uppercase tracking-widest px-1">
                  <Pause size={12} fill="currentColor" /> System Paused for Intervention
               </div>
               <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Direct agent correction..."
                  className="bg-white/5 border-white/20 text-white"
               />
               <div className="flex gap-2">
                  <Button 
                     onClick={() => { onIntervene(input); setInput(''); }}
                     className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
                  >
                     Apply Fix
                  </Button>
                  <Button 
                     onClick={onResume}
                     variant="outline"
                     className="flex-1 border-white/20 hover:bg-white/10 text-white"
                  >
                     <Play size={14} className="mr-2" /> Resume
                  </Button>
               </div>
            </div>
         ) : (
            <Button 
               onClick={() => onIntervene(null)} // Trigger pause without message
               variant="outline" 
               className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors uppercase tracking-widest text-xs h-10 font-bold"
            >
               <Pause size={14} className="mr-2" /> Stop & Intervene
            </Button>
         )}
      </div>
    </div>
  );
};

export default BuildStream;
