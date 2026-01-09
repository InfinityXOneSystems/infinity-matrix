
import React from 'react';
import { 
  Zap, Activity, CheckCircle, Clock, 
  Workflow, Database, ArrowRight 
} from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';

const ManusDashboard = () => {
  const { manus } = useAdmin();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-400">
                  <Workflow size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-green-500/10 text-green-400">Active</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{manus.stats.activeWorkflows}</div>
            <div className="text-sm text-gray-400">Running Workflows</div>
         </div>
         
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                  <Activity size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400">
                  Efficiency: {manus.stats.efficiency}
               </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{manus.stats.totalTasks}</div>
            <div className="text-sm text-gray-400">Total Tasks Processed</div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
                  <CheckCircle size={24} />
               </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{manus.stats.successRate}</div>
            <div className="text-sm text-gray-400">Success Rate</div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                  <Database size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-purple-500/10 text-purple-400">
                  Synced
               </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{manus.tools.length}</div>
            <div className="text-sm text-gray-400">Tools Available</div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5 h-80 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
               <Clock size={16} /> Recent Task Execution
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
               {manus.tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                     <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' : task.status === 'running' ? 'bg-blue-500 animate-pulse' : 'bg-gray-500'}`} />
                        <div>
                           <div className="text-sm font-medium text-white">{task.name}</div>
                           <div className="text-xs text-gray-500 uppercase">{task.status}</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-xs text-white/60">{task.time}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5 h-80 overflow-y-auto">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
               <Workflow size={16} /> Active Workflows
            </h3>
            <div className="space-y-4">
               {manus.workflows.map(wf => (
                  <div key={wf.id} className="p-4 bg-black/20 rounded-lg border border-white/5 hover:border-yellow-500/30 transition-colors cursor-pointer group">
                     <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-white">{wf.name}</div>
                        <ArrowRight size={14} className="text-gray-500 group-hover:text-yellow-400 transition-colors" />
                     </div>
                     <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Steps: {wf.steps}</span>
                        <span>{wf.integration}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${wf.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                        <span className="text-xs text-white/60 uppercase font-bold">{wf.status}</span>
                        <span className="text-[10px] text-gray-500 ml-auto">Run: {wf.lastRun}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ManusDashboard;
