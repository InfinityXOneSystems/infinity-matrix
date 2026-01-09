
import React from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { getDecisionQueue, safeMap } from '@/lib/intelligence-data';

const HybridView = () => {
  const queue = getDecisionQueue();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-lg uppercase tracking-widest flex items-center gap-3">
          <GitPullRequest className="text-[#FFFF00]" /> Decision Queue
        </h3>
        <span className="text-xs text-white/40 font-mono">Waiting for authorization</span>
      </div>

      <div className="grid gap-4">
        {safeMap(queue, (item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-6 group hover:border-[#FFFF00]/50 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#FFFF00]/10 flex items-center justify-center shrink-0 border border-[#FFFF00]/20 group-hover:scale-110 transition-transform">
              <AlertTriangle className="text-[#FFFF00]" size={20} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-white font-bold text-sm md:text-base">{item.title}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                  item.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {item.severity} Priority
                </span>
              </div>
              <p className="text-white/60 text-xs md:text-sm">{item.desc}</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <button className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-white/60 hover:text-white transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase">
                <XCircle size={14} /> Reject
              </button>
              <button className="flex-1 md:flex-none px-6 py-2 rounded-lg bg-[#FFFF00] hover:bg-[#E6E600] text-black transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase shadow-[0_0_15px_rgba(255,255,0,0.3)]">
                <CheckCircle2 size={14} /> Approve
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {queue.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-white/30 flex-col gap-4 min-h-[300px]">
          <CheckCircle2 size={48} />
          <p>All decisions processed. System synchronized.</p>
        </div>
      )}
    </div>
  );
};

export default HybridView;
