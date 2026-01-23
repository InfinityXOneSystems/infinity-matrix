
import React from 'react';
import { 
  Hammer, Box, Globe, Zap, Clock, 
  Activity, Layers, ArrowUpRight 
} from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';

const QuantumDashboard = () => {
  const { quantum } = useAdmin();
  
  const activeProjects = quantum.projects.filter(p => p.status === 'Active').length;
  const buildingProjects = quantum.projects.filter(p => p.status === 'Building' || p.status === 'Deploying').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-[#0066FF]/20 text-[#0066FF]">
                  <Box size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-[#0066FF]/10 text-[#0066FF]">Total</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{quantum.projects.length}</div>
            <div className="text-sm text-gray-400">Projects Managed</div>
         </div>
         
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
                  <Globe size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-green-500/10 text-green-400">Live</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{activeProjects}</div>
            <div className="text-sm text-gray-400">Active Deployments</div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-400">
                  <Activity size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-yellow-500/10 text-yellow-400">Building</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{buildingProjects}</div>
            <div className="text-sm text-gray-400">Jobs In Progress</div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                  <Layers size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-purple-500/10 text-purple-400">Library</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{quantum.components.length}</div>
            <div className="text-sm text-gray-400">Shared Components</div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5 h-80 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
               <Clock size={16} /> Recent Builds
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
               {quantum.builds.map(build => (
                  <div key={build.id} className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                     <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${build.status === 'Success' ? 'bg-green-500' : build.status === 'Building' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
                        <div>
                           <div className="text-sm font-medium text-white">Project {build.projectId}</div>
                           <div className="text-xs text-gray-500">{build.timestamp}</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-xs text-white/60 font-mono">{build.duration}</div>
                        <div className={`text-[10px] uppercase font-bold ${build.status === 'Success' ? 'text-green-400' : 'text-yellow-400'}`}>{build.status}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5 h-80 overflow-y-auto">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
               <Zap size={16} /> Project Health
            </h3>
            <div className="space-y-4">
               {quantum.projects.map(proj => (
                  <div key={proj.id} className="p-4 bg-black/20 rounded-lg border border-white/5 hover:border-[#0066FF]/30 transition-colors">
                     <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-white">{proj.name}</div>
                        <div className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">{proj.framework}</div>
                     </div>
                     <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Stack: {proj.stack}</span>
                        <span>Deploy: {proj.lastDeploy}</span>
                     </div>
                     <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                         <div className={`h-full ${proj.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: '100%' }} />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default QuantumDashboard;
