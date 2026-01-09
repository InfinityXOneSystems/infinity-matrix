
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, Sparkles, Zap, Image as ImageIcon, 
  FileText, Mic, Paperclip, MoreVertical, Trash2, PanelLeftOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import ChatSidebar from '@/components/ChatSidebar';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'system', content: 'Welcome to the central communication hub. I am ready to assist you.' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState([
    { id: '1', title: 'Project Alpha Strategy' },
    { id: '2', title: 'Code Refactoring Session' }
  ]);
  const [activeChatId, setActiveChatId] = useState('1');
  const scrollRef = useRef(null);
  const { toast } = useToast();

  // Mobile check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

    // Mock AI Response
    setTimeout(() => {
      const aiMsg = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: `I've received your input: "${input}". As an autonomous agent, I am processing this request against our internal knowledge base.` 
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Neural Chat | Infinity X</title>
      </Helmet>

      <div className="flex h-[calc(100vh-5rem)] max-w-[1920px] mx-auto overflow-hidden relative pt-20">
        <ChatSidebar 
           isOpen={sidebarOpen}
           toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
           history={history}
           activeId={activeChatId}
           onNewChat={() => {
             setActiveChatId(Date.now().toString());
             setMessages([{ id: Date.now(), role: 'system', content: 'New session initialized.' }]);
             toast({ description: "New chat session created" });
           }}
           onSelectChat={(id) => setActiveChatId(id)}
           onDeleteChat={(id) => {
              setHistory(h => h.filter(x => x.id !== id));
              if(activeChatId === id) setActiveChatId(null);
           }}
           mobile={isMobile}
        />

        <div className="flex-1 flex flex-col h-full bg-[#343541] md:bg-black/80 relative transition-all duration-300">
          {/* Header */}
          <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md shrink-0 z-10">
             <div className="flex items-center gap-3">
                {!sidebarOpen && (
                   <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white">
                      <PanelLeftOpen size={20} />
                   </Button>
                )}
                <div className="flex flex-col">
                   <h2 className="text-white font-bold text-sm">Active Session</h2>
                   <div className="flex items-center gap-2 text-[10px] text-white/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
                      Online
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white/40 hover:text-white" onClick={() => setMessages([])}>
                   <Trash2 size={18} />
                </Button>
             </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8" ref={scrollRef}>
             <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((msg) => (
                   <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn("flex gap-4", msg.role === 'user' ? "justify-end" : "justify-start")}
                   >
                      {msg.role !== 'user' && (
                         <div className="w-8 h-8 rounded-lg bg-[#39FF14]/10 border border-[#39FF14]/30 flex items-center justify-center shrink-0">
                            <Bot size={16} className="text-[#39FF14]" />
                         </div>
                      )}
                      
                      <div className={cn(
                         "max-w-[85%] md:max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg",
                         msg.role === 'user' 
                            ? "bg-[#0066FF] text-white rounded-tr-sm" 
                            : "bg-white/5 border border-white/10 text-white/90 rounded-tl-sm"
                      )}>
                         {msg.content}
                      </div>

                      {msg.role === 'user' && (
                         <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                            <User size={16} className="text-white" />
                         </div>
                      )}
                   </motion.div>
                ))}
                
                {isProcessing && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-[#39FF14]/10 border border-[#39FF14]/30 flex items-center justify-center shrink-0">
                         <Bot size={16} className="text-[#39FF14] animate-pulse" />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/40 mt-2">
                         Thinking<span className="animate-pulse">...</span>
                      </div>
                   </motion.div>
                )}
             </div>
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-gradient-to-t from-black via-black/90 to-transparent shrink-0">
             <div className="max-w-3xl mx-auto relative bg-[#40414F] border border-white/10 rounded-xl shadow-lg focus-within:ring-1 focus-within:ring-[#39FF14] transition-all">
                <textarea 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                   placeholder="Send a message..."
                   rows={1}
                   className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/40 resize-none max-h-[200px] py-4 pl-4 pr-12 min-h-[56px] custom-scrollbar"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                   <Button size="icon" variant="ghost" className="h-8 w-8 text-white/40 hover:text-white">
                      <Paperclip size={16} />
                   </Button>
                   <Button 
                      size="icon" 
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="h-8 w-8 bg-[#39FF14] text-black hover:bg-[#32cc12] disabled:bg-white/10 disabled:text-white/20 transition-all"
                   >
                      <Send size={14} />
                   </Button>
                </div>
             </div>
             <div className="text-center mt-2">
                <p className="text-[10px] text-white/30">Infinity X Neural Engine may produce inaccurate information.</p>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
