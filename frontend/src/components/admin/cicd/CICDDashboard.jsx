
import React from 'react';
import { Activity, GitMerge, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';

const CICDDashboard = () => {
  const { cicd } = useAdmin();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
                  <CheckCircle size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-green-500/10 text-green-400">
                  {cicd.stats.successRate}% Success
               </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{cicd.stats.totalDeployments}</div>
            <div className="text-sm text-gray-400">Total Deployments</div>
         </div>
         
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                  <Activity size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400">Active</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{cicd.stats.activeBuilds}</div>
            <div className="text-sm text-gray-400">Running Pipelines</div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-orange-500/20 text-orange-400">
                  <Clock size={24} />
               </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{cicd.stats.avgDuration}</div>
            <div className="text-sm text-gray-400">Avg. Build Time</div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                  <GitMerge size={24} />
               </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{cicd.pipelines.length}</div>
            <div className="text-sm text-gray-400">Active Pipelines</div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5 h-80 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-4">Recent Pipeline Activity</h3>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
               {cicd.recentRuns.map(run => (
                  <div key={run.id} className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                     <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${run.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                           <div className="text-sm font-medium text-white">{run.pipelineId}</div>
                           <div className="text-xs text-gray-500">{run.trigger}</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-xs text-white/60">{run.time}</div>
                        <div className="text-xs text-gray-500 font-mono">{run.duration}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5 h-80 overflow-y-auto font-mono text-xs">
            <div className="mb-2 text-gray-400 font-bold uppercase sticky top-0 bg-[#252526] pb-2">Live Build Logs</div>
            <div className="space-y-1">
               <div className="text-blue-400">[INFO] Pipeline p2 triggered by commit 9g2b1d3</div>
               <div className="text-gray-400">[BUILD] Starting build process...</div>
               <div className="text-gray-400">[BUILD] npm install completed (4s)</div>
               <div className="text-gray-400">[TEST] Running unit tests...</div>
               <div className="text-green-400">[TEST] 42/42 tests passed</div>
               <div className="text-gray-400">[DOCKER] Building image infinity/web:v2.4.1</div>
               <div className="text-gray-400">[DOCKER] Pushing to registry...</div>
               <div className="text-yellow-400 animate-pulse">[DEPLOY] Waiting for cluster resources...</div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CICDDashboard;
