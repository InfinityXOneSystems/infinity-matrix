
import React from 'react';
import { 
  Play, Pause, Edit2, Trash2, GitMerge, 
  ArrowRight, Plus, RefreshCw, Layout 
} from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ManusWorkflows = () => {
  const { manus, manusActions } = useAdmin();

  return (
    <div className="h-full flex gap-6">
       {/* Workflow List */}
       <div className="w-1/3 bg-[#252526] rounded-xl border border-white/10 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#252526]">
             <span className="font-bold text-white text-sm">My Workflows</span>
             <Button size="sm" onClick={() => manusActions.createWorkflow('New Flow')} className="h-7 text-xs bg-yellow-600 hover:bg-yellow-700 text-white">
                <Plus size={12} className="mr-1" /> New
             </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
             {manus.workflows.map(wf => (
                <div 
                   key={wf.id} 
                   className="p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors group relative"
                >
                   <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-white text-sm">{wf.name}</div>
                      <div className={cn(
                         "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                         wf.status === 'Active' ? "bg-green-500/10 text-green-400" : 
                         wf.status === 'Running' ? "bg-blue-500/10 text-blue-400 animate-pulse" :
                         "bg-gray-500/10 text-gray-400"
                      )}>
                         {wf.status}
                      </div>
                   </div>
                   <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                      <GitMerge size={12} /> {wf.steps} Steps • {wf.integration}
                   </div>
                   <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-gray-500">Last: {wf.lastRun}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => manusActions.triggerWorkflow(wf.id)} className="p-1 rounded hover:bg-white/10 text-green-400" title="Run"><Play size={12} /></button>
                         <button className="p-1 rounded hover:bg-white/10 text-blue-400" title="Edit"><Edit2 size={12} /></button>
                         <button className="p-1 rounded hover:bg-white/10 text-red-400" title="Delete"><Trash2 size={12} /></button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Editor / Canvas Placeholder */}
       <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-white/10 flex flex-col relative overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#252526]">
             <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Layout size={16} className="text-yellow-400" /> Canvas
             </div>
             <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs border-white/10 gap-2"><RefreshCw size={12} /> Sync</Button>
                <Button size="sm" className="h-7 text-xs bg-yellow-600 hover:bg-yellow-700 text-white gap-2"><Play size={12} /> Test Run</Button>
             </div>
          </div>
          
          <div className="flex-1 bg-[#111] p-10 relative flex items-center justify-center">
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
             />
             
             {/* Simple Visualization */}
             <div className="flex items-center gap-8">
                <div className="p-4 bg-[#252526] border border-white/10 rounded-lg text-center w-32 shadow-xl">
                   <div className="text-xs text-gray-500 uppercase mb-1">Trigger</div>
                   <div className="font-bold text-white">Webhook</div>
                </div>
                <ArrowRight size={24} className="text-white/20" />
                <div className="p-4 bg-[#252526] border border-white/10 rounded-lg text-center w-32 shadow-xl">
                   <div className="text-xs text-gray-500 uppercase mb-1">Action</div>
                   <div className="font-bold text-white">Scrape</div>
                </div>
                <ArrowRight size={24} className="text-white/20" />
                <div className="p-4 bg-[#252526] border border-white/10 rounded-lg text-center w-32 shadow-xl">
                   <div className="text-xs text-gray-500 uppercase mb-1">Output</div>
                   <div className="font-bold text-white">Sheet Row</div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ManusWorkflows;
