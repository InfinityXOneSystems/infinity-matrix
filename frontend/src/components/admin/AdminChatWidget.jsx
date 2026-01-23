
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Paperclip, Bot, User, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

const AdminChatWidget = ({ agent, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (agent) {
      loadHistory();
    }
  }, [agent]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const loadHistory = async () => {
    const res = await api.chat.getHistory(agent.id);
    if (res.success) {
      setMessages(res.data);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.chat.sendMessage({ targetAgentId: agent.id, content: userMsg.content });
      if (res.success) {
        setMessages(prev => [...prev, res.data]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        width: isExpanded ? '80vw' : '400px',
        height: isExpanded ? '80vh' : '500px',
        right: isExpanded ? '10vw' : '24px',
        bottom: isExpanded ? '10vh' : '24px',
      }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed z-50 bg-black/90 backdrop-blur-xl border border-[#39FF14]/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transition-all duration-300"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
             <div className="w-10 h-10 rounded-full bg-[#0055FF]/20 border border-[#0055FF] flex items-center justify-center">
                <Bot size={20} className="text-[#0055FF]" />
             </div>
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#39FF14] rounded-full border-2 border-black animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{agent.name}</h3>
            <p className="text-[#39FF14] text-xs uppercase tracking-wider font-mono">
               {isTyping ? 'Processing...' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="text-white/60 hover:text-white h-8 w-8">
             {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white/60 hover:text-red-400 h-8 w-8">
             <X size={16} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
         <div className="text-center py-4">
            <span className="text-xs text-white/30 uppercase tracking-widest">Encrypted Session Start</span>
         </div>
         
         {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                  msg.sender === 'user' 
                  ? 'bg-[#0055FF] text-white rounded-tr-none' 
                  : 'bg-white/10 text-white/90 border border-white/5 rounded-tl-none'
               }`}>
                  {msg.content}
               </div>
            </div>
         ))}

         {isTyping && (
            <div className="flex justify-start">
               <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-3 flex gap-1 items-center">
                  <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
            </div>
         )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-white/5">
         <form onSubmit={handleSend} className="flex gap-2">
            <Button type="button" variant="ghost" size="icon" className="text-white/40 hover:text-white shrink-0">
               <Paperclip size={20} />
            </Button>
            <Input 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder={`Message ${agent.name}...`}
               className="bg-black/50 border-white/10 text-white focus:border-[#39FF14] flex-1"
               autoFocus
            />
            <Button type="submit" size="icon" disabled={!input.trim()} className="bg-[#39FF14] hover:bg-[#32cc12] text-black shrink-0">
               <Send size={18} />
            </Button>
         </form>
      </div>
    </motion.div>
  );
};

export default AdminChatWidget;
