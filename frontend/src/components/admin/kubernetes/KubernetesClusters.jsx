
import React from 'react';
import { Server, Cloud, CheckCircle, Plus, MoreVertical, Globe } from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const KubernetesClusters = () => {
  const { kubernetes, kubernetesActions } = useAdmin();

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
           <h2 className="text-lg font-light text-white">Managed Clusters</h2>
           <div className="flex gap-2">
               <Button className="bg-[#4285F4] hover:bg-[#3367d6] text-white gap-2">
                   <Cloud size={16} /> Connect GKE
               </Button>
               <Button variant="outline" className="border-white/10 gap-2">
                   <Plus size={16} /> Import Kubeconfig
               </Button>
           </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {kubernetes.clusters.map(cluster => (
               <div key={cluster.id} className="bg-[#252526] rounded-xl border border-white/5 p-6 hover:border-blue-500/30 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                       <div className="w-10 h-10 rounded bg-[#4285F4]/10 flex items-center justify-center text-[#4285F4]">
                           {cluster.provider === 'GKE' ? <Cloud size={20} /> : <Server size={20} />}
                       </div>
                       <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 group-hover:text-white">
                           <MoreVertical size={16} />
                       </Button>
                   </div>
                   
                   <h3 className="font-bold text-lg text-white mb-1">{cluster.name}</h3>
                   <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                       <Globe size={12} /> {cluster.region} • v{cluster.version}
                   </div>

                   <div className="space-y-3">
                       <div className="flex justify-between items-center text-sm">
                           <span className="text-gray-400">Status</span>
                           <span className="flex items-center gap-1.5 text-green-400 font-bold text-xs uppercase">
                               <CheckCircle size={12} /> {cluster.status}
                           </span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                           <span className="text-gray-400">Nodes</span>
                           <span className="text-white font-mono">{cluster.nodes}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                           <span className="text-gray-400">Provider</span>
                           <span className="text-white">{cluster.provider}</span>
                       </div>
                   </div>

                   <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                       <Button size="sm" className="flex-1 bg-white/5 hover:bg-white/10">Dashboard</Button>
                       <Button size="sm" className="flex-1 bg-white/5 hover:bg-white/10">Shell</Button>
                   </div>
               </div>
           ))}
       </div>

       <div className="mt-8">
           <h3 className="text-lg font-light text-white mb-4">Node Pools</h3>
           <div className="bg-[#252526] rounded-xl border border-white/5 overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="bg-black/20 text-gray-400 text-xs uppercase font-medium">
                     <tr>
                        <th className="p-4">Node Name</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">CPU Usage</th>
                        <th className="p-4">Memory Usage</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {kubernetes.nodes.map(node => (
                        <tr key={node.id} className="hover:bg-white/5">
                           <td className="p-4 font-mono text-white">{node.name}</td>
                           <td className="p-4 text-gray-400">{node.role}</td>
                           <td className="p-4">
                               <span className={cn(
                                   "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                   node.status === 'Ready' ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                               )}>
                                   {node.status}
                               </span>
                           </td>
                           <td className="p-4">
                               <div className="flex items-center gap-2">
                                   <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                       <div className="h-full bg-blue-500" style={{width: node.cpu}} />
                                   </div>
                                   <span className="text-xs text-gray-400">{node.cpu}</span>
                               </div>
                           </td>
                           <td className="p-4">
                               <div className="flex items-center gap-2">
                                   <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                       <div className="h-full bg-purple-500" style={{width: node.mem}} />
                                   </div>
                                   <span className="text-xs text-gray-400">{node.mem}</span>
                               </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
           </div>
       </div>
    </div>
  );
};

export default KubernetesClusters;
