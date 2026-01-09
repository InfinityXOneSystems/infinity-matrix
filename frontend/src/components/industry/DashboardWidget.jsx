
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';

const DashboardWidget = ({ title, icon: Icon, data, type = 'stat', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      // Applied 'glass-panel' which now includes the mandatory silver border from index.css
      className="glass-panel p-6 rounded-2xl group"
    >
      <div className="flex justify-between items-start mb-6">
         <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 border border-[#C0C0C0] group-hover:border-[#39FF14] text-white/70 group-hover:text-[#39FF14] transition-colors">
               <Icon size={20} />
            </div>
            <h3 className="font-bold text-white text-sm tracking-wide uppercase group-hover:text-[#39FF14] transition-colors">{title}</h3>
         </div>
         <button className="text-white/20 hover:text-[#39FF14] transition-colors">
            <MoreHorizontal size={16} />
         </button>
      </div>

      {type === 'stat' && (
         <div>
            <div className="text-4xl font-bold text-white mb-2 tracking-tight group-hover:text-[#39FF14] transition-all">
               {data.value}
            </div>
            <div className={`flex items-center gap-2 text-xs font-bold ${data.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
               {data.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
               {data.change}
               <span className="text-white/30 font-normal ml-1">vs last week</span>
            </div>
         </div>
      )}

      {type === 'list' && (
         <div className="space-y-3">
            {data.items.map((item, i) => (
               <div key={i} className="flex justify-between items-center text-sm border-b border-[#C0C0C0]/20 pb-2 last:border-0 last:pb-0">
                  <span className="text-white/80 truncate pr-4">{item.label}</span>
                  <span className="text-[#39FF14] font-mono text-xs">{item.value}</span>
               </div>
            ))}
         </div>
      )}

      {type === 'chart' && (
         <div className="h-32 flex items-end justify-between gap-1 mt-4">
            {data.points.map((h, i) => (
               <div key={i} className="w-full bg-[#0066FF]/20 rounded-t-sm relative group/bar hover:bg-[#39FF14] transition-colors" style={{ height: `${h}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white opacity-0 group-hover/bar:opacity-100 transition-opacity bg-black border border-[#39FF14] px-1 rounded">
                     {h}%
                  </div>
               </div>
            ))}
         </div>
      )}
    </motion.div>
  );
};

export default DashboardWidget;
