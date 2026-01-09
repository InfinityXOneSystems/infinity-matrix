
import React from 'react';
import { 
  CreditCard, Activity, Layers, GitCommit, 
  ArrowUpRight, Clock
} from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';

const RailwayDashboard = () => {
  const { railway } = useAdmin();
  
  const totalServices = railway.projects.reduce((acc, p) => acc + p.services.length, 0);
  const activeDeployments = railway.projects.reduce((acc, p) => acc + p.deployments.filter(d => d.status === 'Success').length, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                  <Layers size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-purple-500/10 text-purple-400">Active</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{railway.projects.length}</div>
            <div className="text-sm text-gray-400">Projects</div>
         </div>
         
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
                  <Activity size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-green-500/10 text-green-400">Running</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalServices}</div>
            <div className="text-sm text-gray-400">Services</div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                  <GitCommit size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400">Deployed</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{activeDeployments}</div>
            <div className="text-sm text-gray-400">Total Deployments</div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-white/10 text-white">
                  <CreditCard size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-white/10 text-white/60">Usage</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">${railway.user.usage}</div>
            <div className="text-sm text-gray-400">Est. ${railway.user.projected} / mo</div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Recent Activity Feed */}
         <div className="col-span-2 p-6 bg-[#252526] rounded-xl border border-white/5 flex flex-col">
            <h3 className="text-lg font-light text-white mb-4 flex items-center gap-2">
               <Clock size={16} /> Recent Activity
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4">
               {railway.projects.flatMap(p => p.deployments.map(d => ({...d, projectName: p.name}))).sort((a,b) => b.time.localeCompare(a.time)).slice(0, 5).map(activity => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-black/20 border border-white/5">
                     <div className={`w-2 h-2 rounded-full ${activity.status === 'Success' ? 'bg-green-500' : activity.status === 'Building' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
                     <div className="flex-1">
                        <div className="flex justify-between items-start">
                           <span className="text-sm font-bold text-white">{activity.projectName}</span>
                           <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 flex gap-2">
                           <span className="font-mono bg-white/5 px-1 rounded">{activity.commit}</span>
                           <span>{activity.message}</span>
                        </div>
                     </div>
                     <div className="text-right text-xs text-gray-500">
                        <div>{activity.initiator}</div>
                        <div>{activity.duration}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Usage Breakdown */}
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <h3 className="text-lg font-light text-white mb-4 flex items-center gap-2">
               <ArrowUpRight size={16} /> Resource Usage
            </h3>
            <div className="space-y-4">
               {railway.projects.map(p => (
                  <div key={p.id} className="space-y-2">
                     <div className="flex justify-between text-sm text-white">
                        <span>{p.name}</span>
                        <span className="text-gray-400">45%</span>
                     </div>
                     <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }} />
                     </div>
                     <div className="flex justify-between text-xs text-gray-500">
                        <span>CPU: {p.services.length} vCPU</span>
                        <span>RAM: 2GB</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default RailwayDashboard;
