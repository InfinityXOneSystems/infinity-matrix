
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Sparkles, Zap, Bot, User, 
  Settings, Activity, Brain, Shield 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const VisionCortexChat = ({ industry }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'system', 
      content: `Vision Cortex initialized. Connected to ${industry} Intelligence Streams via Vertex AI. \nOperating Mode: Strategic Overwatch.` 
    },
    {
      id: 2,
      role: 'assistant',
      content: `I am monitoring 14,200+ ${industry.toLowerCase()} data points. I can identify distressed assets, predict market shifts, or automate lead generation. What is your directive?`
    }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('hybrid');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    setTimeout(() => {
      let responseContent = '';
      if (mode === 'auto') {
        responseContent = `[AUTO-EXECUTE] Analyzing query "${userMsg.content}". \n> Scraped 400 local listings.\n> Identified 3 underpriced assets.\n> Initiating outreach sequence to owners...`;
      } else if (mode === 'hybrid') {
        responseContent = `[ANALYSIS] Based on "${userMsg.content}", I detect a potential opportunity in the commercial sector.\n\nRecommended Action: Run a deep-dive scrape on zip code 90210.\n\nShall I proceed?`;
      } else {
        responseContent = `[MANUAL] Tools ready. Please specify parameters for "${userMsg.content}" or select a specific scraper module from the dashboard below.`;
      }

      const aiMsg = { id: Date.now() + 1, role: 'assistant', content: responseContent };
      setMessages(prev => [...prev, aiMsg]);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-5xl mx-auto glass-panel rounded-2xl overflow-hidden border border-[#C0C0C0] shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#39FF14] hover:shadow-[0_0_30px_rgba(57,255,20,0.1)]">
      {/* Header */}
      <div className="h-16 border-b border-[#C0C0C0] bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 transition-colors duration-300">
        <div className="flex items-center gap-3 group">
           <div className="w-10 h-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center border border-[#C0C0C0] group-hover:border-[#39FF14] group-hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300">
              <Brain size={20} className="text-[#39FF14]" />
           </div>
           <div>
              <h2 className="font-bold text-white text-lg tracking-wide flex items-center gap-2 group-hover:text-glow-green transition-all">
                 Vision Cortex <span className="text-[10px] bg-[#0066FF]/20 text-[#0066FF] px-2 py-0.5 rounded border border-[#0066FF]/30">VERTEX AI</span>
              </h2>
              <div className="flex items-center gap-2 text-[10px] text-white/50">
                 <span className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_5px_#39FF14]" />
                 <span className="group-hover:text-[#39FF14] transition-colors">Strategic Intelligence Active</span>
              </div>
           </div>
        </div>

        {/* Workflow Toggle */}
        <div className="flex bg-black/40 rounded-full p-1 border border-[#C0C0C0] hover:border-[#39FF14] transition-all duration-300">
           {['auto', 'hybrid', 'manual'].map(m => (
              <button
                 key={m}
                 onClick={() => setMode(m)}
                 className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                    mode === m 
                       ? "bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]" 
                       : "text-white/40 hover:text-[#39FF14]"
                 )}
              >
                 {m}
              </button>
           ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gradient-to-b from-black/20 to-black/60 p-6 overflow-hidden relative">
         <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
         
         <div ref={scrollRef} className="h-full overflow-y-auto custom-scrollbar space-y-6 pr-2">
            {messages.map(msg => (
               <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-4 group", msg.role === 'user' ? "justify-end" : "justify-start")}
               >
                  {msg.role !== 'user' && (
                     <div className="w-8 h-8 rounded-full bg-white/5 border border-[#C0C0C0] flex items-center justify-center shrink-0 group-hover:border-[#39FF14] group-hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300">
                        {msg.role === 'system' ? <Shield size={14} className="text-blue-400 group-hover:text-[#39FF14]" /> : <Bot size={16} className="text-[#39FF14]" />}
                     </div>
                  )}
                  
                  <div className={cn(
                     "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed backdrop-blur-md border transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.15)]",
                     msg.role === 'user' 
                        ? "bg-[#0066FF]/20 border-[#C0C0C0] text-white rounded-tr-sm hover:border-[#39FF14]" 
                        : msg.role === 'system'
                        ? "bg-blue-900/10 border-blue-500/20 text-blue-200 w-full max-w-full text-center font-mono text-xs py-2 hover:border-[#39FF14]"
                        : "bg-white/5 border-[#C0C0C0] text-white/90 rounded-tl-sm shadow-lg hover:border-[#39FF14]"
                  )}>
                     {msg.content.split('\n').map((line, i) => (
                        <p key={i} className={cn(line.startsWith('>') && "text-[#39FF14] font-mono text-xs pl-2 border-l border-[#39FF14]/50 my-1")}>
                           {line}
                        </p>
                     ))}
                  </div>

                  {msg.role === 'user' && (
                     <div className="w-8 h-8 rounded-full bg-white/10 border border-[#C0C0C0] flex items-center justify-center shrink-0 group-hover:border-[#39FF14] group-hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300">
                        <User size={16} className="text-white group-hover:text-[#39FF14]" />
                     </div>
                  )}
               </motion.div>
            ))}
            {isProcessing && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#39FF14]/10 border border-[#C0C0C0] flex items-center justify-center shrink-0 animate-pulse shadow-[0_0_10px_rgba(57,255,20,0.3)]">
                     <Activity size={16} className="text-[#39FF14] animate-spin" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#39FF14] font-mono mt-2 shadow-[0_0_5px_#39FF14]">
                     PROCESSING DATA STREAMS<span className="animate-pulse">...</span>
                  </div>
               </motion.div>
            )}
         </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/60 border-t border-[#C0C0C0] backdrop-blur-xl transition-colors duration-300">
         <div className="flex items-center gap-4 bg-white/5 border border-[#C0C0C0] rounded-xl px-4 py-2 focus-within:border-[#39FF14] focus-within:shadow-[0_0_15px_rgba(57,255,20,0.2)] focus-within:bg-white/10 hover:border-[#39FF14]/50 hover:shadow-[0_0_10px_rgba(57,255,20,0.1)] transition-all duration-300 shadow-inner">
            <Sparkles size={18} className="text-[#39FF14]" />
            <input 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder={`Ask Vision Cortex about ${industry} trends, leads, or predictions...`}
               className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-white/30 h-10"
            />
            <Button size="icon" onClick={handleSend} className="bg-[#39FF14] hover:bg-[#32cc12] text-black rounded-lg w-10 h-10 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(57,255,20,0.5)]">
               <Send size={18} />
            </Button>
         </div>
         <div className="flex justify-between items-center mt-2 px-2">
            <div className="text-[10px] text-white/30 flex items-center gap-2 hover:text-[#39FF14] transition-colors cursor-help">
               <Zap size={10} className="text-yellow-400" /> Powered by Vertex AI & Multi-LLM Consensus
            </div>
            <div className="text-[10px] text-white/30 font-mono hover:text-[#39FF14] transition-colors">
               SECURE CONNECTION • V4.2
            </div>
         </div>
      </div>
    </div>
  );
};

export default VisionCortexChat;
