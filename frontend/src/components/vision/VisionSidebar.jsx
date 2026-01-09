
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MessageSquare, Folder, BookOpen, 
  Target, BarChart2, Cpu, Settings, 
  ChevronLeft, Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const VisionSidebar = ({ 
  isOpen, 
  setIsOpen, 
  activeSystem, 
  setActiveSystem,
  onNewChat,
  isMobile 
}) => {
  const systems = [
    { id: 'prediction', label: 'Prediction', icon: Target, color: '#39FF14' },
    { id: 'simulation', label: 'Simulation', icon: BarChart2, color: '#0066FF' },
    { id: 'solver', label: 'Problem Solver', icon: Cpu, color: '#D946EF' },
  ];

  const sidebarContent = (
    // Updated background to be transparent/glassy instead of solid black
    <div className="flex flex-col h-full bg-[#020410]/60 backdrop-blur-xl border-r border-white/10">
      {/* New Chat Button */}
      <div className="p-3 md:p-4">
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-3 bg-white/5 border border-white/10 hover:bg-[#39FF14]/10 hover:border-[#39FF14] hover:text-[#39FF14] text-white transition-all duration-300 h-10 md:h-12 rounded-xl group shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
        >
          <div className="bg-[#39FF14]/20 p-1 rounded-md group-hover:bg-[#39FF14] group-hover:text-black transition-colors">
             <Plus size={16} />
          </div>
          <span className="font-semibold tracking-wide text-sm">New Chat</span>
        </Button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6 custom-scrollbar">
        
        {/* Systems Section */}
        <div>
          <h3 className="text-[10px] uppercase font-bold text-white/30 px-3 mb-2 tracking-widest">Models</h3>
          <div className="space-y-1">
            {systems.map((sys) => (
              <button
                key={sys.id}
                onClick={() => setActiveSystem(sys.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm transition-all duration-300 group",
                  activeSystem === sys.id 
                    ? "bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-white/5" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <sys.icon 
                  size={16} 
                  className={cn("transition-colors", activeSystem === sys.id ? "text-[var(--sys-color)]" : "text-white/40 group-hover:text-[var(--sys-color)]")} 
                  style={{ '--sys-color': sys.color }}
                />
                <span className={cn(activeSystem === sys.id && "font-bold")}>{sys.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div>
          <h3 className="text-[10px] uppercase font-bold text-white/30 px-3 mb-2 tracking-widest">Library</h3>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all group">
               <BookOpen size={16} className="text-white/40 group-hover:text-[#39FF14] transition-colors" />
               Prompts
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all group">
               <Folder size={16} className="text-white/40 group-hover:text-[#0066FF] transition-colors" />
               Projects
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all group">
               <Database size={16} className="text-white/40 group-hover:text-[#D946EF] transition-colors" />
               Data
            </button>
          </div>
        </div>

        {/* Recent History (Mock) */}
        <div>
           <h3 className="text-[10px] uppercase font-bold text-white/30 px-3 mb-2 tracking-widest">Recent</h3>
           <div className="space-y-1">
              {[
                 'Market Analysis', 
                 'Growth Sim 2026', 
                 'Backend Audit',
                 'Supply Chain Opt'
              ].map((title, i) => (
                 <button key={i} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/50 hover:bg-white/5 hover:text-white transition-all truncate group">
                    <MessageSquare size={14} className="shrink-0 group-hover:text-white/80" />
                    <span className="truncate">{title}</span>
                 </button>
              ))}
           </div>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-white/10">
         <button className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-white/5 transition-all text-left">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0066FF] to-[#39FF14] border border-white/20 shrink-0" />
            <div className="flex-1 overflow-hidden">
               <div className="text-xs font-bold text-white truncate">Administrator</div>
               <div className="text-[10px] text-white/40 truncate">Level 5 Access</div>
            </div>
            <Settings size={14} className="text-white/40 hover:text-white" />
         </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div 
        className="hidden md:block h-full shrink-0 overflow-hidden relative z-20"
        initial={false}
        animate={{ width: isOpen ? 260 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="w-[260px] h-full">
           {sidebarContent}
        </div>
      </motion.div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
             initial={{ x: '-100%' }}
             animate={{ x: 0 }}
             exit={{ x: '-100%' }}
             transition={{ type: "spring", damping: 25, stiffness: 200 }}
             className="fixed inset-y-0 left-0 z-50 w-[280px] md:hidden shadow-2xl h-[100dvh]"
          >
             {sidebarContent}
             <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 p-2 bg-black/50 text-white/50 hover:text-white rounded-full border border-white/10"
             >
                <ChevronLeft size={20} />
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VisionSidebar;
