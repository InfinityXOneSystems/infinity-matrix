
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Bot, User, Sparkles, StopCircle, RefreshCw, Copy, ThumbsUp, ThumbsDown, Menu, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const VisionChatInterface = ({ 
  messages, 
  isProcessing, 
  onSendMessage, 
  input, 
  setInput,
  activeSystem,
  sidebarOpen,
  setSidebarOpen
}) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const systemConfig = {
    prediction: { name: 'Prediction', color: '#39FF14', icon: <Sparkles size={14} /> },
    simulation: { name: 'Simulation', color: '#0066FF', icon: <RefreshCw size={14} /> },
    solver: { name: 'Solver', color: '#D946EF', icon: <Bot size={14} /> },
  };

  const activeConfig = systemConfig[activeSystem] || systemConfig.prediction;

  return (
    // FULL HEIGHT CONTAINER
    <div className="flex flex-col h-full w-full bg-transparent relative">
      
      {/* 
        Sub-Header / Control Bar
        Only visible when sidebar is closed on desktop or always on mobile if sidebar closed
        Shows current mode and sidebar toggle
      */}
      <div className="h-10 md:h-12 flex items-center justify-between px-4 border-b border-white/5 bg-[#020410]/30 backdrop-blur-sm shrink-0 z-20">
         <div className="flex items-center gap-3">
            <Button 
               variant="ghost" 
               size="icon" 
               onClick={() => setSidebarOpen(!sidebarOpen)} 
               className={cn(
                  "text-white/60 hover:text-white h-8 w-8",
                  sidebarOpen && "hidden md:hidden" // Hide on desktop if already open
               )}
            >
               <Menu size={18} />
            </Button>
            
            <div className="flex items-center gap-2">
               <span style={{ color: activeConfig.color }} className="drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">{activeConfig.icon}</span>
               <span className="text-xs md:text-sm font-medium text-white/80">{activeConfig.name} Engine</span>
            </div>
         </div>
         
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse shadow-[0_0_8px_#39FF14]" />
         </div>
      </div>

      {/* Messages Area - EXPANDS TO FILL SPACE */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 md:px-0 scroll-smooth" ref={scrollRef}>
         <div className="max-w-4xl mx-auto py-6 md:py-10 space-y-6 md:space-y-8 pb-4">
            
            {/* Empty State */}
            {messages.length === 0 && (
               <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(57,255,20,0.1)] mb-6">
                     <Bot size={32} className="text-white/20 md:w-10 md:h-10" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Vision Cortex Active</h2>
                  <p className="text-white/40 max-w-sm text-sm mb-8">
                     Neural connection established with {activeConfig.name} Engine. Ready for complex queries.
                  </p>
                  
                  {/* Quick Prompts - Grid for responsiveness */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                     {['Predict BTC price action', 'Simulate supply chain shock', 'Optimize React components', 'Generate investor pitch'].map((hint, i) => (
                        <button 
                           key={i} 
                           onClick={() => setInput(hint)}
                           className="text-xs text-white/50 border border-white/10 p-3 md:p-4 rounded-xl hover:bg-white/5 hover:border-[#39FF14]/50 hover:text-white transition-all text-left truncate active:scale-[0.98]"
                        >
                           "{hint}"
                        </button>
                     ))}
                  </div>
               </div>
            )}

            {/* Message List */}
            {messages.map((msg) => (
               <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                     "flex gap-3 md:gap-4 group px-2 md:px-4", 
                     msg.role === 'user' ? "flex-row-reverse" : ""
                  )}
               >
                  <div className={cn(
                     "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs shadow-lg mt-1",
                     msg.role === 'assistant' 
                        ? "bg-[#39FF14]/10 border-[#39FF14]/30 text-[#39FF14]" 
                        : "bg-white/10 border-white/20 text-white"
                  )}>
                     {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  
                  <div className={cn(
                     "flex flex-col max-w-[85%] md:max-w-[80%]",
                     msg.role === 'user' ? "items-end" : "items-start"
                  )}>
                     <div className={cn(
                        "text-sm md:text-base leading-relaxed px-4 py-3 rounded-2xl whitespace-pre-wrap backdrop-blur-sm shadow-sm",
                        msg.role === 'user' 
                           ? "bg-[#0066FF] text-white rounded-tr-sm" 
                           : "bg-white/5 text-white/90 border border-white/5 rounded-tl-sm"
                     )}>
                        {msg.content}
                     </div>
                     
                     {/* Assistant Actions */}
                     {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-1.5 hover:bg-white/10 rounded text-white/30 hover:text-white transition-colors"><Copy size={12} /></button>
                           <button className="p-1.5 hover:bg-white/10 rounded text-white/30 hover:text-white transition-colors"><ThumbsUp size={12} /></button>
                        </div>
                     )}
                  </div>
               </motion.div>
            ))}

            {isProcessing && (
               <div className="flex gap-4 px-4">
                  <div className="w-8 h-8 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30 flex items-center justify-center shrink-0">
                     <Bot size={16} className="text-[#39FF14]" />
                  </div>
                  <div className="flex items-center gap-1 h-8 bg-white/5 rounded-2xl px-4 w-fit">
                     <span className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-bounce [animation-delay:-0.3s]" />
                     <span className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-bounce [animation-delay:-0.15s]" />
                     <span className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-bounce" />
                  </div>
               </div>
            )}
         </div>
      </div>

      {/* 
        Input Area - Fixed Bottom edge-to-edge
        Uses a sleek gradient background for separation
      */}
      <div className="p-3 md:p-6 bg-gradient-to-t from-[#020410] via-[#020410] to-transparent shrink-0 z-30">
         <div className="max-w-4xl mx-auto relative group">
            <textarea
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder={`Message ${activeConfig.name}...`}
               className="w-full bg-[#1a1b26]/80 backdrop-blur-xl border border-white/10 rounded-2xl pl-4 pr-24 py-4 md:py-4 focus:border-[#39FF14]/50 focus:ring-1 focus:ring-[#39FF14]/50 outline-none transition-all text-white placeholder:text-white/30 resize-none shadow-xl custom-scrollbar text-sm md:text-base"
               rows={1}
               style={{ height: 'auto', minHeight: '56px', maxHeight: '150px' }}
            />
            
            <div className="absolute right-2 bottom-2 md:right-3 md:bottom-3 flex items-center gap-1 md:gap-2">
               <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 md:h-10 md:w-10 text-white/40 hover:text-white hover:bg-white/5 rounded-xl hidden sm:flex"
               >
                  <Paperclip size={18} />
               </Button>
               <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 md:h-10 md:w-10 text-white/40 hover:text-white hover:bg-white/5 rounded-xl sm:hidden"
               >
                  <Mic size={18} />
               </Button>
               <Button 
                  onClick={onSendMessage} 
                  disabled={!input.trim() || isProcessing}
                  className={cn(
                     "h-8 w-8 md:h-10 md:w-10 rounded-xl transition-all duration-300 flex items-center justify-center p-0",
                     input.trim() 
                        ? "bg-[#39FF14] text-black hover:bg-[#32cc12] shadow-[0_0_15px_rgba(57,255,20,0.4)]" 
                        : "bg-white/10 text-white/30 cursor-not-allowed"
                  )}
               >
                  {isProcessing ? <StopCircle size={18} className="animate-pulse" /> : <Send size={18} className="ml-0.5" />}
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default VisionChatInterface;
