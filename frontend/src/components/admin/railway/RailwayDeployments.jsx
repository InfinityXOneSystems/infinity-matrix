
import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Loader2, RotateCcw, Terminal, ExternalLink, Code } from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const RailwayDeployments = () => {
  const { railway, railwayActions } = useAdmin();
  const [activeLogs, setActiveLogs] = useState(null);

  // Flatten deployments
  const allDeployments = railway.projects.flatMap(p => 
     p.deployments.map(d => ({...d, projectName: p.name, serviceName: p.services.find(s => s.id === d.serviceId)?.name }))
  ).sort((a,b) => b.time.localeCompare(a.time));

  return (
    <div className="flex h-full gap-6">
       {/* Deployment List */}
       <div className="w-1/3 bg-[#252526] rounded-xl border border-white/10 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 font-bold text-white text-sm">Deployment History</div>
          <div className="flex-1 overflow-y-auto">
             {allDeployments.map(deploy => (
                <div 
                   key={deploy.id} 
                   onClick={() => setActiveLogs(deploy)}
                   className={cn(
                      "p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors",
                      activeLogs?.id === deploy.id ? "bg-purple-500/10 border-l-4 border-l-purple-500" : "border-l-4 border-l-transparent"
                   )}
                >
                   <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-white text-sm">{deploy.projectName} / {deploy.serviceName}</div>
                      <div className={cn(
                         "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1",
                         deploy.status === 'Success' ? "bg-green-500/10 text-green-400" :
                         deploy.status === 'Failed' ? "bg-red-500/10 text-red-400" :
                         "bg-yellow-500/10 text-yellow-400"
                      )}>
                         {deploy.status === 'Success' && <CheckCircle size={10} />}
                         {deploy.status === 'Failed' && <XCircle size={10} />}
                         {deploy.status === 'Building' && <Loader2 size={10} className="animate-spin" />}
                         {deploy.status}
                      </div>
                   </div>
                   <div className="text-xs text-gray-400 mb-2">{deploy.message}</div>
                   <div className="flex justify-between text-[10px] text-gray-500">
                      <span className="font-mono">{deploy.commit}</span>
                      <span>{deploy.time}</span>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Deployment Details / Logs */}
       <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-white/10 flex flex-col overflow-hidden">
          {activeLogs ? (
             <>
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#252526]">
                   <div>
                      <h3 className="font-bold text-white">{activeLogs.serviceName} <span className="text-gray-500 text-sm font-normal">@{activeLogs.commit}</span></h3>
                      <div className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                         <Clock size={12} /> {activeLogs.duration} duration
                         <span className="mx-1">•</span>
                         <Code size={12} /> {activeLogs.initiator}
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs border-white/10" onClick={() => railwayActions.rollback(activeLogs.id)}>
                         <RotateCcw size={12} className="mr-2" /> Rollback
                      </Button>
                      <Button size="sm" className="text-xs bg-purple-600 hover:bg-purple-700">
                         <ExternalLink size={12} className="mr-2" /> Visit URL
                      </Button>
                   </div>
                </div>
                
                {/* Mock Logs */}
                <div className="flex-1 bg-[#0A0A0A] p-4 font-mono text-xs overflow-y-auto">
                   <div className="space-y-1">
                      <div className="text-purple-400">[Pipeline] Starting build for commit {activeLogs.commit}</div>
                      <div className="text-gray-400">[Builder] Cloning repository...</div>
                      <div className="text-gray-400">[Builder] Using cached layers for node_modules</div>
                      <div className="text-white">[Build] $ npm install --production</div>
                      <div className="text-gray-500">... added 84 packages in 2s</div>
                      <div className="text-white">[Build] $ npm run build</div>
                      <div className="text-green-400">[Success] Build completed in 4.2s</div>
                      <div className="text-purple-400">[Deploy] Publishing image to registry...</div>
                      <div className="text-purple-400">[Deploy] Rolling out to us-west-1 region</div>
                      <div className="text-green-400">[Health] 2/2 Health checks passed</div>
                      <div className="text-blue-400">[System] Service is active</div>
                   </div>
                </div>
             </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <Terminal size={48} className="opacity-20 mb-4" />
                <p>Select a deployment to view logs</p>
             </div>
          )}
       </div>
    </div>
  );
};

export default RailwayDeployments;
