
import React from 'react';
import { Play, RotateCcw, Box, GitBranch, CheckCircle, XCircle, Clock, Loader2, Server } from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PipelineManager = () => {
  const { cicd, cicdActions } = useAdmin();

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-lg font-light text-white">Pipeline Workflows</h2>
          <Button className="bg-[#0066FF] hover:bg-[#0052cc] text-white gap-2">
             <Box size={16} /> New Pipeline
          </Button>
       </div>

       <div className="space-y-4">
          {cicd.pipelines.map(pipeline => (
             <div key={pipeline.id} className="bg-[#252526] rounded-xl border border-white/5 p-6 hover:border-blue-500/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
                         <GitBranch size={24} />
                      </div>
                      <div>
                         <h3 className="font-bold text-lg text-white">{pipeline.name}</h3>
                         <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><GitBranch size={12} /> {pipeline.branch}</span>
                            <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded text-white/60">{pipeline.commit}</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3">
                      {pipeline.status === 'running' ? (
                         <Button disabled variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 gap-2">
                            <Loader2 size={16} className="animate-spin" /> Running...
                         </Button>
                      ) : (
                         <Button onClick={() => cicdActions.triggerBuild(pipeline.id)} className="bg-white/5 hover:bg-white/10 text-white gap-2">
                            <Play size={16} /> Run Pipeline
                         </Button>
                      )}
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white"><RotateCcw size={16} /></Button>
                   </div>
                </div>

                {/* Pipeline Visualization */}
                <div className="relative pt-4 pb-2">
                   {/* Connection Line */}
                   <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
                   
                   <div className="relative z-10 flex justify-between items-center">
                      {[
                         { name: 'Source', status: 'success' },
                         { name: 'Build', status: pipeline.status === 'running' ? 'running' : pipeline.lastRun === 'success' ? 'success' : 'failed' },
                         { name: 'Test', status: pipeline.status === 'running' ? 'pending' : pipeline.lastRun === 'success' ? 'success' : 'skipped' },
                         { name: 'Docker', status: pipeline.status === 'running' ? 'pending' : pipeline.lastRun === 'success' ? 'success' : 'skipped' },
                         { name: 'Deploy', status: pipeline.status === 'running' ? 'pending' : pipeline.lastRun === 'success' ? 'success' : 'skipped' }
                      ].map((stage, idx) => (
                         <div key={idx} className="flex flex-col items-center gap-2 bg-[#252526] px-2">
                            <div className={cn(
                               "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                               stage.status === 'success' ? "bg-green-500 border-green-500 text-white" :
                               stage.status === 'failed' ? "bg-red-500 border-red-500 text-white" :
                               stage.status === 'running' ? "bg-blue-500 border-blue-500 text-white animate-pulse" :
                               "bg-[#1e1e1e] border-white/20 text-gray-500"
                            )}>
                               {stage.status === 'success' ? <CheckCircle size={14} /> :
                                stage.status === 'failed' ? <XCircle size={14} /> :
                                stage.status === 'running' ? <Loader2 size={14} className="animate-spin" /> :
                                <Clock size={14} />}
                            </div>
                            <span className="text-xs font-medium text-gray-400">{stage.name}</span>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Last Run Info */}
                <div className="mt-6 flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4">
                   <div>Last run: <span className="text-white">{pipeline.lastRunTime}</span></div>
                   {pipeline.status === 'running' && (
                      <div className="flex items-center gap-2">
                         <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all duration-500" style={{width: `${pipeline.progress}%`}} />
                         </div>
                         <span>{pipeline.progress}%</span>
                      </div>
                   )}
                </div>
             </div>
          ))}
       </div>

       {/* Environments Section */}
       <div className="mt-8">
          <h2 className="text-lg font-light text-white mb-4">Deployment Environments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {cicd.environments.map(env => (
                <div key={env.id} className="bg-[#252526] rounded-xl border border-white/5 p-4 relative overflow-hidden">
                   {env.protected && <div className="absolute top-0 right-0 p-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" title="Protected Environment" /></div>}
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded bg-white/5 text-white"><Server size={18} /></div>
                      <div>
                         <div className="font-bold text-white">{env.name}</div>
                         <div className="text-[10px] text-blue-400">{env.url}</div>
                      </div>
                   </div>
                   <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-gray-400">
                         <span>Version</span>
                         <span className="text-white font-mono">{env.version}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                         <span>Status</span>
                         <span className="text-green-400 uppercase font-bold">{env.status}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                         <span>Last Deploy</span>
                         <span>{env.lastDeploy}</span>
                      </div>
                   </div>
                   <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs h-7 border-white/10" onClick={() => cicdActions.rollback(env.id)}>Rollback</Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs h-7 border-white/10">Logs</Button>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default PipelineManager;
