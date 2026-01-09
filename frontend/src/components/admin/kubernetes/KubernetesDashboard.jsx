
import React from 'react';
import { Activity, Server, Layers, AlertCircle } from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';

const KubernetesDashboard = () => {
  const { kubernetes } = useAdmin();
  
  const healthyPods = kubernetes.pods.filter(p => p.status === 'Running').length;
  const errorPods = kubernetes.pods.filter(p => p.status !== 'Running').length;
  const totalNodes = kubernetes.nodes.length;
  const activeClusters = kubernetes.clusters.filter(c => c.status === 'Active').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                  <Activity size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-green-500/10 text-green-400">Stable</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{activeClusters}</div>
            <div className="text-sm text-gray-400">Connected Clusters</div>
         </div>
         
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                  <Server size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-white/10 text-white/60">Capacity: 84%</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalNodes}</div>
            <div className="text-sm text-gray-400">Total Nodes</div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
                  <Layers size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-green-500/10 text-green-400">Healthy</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{healthyPods}</div>
            <div className="text-sm text-gray-400">Running Pods</div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-red-500/20 text-red-400">
                  <AlertCircle size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-red-500/10 text-red-400">Action Req</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{errorPods}</div>
            <div className="text-sm text-gray-400">Failed/Restarting</div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5 h-80 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-4">Cluster Resource Allocation</h3>
            <div className="flex-1 flex flex-col justify-center gap-6 px-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400"><span>CPU Requests</span><span>24 / 32 Cores</span></div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[75%]" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400"><span>Memory Limits</span><span>48 / 64 GB</span></div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-[75%]" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400"><span>Storage (PVC)</span><span>1.2 / 5 TB</span></div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[24%]" />
                    </div>
                </div>
            </div>
         </div>
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5 h-80 overflow-y-auto font-mono text-xs">
            <div className="mb-2 text-gray-400 font-bold uppercase sticky top-0 bg-[#252526] pb-2">Kubernetes Event Stream</div>
            <div className="space-y-2">
               <div className="text-white/60 border-l-2 border-green-500 pl-2 py-1">
                   <div className="text-[10px] text-gray-500">Just now • kube-system</div>
                   <div>Scaled up replicaset neural-engine-v2-x7f9 to 4 replicas</div>
               </div>
               <div className="text-white/60 border-l-2 border-red-500 pl-2 py-1">
                   <div className="text-[10px] text-gray-500">2m ago • default</div>
                   <div className="text-red-300">Pod job-processor-z8p1 failed liveness probe: HTTP 503</div>
               </div>
               <div className="text-white/60 border-l-2 border-blue-500 pl-2 py-1">
                   <div className="text-[10px] text-gray-500">5m ago • ingress-nginx</div>
                   <div>Ingress controller reloaded configuration</div>
               </div>
               <div className="text-white/60 border-l-2 border-green-500 pl-2 py-1">
                   <div className="text-[10px] text-gray-500">12m ago • default</div>
                   <div>Successfully pulled image "infinity/neural-engine:v2.1.0"</div>
               </div>
               <div className="text-white/60 border-l-2 border-yellow-500 pl-2 py-1">
                   <div className="text-[10px] text-gray-500">1h ago • gke-pool-1</div>
                   <div>Node gke-pool-1-d3e2 is experiencing memory pressure</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default KubernetesDashboard;
