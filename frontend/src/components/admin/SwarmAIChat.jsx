
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Users, 
  Activity, 
  Zap, 
  CheckCircle2, 
  Terminal, 
  MoreVertical, 
  Play,
  Pause,
  RotateCcw,
  BarChart2,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

const SWARM_AGENTS = [
  { id: 'alpha', name: 'Alpha Strategist', role: 'Executive Planning', color: '#66FF33', avatar: 'AS' },
  { id: 'beta', name: 'Beta Analyst', role: 'Data Analysis', color: '#3399FF', avatar: 'BA' },
  { id: 'gamma', name: 'Gamma Coder', role: 'Technical Execution', color: '#FF3366', avatar: 'GC' },
  { id: 'delta', name: 'Delta Scout', role: 'Market Intelligence', color: '#FFCC33', avatar: 'DS' },
];

const SwarmAIChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'system', content: 'Swarm Neural Link Established. All agents online.', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [swarmState, setSwarmState] = useState('idle'); // idle, thinking, executing, consensus
  const [consensusProgress, setConsensusProgress] = useState(0);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // User Message
    const userMsg = { 
      id: Date.now(), 
      type: 'user', 
      sender: 'Architect', 
      content: inputValue, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);
    setSwarmState('thinking');

    // Simulate Swarm Processing
    await processSwarmResponse(userMsg.content);
  };

  const processSwarmResponse = async (query) => {
    // 1. Initial Consensus Building
    setSwarmState('consensus');
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      setConsensusProgress(progress);
      if (progress >= 100) clearInterval(progressInterval);
    }, 200);

    await new Promise(r => setTimeout(r, 2000));
    
    // 2. Individual Agent Thoughts (Simulated)
    const agentResponses = [
      { 
        agent: SWARM_AGENTS[0], 
        content: `Analyzing strategic implications of "${query}". Recommending immediate resource allocation.` 
      },
      { 
        agent: SWARM_AGENTS[1], 
        content: `Data correlation found. Probability of success estimated at 89.4%.` 
      },
      {
        agent: SWARM_AGENTS[2],
        content: `Drafting execution parameters. Code blocks prepared for deployment.`
      }
    ];

    // Stream agent responses one by one
    for (const response of agentResponses) {
      await new Promise(r => setTimeout(r, 800));
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'agent',
        sender: response.agent.name,
        agentId: response.agent.id,
        content: response.content,
        timestamp: new Date(),
        role: response.agent.role
      }]);
    }

    // 3. Final Swarm Action
    setSwarmState('executing');
    await new Promise(r => setTimeout(r, 1000));
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'system',
      content: 'Swarm consensus reached. Task queued for execution.',
      timestamp: new Date(),
      isAction: true
    }]);

    setIsProcessing(false);
    setSwarmState('idle');
    setConsensusProgress(0);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-4">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col glass-panel rounded-2xl overflow-hidden shadow-2xl relative">
        
        {/* Swarm Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#66FF33]/20 border border-[#66FF33] flex items-center justify-center animate-pulse">
                <Users size={20} className="text-[#66FF33]" />
              </div>
            </div>
            <div>
              <h2 className="text-white font-bold flex items-center gap-2">
                Swarm Nexus <span className="text-[10px] bg-[#66FF33]/20 text-[#66FF33] px-1.5 py-0.5 rounded border border-[#66FF33]/30">V 2.4</span>
              </h2>
              <p className="text-white/40 text-xs flex items-center gap-2">
                {swarmState === 'idle' ? (
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#66FF33]" /> Active</span>
                ) : (
                  <span className="flex items-center gap-1 text-[#3399FF]"><Activity size={10} className="animate-spin" /> Processing...</span>
                )}
                <span className="text-white/20">|</span>
                4 Agents Linked
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
             <Button variant="ghost" size="icon" className="text-white/40 hover:text-white"><BarChart2 size={18} /></Button>
             <Button variant="ghost" size="icon" className="text-white/40 hover:text-white"><Settings size={18} /></Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 relative bg-gradient-to-b from-black/20 to-transparent">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.type === 'system' ? (
                <div className="w-full flex justify-center my-2">
                  <div className={`text-xs px-3 py-1.5 rounded-full border flex items-center gap-2 ${msg.isAction ? 'bg-[#3399FF]/10 border-[#3399FF]/30 text-[#3399FF]' : 'bg-white/5 border-white/10 text-white/50'}`}>
                    {msg.isAction ? <Zap size={12} /> : <Terminal size={12} />}
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className={`flex gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.type === 'agent' && (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 shadow-lg"
                      style={{ 
                        backgroundColor: `${SWARM_AGENTS.find(a => a.id === msg.agentId)?.color}20`,
                        borderColor: SWARM_AGENTS.find(a => a.id === msg.agentId)?.color,
                        color: SWARM_AGENTS.find(a => a.id === msg.agentId)?.color
                      }}
                    >
                      {SWARM_AGENTS.find(a => a.id === msg.agentId)?.avatar || 'AI'}
                    </div>
                  )}
                  
                  <div className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.type === 'agent' && (
                      <span className="text-[10px] text-white/40 mb-1 ml-1 flex items-center gap-1">
                        {msg.sender} 
                        <span className="text-white/20">•</span> 
                        <span className="uppercase tracking-wider opacity-50">{msg.role}</span>
                      </span>
                    )}
                    
                    <div 
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.type === 'user' 
                          ? 'bg-[#0055FF] text-white rounded-tr-none' 
                          : 'bg-white/10 text-white/90 border border-white/5 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          
          {/* Consensus/Thinking Indicator */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full flex flex-col items-center gap-2 py-4"
              >
                 <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#66FF33] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-[#66FF33] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-[#66FF33] rounded-full animate-bounce" />
                 </div>
                 {swarmState === 'consensus' && (
                   <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                      <motion.div 
                        className="h-full bg-[#66FF33]"
                        initial={{ width: 0 }}
                        animate={{ width: `${consensusProgress}%` }}
                      />
                   </div>
                 )}
                 <span className="text-[10px] uppercase tracking-widest text-[#66FF33]/60">
                    {swarmState === 'consensus' ? 'Building Consensus...' : 'Agents Typing...'}
                 </span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/40 backdrop-blur-md border-t border-white/10">
          <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
            <Button type="button" variant="ghost" className="text-white/40 hover:text-white shrink-0">
               <RotateCcw size={18} />
            </Button>
            <div className="relative flex-1">
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Direct the swarm (e.g., 'Analyze Q3 market trends and draft a report')"
                className="w-full bg-white/5 border-white/10 focus:border-[#66FF33] text-white pl-4 pr-12 py-6 rounded-xl"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isProcessing || !inputValue.trim()}
              className="bg-[#66FF33] hover:bg-[#55EE22] text-black h-12 w-12 rounded-xl shrink-0 shadow-[0_0_15px_rgba(102,255,51,0.3)] transition-all hover:scale-105"
            >
              <Send size={20} />
            </Button>
          </form>
        </div>
      </div>

      {/* Side Panel: Swarm Status */}
      <div className="w-80 hidden lg:flex flex-col gap-4">
        
        {/* Swarm Metric Card */}
        <div className="glass-panel p-5 rounded-2xl">
           <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Activity size={16} className="text-[#3399FF]" /> Swarm Health
           </h3>
           <div className="space-y-4">
              <div>
                 <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>CPU Allocation</span>
                    <span className="text-[#66FF33]">42%</span>
                 </div>
                 <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#66FF33] w-[42%]" />
                 </div>
              </div>
              <div>
                 <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Memory Usage</span>
                    <span className="text-[#3399FF]">68%</span>
                 </div>
                 <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#3399FF] w-[68%]" />
                 </div>
              </div>
           </div>
        </div>

        {/* Active Agents List */}
        <div className="glass-panel flex-1 rounded-2xl p-5 overflow-hidden flex flex-col">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold">Active Agents</h3>
              <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">4/12</span>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {SWARM_AGENTS.map(agent => (
                 <div key={agent.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#66FF33]/30 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                       <div 
                         className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black"
                         style={{ backgroundColor: agent.color }}
                       >
                          {agent.avatar}
                       </div>
                       <div>
                          <div className="text-white text-sm font-bold group-hover:text-[#66FF33] transition-colors">{agent.name}</div>
                          <div className="text-white/40 text-[10px] uppercase tracking-wide">{agent.role}</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#66FF33] animate-pulse" />
                       <span className="text-white/60">Standing By</span>
                    </div>
                 </div>
              ))}
              
              <Button variant="outline" className="w-full mt-2 border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/40">
                 + Add Agent to Swarm
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default SwarmAIChat;
