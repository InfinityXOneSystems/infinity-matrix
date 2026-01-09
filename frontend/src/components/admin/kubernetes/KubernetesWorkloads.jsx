
import React, { useState } from 'react';
import { 
  Play, Square, RotateCcw, Trash2, Terminal, MoreVertical, 
  Layers, Box, RefreshCw, ArrowUpCircle
} from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const KubernetesWorkloads = () => {
  const { kubernetes, kubernetesActions } = useAdmin();
  const [activeTab, setActiveTab] = useState('pods'); // pods | deployments

  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('deployments')}
                className={cn("text-sm font-bold uppercase pb-1 border-b-2 transition-colors", activeTab === 'deployments' ? "text-white border-blue-500" : "text-gray-500 border-transparent hover:text-white")}
              >
                  Deployments
              </button>
              <button 
                onClick={() => setActiveTab('pods')}
                className={cn("text-sm font-bold uppercase pb-1 border-b-2 transition-colors", activeTab === 'pods' ? "text-white border-blue-500" : "text-gray-500 border-transparent hover:text-white")}
              >
                  Pods
              </button>
          </div>
          <Button variant="outline" className="text-xs h-8 gap-2 border-white/10">
             <RefreshCw size={12} /> Refresh
          </Button>
       </div>

       {activeTab === 'deployments' && (
           <div className="bg-[#252526] rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-left text-sm">
                 <thead className="bg-black/20 text-gray-400 text-xs uppercase font-medium">
                    <tr>
                       <th className="p-4">Name</th>
                       <th className="p-4">Namespace</th>
                       <th className="p-4">Replicas</th>
                       <th className="p-4">Age</th>
                       <th className="p-4">Status</th>
                       <th className="p-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {kubernetes.deployments.map(dep => (
                       <tr key={dep.id} className="group hover:bg-white/5 transition-colors">
                          <td className="p-4 font-bold text-white flex items-center gap-2">
                             <Layers size={14} className="text-blue-400" /> {dep.name}
                          </td>
                          <td className="p-4 text-gray-400">{dep.namespace}</td>
                          <td className="p-4 text-gray-300 font-mono">{dep.replicas}</td>
                          <td className="p-4 text-gray-400">{dep.age}</td>
                          <td className="p-4">
                             <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                                {dep.status}
                             </span>
                          </td>
                          <td className="p-4 text-right">
                             <div className="flex items-center justify-end gap-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-400 hover:bg-blue-500/10" title="Scale" onClick={() => kubernetesActions.scaleDeployment(dep.id, 5)}>
                                   <ArrowUpCircle size={14} />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10" title="Restart">
                                   <RotateCcw size={14} />
                                </Button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
       )}

       {activeTab === 'pods' && (
           <div className="bg-[#252526] rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-left text-sm">
                 <thead className="bg-black/20 text-gray-400 text-xs uppercase font-medium">
                    <tr>
                       <th className="p-4">Name</th>
                       <th className="p-4">Node</th>
                       <th className="p-4">Status</th>
                       <th className="p-4">Restarts</th>
                       <th className="p-4">Age</th>
                       <th className="p-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {kubernetes.pods.map(pod => (
                       <tr key={pod.id} className="group hover:bg-white/5 transition-colors">
                          <td className="p-4">
                             <div className="font-bold text-white flex items-center gap-2">
                                <Box size={14} className={pod.status === 'Running' ? "text-green-400" : "text-red-400"} />
                                {pod.name}
                             </div>
                          </td>
                          <td className="p-4 text-gray-400 text-xs">{pod.node}</td>
                          <td className="p-4">
                             <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                pod.status === 'Running' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                                "bg-red-500/10 text-red-400 border border-red-500/20"
                             )}>
                                {pod.status}
                             </span>
                          </td>
                          <td className="p-4 text-gray-400 font-mono">{pod.restarts}</td>
                          <td className="p-4 text-gray-400 text-xs">{pod.age}</td>
                          <td className="p-4 text-right">
                             <div className="flex items-center justify-end gap-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10">
                                   <Terminal size={14} />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10" onClick={() => kubernetesActions.deletePod(pod.id)}>
                                   <Trash2 size={14} />
                                </Button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
       )}
    </div>
  );
};

export default KubernetesWorkloads;
