
import React from 'react';
import { 
  Building2, TrendingUp, Coins, HardHat, Cpu, Cloud, 
  Settings, Megaphone, DollarSign, Brain, ArrowUpRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminIntelligence = () => {
  const industries = [
    { name: "Real Estate", icon: <Building2 size={24} />, status: 'Active', pulse: true, path: '/intelligence/real-estate' },
    { name: "Finance", icon: <TrendingUp size={24} />, status: 'Standby', pulse: false },
    { name: "Crypto", icon: <Coins size={24} />, status: 'Standby', pulse: false },
    { name: "Construction", icon: <HardHat size={24} />, status: 'Standby', pulse: false },
    { name: "AI Industry", icon: <Cpu size={24} />, status: 'Standby', pulse: false },
    { name: "SaaS", icon: <Cloud size={24} />, status: 'Standby', pulse: false },
    { name: "Automation", icon: <Settings size={24} />, status: 'Standby', pulse: false },
    { name: "Marketing", icon: <Megaphone size={24} />, status: 'Standby', pulse: false },
    { name: "Sales", icon: <DollarSign size={24} />, status: 'Standby', pulse: false },
  ];

  return (
    <div className="h-full flex flex-col bg-transparent text-white overflow-hidden rounded-tl-2xl border-l-2 border-t-2 border-white/20">
       {/* Header */}
       <div className="h-20 border-b-2 border-white/20 flex items-center px-8 justify-between bg-black/40 backdrop-blur-xl shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#39FF14]/10 rounded-xl flex items-center justify-center border-2 border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.3)]">
               <Brain className="text-[#39FF14]" size={28} />
            </div>
            <div>
               <h1 className="font-bold text-2xl tracking-wide text-white">Intelligence<span className="text-[#39FF14]">Hub</span></h1>
               <div className="flex items-center gap-2 text-xs font-mono text-[#39FF14]/80">
                  <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                  9 SECTORS MONITORED
               </div>
            </div>
         </div>
       </div>

       {/* Grid Content */}
       <div className="flex-1 overflow-y-auto p-8 bg-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {industries.map((ind, i) => (
                <motion.div
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.05 }}
                   className={`glass-panel p-6 rounded-2xl border-2 cursor-pointer group relative overflow-hidden bg-black/40 backdrop-blur-xl transition-all duration-300 ${ind.status === 'Active' ? 'border-[#39FF14]/50 shadow-[0_0_30px_rgba(57,255,20,0.1)]' : 'border-white/10 hover:border-white/30'}`}
                >
                   <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className={`p-4 rounded-xl border transition-all duration-300 ${ind.status === 'Active' ? 'bg-[#39FF14]/10 border-[#39FF14]/30 text-[#39FF14]' : 'bg-white/5 border-white/10 text-white/50 group-hover:text-white group-hover:bg-white/10'}`}>
                         {ind.icon}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${ind.status === 'Active' ? 'bg-[#39FF14]/10 border-[#39FF14]/30 text-[#39FF14]' : 'bg-white/5 border-white/10 text-white/30'}`}>
                         {ind.status}
                      </div>
                   </div>

                   <h3 className={`text-xl font-bold mb-2 uppercase tracking-wide transition-colors ${ind.status === 'Active' ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                      {ind.name}
                   </h3>
                   <p className="text-sm text-white/40 mb-6">Real-time market analysis and predictive modeling.</p>

                   <div className="flex items-center justify-between border-t border-white/10 pt-4 relative z-10">
                      <span className="text-xs text-white/30 font-mono">ID: SEC-0{i+1}</span>
                      <button className={`p-2 rounded-lg transition-colors ${ind.status === 'Active' ? 'text-[#39FF14] hover:bg-[#39FF14]/10' : 'text-white/30 group-hover:text-white'}`}>
                         <ArrowUpRight size={18} />
                      </button>
                   </div>

                   {/* Neon Hover Effect */}
                   <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default AdminIntelligence;
