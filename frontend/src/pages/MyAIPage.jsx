
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, Sparkles, Zap, Activity, 
  Lock, Brain, Shield, Briefcase, Terminal, 
  MoreVertical, RefreshCw, Phone, Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import GlobalAutomationToggle from '@/components/GlobalAutomationToggle';

// --- MOCK DATA: AGENTS ---
const AGENTS = [
  {
    id: 'agent_1',
    name: 'Aria "The Architect"',
    role: 'Systems & Scaling',
    specialty: 'Business Structure',
    status: 'online',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop',
    color: '#0066FF',
    gradient: 'from-[#0066FF] to-[#00CCFF]',
    intro: "I've analyzed your workflow. Efficiency is at 64%. Shall we optimize?",
    capabilities: ['Workflow Auto', 'Team Ops']
  },
  {
    id: 'agent_2',
    name: 'Kai "The Shark"',
    role: 'Capital & Finance',
    specialty: 'Wealth Acquisition',
    status: 'busy',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop',
    color: '#39FF14',
    gradient: 'from-[#39FF14] to-[#32CC12]',
    intro: "Markets are volatile today. I see three potential arbitrage opportunities.",
    capabilities: ['Trading', 'Asset Mgmt']
  },
  {
    id: 'agent_3',
    name: 'Luna "The Visionary"',
    role: 'Brand & Creative',
    specialty: 'Market Positioning',
    status: 'online',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2561&auto=format&fit=crop',
    color: '#D946EF',
    gradient: 'from-[#D946EF] to-[#FF00FF]',
    intro: "Your brand voice needs more resonance. Let's craft a viral narrative.",
    capabilities: ['Viral Content', 'UX Design']
  },
  {
    id: 'agent_4',
    name: 'Orion "The Tech Lead"',
    role: 'Full-Stack Engineer',
    specialty: 'Product Dev',
    status: 'online',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop',
    color: '#00FFFF',
    gradient: 'from-[#00FFFF] to-[#0099FF]',
    intro: "System integrity is stable. Ready to deploy new feature sets.",
    capabilities: ['Code Gen', 'Security']
  },
  {
    id: 'agent_5',
    name: 'Rex "The Operator"',
    role: 'Logistics & Ops',
    specialty: 'Execution',
    status: 'offline',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop',
    color: '#FFA500',
    gradient: 'from-[#FFA500] to-[#FF5500]',
    intro: "Supply chain vectors aligned. Awaiting command for deployment.",
    capabilities: ['Logistics', 'Crisis Mgmt']
  },
];

const MyAIPage = () => {
  const { toast } = useToast();
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [messages, setMessages] = useState({}); // { agentId: [msgs] }
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedAgent, isTyping]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const currentAgentId = selectedAgent.id;
    const userMsg = { 
      id: Date.now(), 
      role: 'user', 
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update state immediately
    setMessages(prev => ({
      ...prev,
      [currentAgentId]: [...(prev[currentAgentId] || []), userMsg]
    }));
    setInput('');
    setIsTyping(true);

    // Simulate Agent Response
    setTimeout(() => {
      const responses = [
        `Analyzing that request based on ${selectedAgent.specialty} protocols...`,
        "I've identified a critical optimization path here.",
        "Accessing secure database... Data correlated.",
        "Executing neural handshake. Please stand by.",
        "That aligns with our Q3 growth trajectory."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const agentMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => ({
        ...prev,
        [currentAgentId]: [...(prev[currentAgentId] || []), agentMsg]
      }));
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const getAgentMessages = () => {
    return messages[selectedAgent.id] || [{
      id: 'intro',
      role: 'assistant',
      content: selectedAgent.intro,
      timestamp: 'Now'
    }];
  };

  return (
    <div className="min-h-screen bg-[#020410] pt-20 pb-4 md:pt-24 md:pb-8 px-2 md:px-6 flex flex-col h-screen overflow-hidden">
      <Helmet><title>Agent Command Center | Infinity X</title></Helmet>

      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:mb-6 px-2 shrink-0">
        <div>
           <h1 className="text-xl md:text-2xl font-black text-white tracking-wider flex items-center gap-2">
             <Bot className="text-[#39FF14]" /> NEURAL <span className="text-[#39FF14]">DASHBOARD</span>
           </h1>
           <p className="text-xs text-white/40 uppercase tracking-widest hidden md:block">Active Neural Link Established</p>
        </div>
        <GlobalAutomationToggle compact />
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 overflow-hidden max-w-[1800px] mx-auto w-full">
        
        {/* LEFT SIDEBAR: AGENT ROSTER */}
        <div className="w-full md:w-[380px] lg:w-[420px] flex flex-col gap-4 shrink-0 h-[30vh] md:h-full">
           <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex-1 overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center shrink-0">
                 <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Available Agents ({AGENTS.length})</span>
                 <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                    <span className="text-[10px] text-[#39FF14] font-bold uppercase">System Online</span>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                 {AGENTS.map((agent) => (
                    <motion.button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "w-full text-left relative overflow-hidden rounded-xl border transition-all duration-300 group",
                        selectedAgent.id === agent.id
                          ? "bg-white/10 border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.15)]"
                          : "bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5"
                      )}
                    >
                       <div className="flex items-center gap-4 p-3 z-10 relative">
                          {/* Agent Avatar */}
                          <div className="relative w-14 h-14 md:w-16 md:h-16 shrink-0">
                             <div className={cn(
                               "absolute inset-0 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity", 
                               selectedAgent.id === agent.id ? "opacity-80" : ""
                             )} style={{ backgroundColor: agent.color }} />
                             <img 
                               src={agent.img} 
                               alt={agent.name} 
                               className="w-full h-full rounded-full object-cover border-2 relative z-10"
                               style={{ borderColor: selectedAgent.id === agent.id ? agent.color : 'rgba(255,255,255,0.1)' }}
                             />
                             {/* Status Dot */}
                             <div className={cn(
                               "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black z-20",
                               agent.status === 'online' ? "bg-[#39FF14]" : agent.status === 'busy' ? "bg-red-500" : "bg-gray-500"
                             )} />
                          </div>

                          {/* Agent Info */}
                          <div className="flex-1 min-w-0">
                             <h3 className="font-bold text-white truncate text-sm md:text-base group-hover:text-glow-green transition-all">
                                {agent.name.split('"')[0]}
                             </h3>
                             <p className="text-[10px] md:text-xs font-medium text-white/50 uppercase tracking-wide truncate mb-1">
                                {agent.role}
                             </p>
                             <div className="flex flex-wrap gap-1">
                                {agent.capabilities.slice(0, 2).map(cap => (
                                  <span key={cap} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-white/40 border border-white/5">
                                    {cap}
                                  </span>
                                ))}
                             </div>
                          </div>

                          {/* Action Arrow (Mobile hidden sometimes) */}
                          <div className={cn(
                             "w-8 h-8 rounded-full flex items-center justify-center border transition-all",
                             selectedAgent.id === agent.id 
                               ? `bg-[${agent.color}]/20 border-[${agent.color}] text-[${agent.color}]`
                               : "border-white/10 text-white/20 group-hover:border-white/30 group-hover:text-white"
                          )} style={{ color: selectedAgent.id === agent.id ? agent.color : undefined, borderColor: selectedAgent.id === agent.id ? agent.color : undefined }}>
                             <Zap size={14} fill={selectedAgent.id === agent.id ? "currentColor" : "none"} />
                          </div>
                       </div>
                       
                       {/* Background Gradient Effect */}
                       {selectedAgent.id === agent.id && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 opacity-50 pointer-events-none" />
                       )}
                    </motion.button>
                 ))}
              </div>
           </div>
        </div>

        {/* RIGHT PANEL: CHAT INTERFACE */}
        <div className="flex-1 h-[60vh] md:h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col shadow-2xl relative overflow-hidden">
           
           {/* Top Bar */}
           <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center shrink-0 z-20 relative backdrop-blur-md">
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <img 
                      src={selectedAgent.img} 
                      className="w-10 h-10 rounded-full object-cover border border-white/20" 
                      alt="Active" 
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#39FF14] text-black text-[8px] font-bold px-1 rounded-sm border border-black">
                       LIVE
                    </div>
                 </div>
                 <div>
                    <h2 className="font-bold text-white flex items-center gap-2">
                       {selectedAgent.name} 
                       <span className="text-[10px] px-2 py-0.5 rounded bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30 uppercase tracking-wide hidden sm:inline-block">
                          {selectedAgent.specialty}
                       </span>
                    </h2>
                    <p className="text-xs text-white/40 flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
                       Connected to Neural Core
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <Button size="icon" variant="ghost" className="text-white/40 hover:text-white hidden sm:flex">
                    <Phone size={18} />
                 </Button>
                 <Button size="icon" variant="ghost" className="text-white/40 hover:text-white hidden sm:flex">
                    <Video size={18} />
                 </Button>
                 <Button size="icon" variant="ghost" className="text-white/40 hover:text-white">
                    <MoreVertical size={18} />
                 </Button>
              </div>
           </div>

           {/* Messages Area */}
           <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar relative" ref={scrollRef}>
              {/* Background Decoration */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
                 <Bot size={400} />
              </div>

              {getAgentMessages().map((msg, idx) => (
                 <motion.div
                   key={msg.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.3 }}
                   className={cn(
                      "flex gap-4 max-w-3xl",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                   )}
                 >
                    {/* Avatar Bubble */}
                    <div className="shrink-0">
                       {msg.role === 'assistant' ? (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg border border-white/10" 
                               style={{ backgroundImage: `linear-gradient(135deg, ${selectedAgent.color}40, ${selectedAgent.color}10)` }}>
                             <Bot size={20} style={{ color: selectedAgent.color }} />
                          </div>
                       ) : (
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                             <User size={20} className="text-white" />
                          </div>
                       )}
                    </div>

                    {/* Message Content */}
                    <div className={cn(
                       "flex flex-col gap-1",
                       msg.role === 'user' ? "items-end" : "items-start"
                    )}>
                       <div className="flex items-center gap-2 px-1">
                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                             {msg.role === 'user' ? 'You' : selectedAgent.name.split('"')[1].replace('"', '')}
                          </span>
                          <span className="text-[10px] text-white/20">{msg.timestamp}</span>
                       </div>
                       
                       <div className={cn(
                          "p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-xl backdrop-blur-sm border",
                          msg.role === 'user' 
                             ? "bg-[#0066FF] text-white border-transparent rounded-tr-none" 
                             : "bg-white/5 text-white/90 border-white/10 rounded-tl-none hover:border-[#39FF14]/30 transition-colors"
                       )}>
                          {msg.content}
                       </div>
                    </div>
                 </motion.div>
              ))}

              {isTyping && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                       <Bot size={20} className="text-white/40" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-1.5 h-[54px]">
                       <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-bounce [animation-delay:-0.3s]" />
                       <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-bounce [animation-delay:-0.15s]" />
                       <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-bounce" />
                    </div>
                 </motion.div>
              )}
           </div>

           {/* Input Area */}
           <div className="p-4 md:p-6 bg-black/40 border-t border-white/10 backdrop-blur-xl z-20">
              <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                 <div className="relative flex-1 group">
                    <Input 
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       placeholder={`Message ${selectedAgent.name.split('"')[1]}...`}
                       className="h-14 bg-white/5 border-white/10 hover:border-white/20 focus:border-[#39FF14] text-white pl-5 pr-12 rounded-xl transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <Button 
                          type="button"
                          size="icon" 
                          variant="ghost" 
                          className="w-8 h-8 text-white/30 hover:text-[#39FF14] hover:bg-[#39FF14]/10 rounded-lg transition-all"
                       >
                          <Sparkles size={16} />
                       </Button>
                    </div>
                 </div>
                 
                 <Button 
                    type="submit" 
                    disabled={!input.trim()}
                    className="h-14 w-14 rounded-xl bg-[#39FF14] hover:bg-[#32cc12] text-black shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all flex items-center justify-center shrink-0"
                 >
                    <Send size={24} className="ml-1" />
                 </Button>
              </form>
              <div className="text-center mt-3">
                 <p className="text-[10px] text-white/20 flex items-center justify-center gap-2">
                    <Lock size={10} /> End-to-end encrypted neural channel
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MyAIPage;
