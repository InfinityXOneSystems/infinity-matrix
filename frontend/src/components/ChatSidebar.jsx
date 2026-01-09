
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChatSidebar = ({ 
  isOpen, 
  toggleSidebar, 
  history = [], 
  activeId, 
  onSelectChat, 
  onNewChat, 
  onDeleteChat,
  mobile
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.div
        className={cn(
          "flex flex-col h-full bg-black/90 md:bg-black/40 backdrop-blur-xl border-r border-[#C0C0C0] shrink-0 overflow-hidden relative z-50 transition-all duration-300",
          mobile ? "fixed inset-y-0 left-0 w-[260px] border-none" : "relative"
        )}
        initial={false}
        animate={{ 
          width: isOpen ? 260 : 0,
          opacity: isOpen ? 1 : (mobile ? 0 : 1), 
          x: mobile && !isOpen ? -260 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col h-full w-[260px]">
          
          {/* Header / New Chat */}
          <div className="p-3">
            <button
              onClick={() => {
                onNewChat();
                if (mobile) toggleSidebar();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-[#C0C0C0] bg-white/5 hover:bg-[#39FF14]/10 hover:border-[#39FF14] hover:text-[#39FF14] hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] transition-all duration-300 text-white text-sm text-left group"
            >
              <Plus size={16} className="group-hover:text-[#39FF14] transition-colors" />
              <span className="font-medium group-hover:text-glow-green">New Chat</span>
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-2">
            <div className="text-xs font-medium text-white/40 px-3 py-2 mt-2 uppercase tracking-wider group-hover:text-[#39FF14]">
              Today
            </div>
            
            <div className="space-y-2">
              {history.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    onSelectChat(chat.id);
                    if (mobile) toggleSidebar();
                  }}
                  className={cn(
                    "group flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm transition-all duration-300 relative overflow-hidden border",
                    activeId === chat.id 
                      ? "bg-white/10 text-[#39FF14] border-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.2)]" 
                      : "border-[#C0C0C0] text-white/70 bg-transparent hover:bg-[#39FF14]/5 hover:text-[#39FF14] hover:border-[#39FF14] hover:shadow-[0_0_10px_rgba(57,255,20,0.1)]"
                  )}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <MessageSquare size={16} className={cn("shrink-0 transition-colors duration-300", activeId === chat.id ? "text-[#39FF14]" : "text-white/40 group-hover:text-[#39FF14]")} />
                    <span className="truncate group-hover:text-glow-green transition-all duration-300">{chat.title}</span>
                  </div>

                  {/* Delete Button */}
                  <div 
                     onClick={(e) => {
                       e.stopPropagation();
                       onDeleteChat(chat.id);
                     }}
                     className={cn(
                       "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-red-500/20 hover:text-red-400 hover:shadow-[0_0_10px_rgba(255,0,0,0.2)] transition-all duration-300 z-10",
                       activeId === chat.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                     )}
                  >
                    <Trash2 size={14} />
                  </div>
                  
                  {activeId !== chat.id && (
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/80 to-transparent pointer-events-none md:from-black/40 group-hover:opacity-0 transition-opacity" />
                  )}
                </button>
              ))}

              {history.length === 0 && (
                <div className="px-3 py-4 text-xs text-white/30 text-center italic hover:text-[#39FF14] transition-colors border border-dashed border-[#C0C0C0]/30 rounded-lg mx-2">
                  No chat history
                </div>
              )}
            </div>
          </div>

          {/* Footer User Profile */}
          <div className="p-3 border-t border-[#C0C0C0] mt-auto">
             <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#39FF14]/10 hover:border-[#39FF14] hover:shadow-[0_0_15px_rgba(57,255,20,0.1)] border border-[#C0C0C0] cursor-pointer transition-all duration-300 group bg-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0066FF] to-[#39FF14] border border-[#C0C0C0] group-hover:border-[#39FF14] transition-colors" />
                <div className="text-sm font-medium text-white group-hover:text-[#39FF14] group-hover:text-glow-green">Administrator</div>
             </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ChatSidebar;
