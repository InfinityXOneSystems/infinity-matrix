
import React from 'react';
import { Activity, Box, HardDrive, Cpu, Server } from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';

const DockerDashboard = () => {
  const { docker } = useAdmin();
  const running = docker.containers.filter(c => c.status === 'running').length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="glass-panel p-8 bg-black/40 rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
               <div className="p-4 rounded-2xl bg-blue-500/20 text-blue-400 border-2 border-blue-500/30">
                  <Box size={28} />
               </div>
               <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30">Running: {running}</div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{docker.containers.length}</div>
            <div className="text-sm text-white/40 font-bold uppercase tracking-wide">Total Containers</div>
         </div>
         
         <div className="glass-panel p-8 bg-black/40 rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
               <div className="p-4 rounded-2xl bg-purple-500/20 text-purple-400 border-2 border-purple-500/30">
                  <HardDrive size={28} />
               </div>
               <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/10 text-white/60 border border-white/10">1.2GB</div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{docker.images.length}</div>
            <div className="text-sm text-white/40 font-bold uppercase tracking-wide">Local Images</div>
         </div>

         <div className="glass-panel p-8 bg-black/40 rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
               <div className="p-4 rounded-2xl bg-orange-500/20 text-orange-400 border-2 border-orange-500/30">
                  <Cpu size={28} />
               </div>
               <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30">High Load</div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{docker.stats.cpu}%</div>
            <div className="text-sm text-white/40 font-bold uppercase tracking-wide">vCPU Usage</div>
         </div>

         <div className="glass-panel p-8 bg-black/40 rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
               <div className="p-4 rounded-2xl bg-green-500/20 text-green-400 border-2 border-green-500/30">
                  <Server size={28} />
               </div>
               <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30">Healthy</div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{docker.stats.memory}%</div>
            <div className="text-sm text-white/40 font-bold uppercase tracking-wide">Memory Usage</div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="glass-panel p-8 bg-black/40 rounded-2xl h-80 flex flex-col justify-center items-center text-white/30 border-2 border-white/10">
            <Activity className="mb-6 opacity-30" size={64} />
            <p className="text-lg font-mono">Real-time CPU/Memory metrics visualization</p>
         </div>
         <div className="glass-panel p-8 bg-black/40 rounded-2xl h-80 overflow-y-auto font-mono text-xs custom-scrollbar border-2 border-white/10">
            <div className="mb-4 text-white/50 font-bold uppercase sticky top-0 bg-black/80 p-3 -mx-3 -mt-3 border-b-2 border-white/10 tracking-widest">System Event Log</div>
            <div className="space-y-3">
               <div className="text-blue-400 border-l-2 border-blue-500 pl-3 py-1 bg-blue-500/5 rounded-r">[INFO] Docker daemon active (v24.0.5)</div>
               <div className="text-white/70 border-l-2 border-white/20 pl-3 py-1">[LOG] Container c1 health check passed</div>
               <div className="text-white/70 border-l-2 border-white/20 pl-3 py-1">[LOG] Image pull 'infinity/agent:latest' complete</div>
               <div className="text-yellow-400 border-l-2 border-yellow-500 pl-3 py-1 bg-yellow-500/5 rounded-r">[WARN] High memory usage on node-1</div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DockerDashboard;
