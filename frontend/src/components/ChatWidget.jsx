
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, X, MessageSquare, 
  Minimize2, Maximize2, Sparkles, Paperclip, 
  MoreVertical, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const ChatWidget = ({ 
  mode = 'floating', // 'floating', 'sidebar', 'embedded', 'full'
  title = 'AI Assistant', 
  subtitle = 'Online',
  initialMessages = [],
  className,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(mode !== 'floating');
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState(initialMessages.length > 0 ? initialMessages : [
    { id: 'init', role: 'system', content: 'System initialized. How can I assist you today?' }
  ]);
  const scrollRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isProcessing]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    // Mock AI Response Logic
    setTimeout(() => {
      const responses = [
        "Processing your request via the neural grid...",
        "I've analyzed the data points. Here is the optimal strategy.",
        "Executing command sequences. Please stand by.",
        "That capability is currently operating at peak efficiency.",
        "I've updated the context window with your new parameters."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: randomResponse 
      }]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleClear = () => {
    setMessages([{ id: Date.now(), role: 'system', content: 'Memory cleared. Ready for new input.' }]);
    toast({ description: "Chat history cleared" });
  };

  const containerClasses = cn(
    "flex flex-col bg-[#1a1b26]/95 backdrop-blur-xl border border-[#C0C0C0] shadow-2xl transition-all duration-300 overflow-hidden relative z-40",
    mode === 'floating' && "fixed bottom-6 right-6 rounded-2xl w-[350px] max-h-[600px]",
    mode === 'sidebar' && "h-full w-full border-l border-white/10 rounded-none border-t-0 border-b-0 border-r-0 bg-black/60",
    mode === 'embedded' && "h-full w-full rounded-2xl border border-white/10 bg-black/40",
    mode === 'full' && "h-full w-full border-none rounded-none bg-transparent",
    isExpanded && mode === 'floating' && "w-[500px] h-[800px] max-h-[90vh]",
    className
  );

  // Floating Toggle Button
  if (mode === 'floating' && !isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#39FF14] rounded-full shadow-[0_0_20px_rgba(57,255,20,0.4)] flex items-center justify-center text-black hover:bg-[#32cc12] transition-colors border border-white/20"
      >
        <MessageSquare size={24} fill="currentColor" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {(isOpen || mode !== 'floating') && (
        <motion.div 
          initial={mode === 'floating' ? { opacity: 0, y: 20, scale: 0.95 } : { opacity: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={containerClasses}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#39FF14]/20 flex items-center justify-center border border-[#39FF14]/50 shadow-[0_0_10px_rgba(57,255,20,0.2)]">
                <Bot size={18} className="text-[#39FF14]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm leading-none flex items-center gap-2">
                  {title}
                  {mode === 'embedded' && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/60">BETA</span>}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
                  <span className="text-[10px] text-white/50 uppercase tracking-wider">{subtitle}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-white/40 hover:text-white" onClick={handleClear} title="Clear Chat">
                <RefreshCw size={14} />
              </Button>
              {mode === 'floating' && (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-white/40 hover:text-white" onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </Button>
              )}
              {onClose && (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-white/40 hover:text-white" onClick={onClose}>
                  <X size={14} />
                </Button>
              )}
              {mode === 'floating' && !onClose && (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-white/40 hover:text-white" onClick={() => setIsOpen(false)}>
                  <X size={14} />
                </Button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20"
            ref={scrollRef}
          >
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-lg",
                  msg.role === 'user' 
                    ? "bg-white/10 border-white/20" 
                    : "bg-[#39FF14]/10 border-[#39FF14]/30"
                )}>
                  {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-[#39FF14]" />}
                </div>
                <div className={cn(
                  "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-md backdrop-blur-sm",
                  msg.role === 'user' 
                    ? "bg-[#0066FF] text-white rounded-tr-sm border border-transparent" 
                    : "bg-white/5 border border-white/10 text-white/90 rounded-tl-sm hover:border-[#39FF14]/30 transition-colors"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            
            {isProcessing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(57,255,20,0.2)]">
                  <Bot size={14} className="text-[#39FF14] animate-pulse" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-3 flex items-center gap-1 h-[44px]">
                  <span className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white/5 border-t border-white/10 shrink-0">
            <div className="relative">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                placeholder="Type a command..."
                className="pr-20 bg-black/40 border-white/10 focus:border-[#39FF14] text-white rounded-xl h-12"
              />
              <div className="absolute right-1 top-1 bottom-1 flex items-center gap-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-9 w-9 text-white/40 hover:text-white"
                  title="Attach File"
                >
                  <Paperclip size={16} />
                </Button>
                <Button 
                  size="icon" 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="h-9 w-9 bg-[#39FF14] text-black hover:bg-[#32cc12] rounded-lg transition-all shadow-[0_0_10px_rgba(57,255,20,0.2)] hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
            {mode !== 'sidebar' && (
              <div className="text-[10px] text-center mt-2 text-white/20 flex items-center justify-center gap-1">
                 <Sparkles size={8} /> Powered by Infinity Neural Engine
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWidget;
