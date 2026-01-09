
import React from 'react';
import { Play, Square, RefreshCw, Trash2, Terminal, MoreVertical, ExternalLink } from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DockerContainers = () => {
  const { docker, dockerActions } = useAdmin();

  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-light text-white">Containers</h2>
          <Button variant="outline" className="text-xs h-8 gap-2 border-white/10">
             <RefreshCw size={12} /> Refresh
          </Button>
       </div>

       <div className="bg-[#252526] rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-left text-sm">
             <thead className="bg-black/20 text-gray-400 text-xs uppercase font-medium">
                <tr>
                   <th className="p-4">Name</th>
                   <th className="p-4">Image</th>
                   <th className="p-4">Status</th>
                   <th className="p-4">Port(s)</th>
                   <th className="p-4">CPU / Mem</th>
                   <th className="p-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {docker.containers.map(container => (
                   <tr key={container.id} className="group hover:bg-white/5 transition-colors">
                      <td className="p-4">
                         <div className="font-bold text-white flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", container.status === 'running' ? "bg-green-500 animate-pulse" : "bg-gray-500")} />
                            {container.name}
                         </div>
                         <div className="text-[10px] text-gray-500 font-mono mt-0.5">{container.id}</div>
                      </td>
                      <td className="p-4 text-gray-400 font-mono text-xs">{container.image}</td>
                      <td className="p-4">
                         <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            container.status === 'running' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                            container.status === 'created' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                            "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                         )}>
                            {container.status}
                         </span>
                      </td>
                      <td className="p-4 text-gray-400 text-xs flex items-center gap-1">
                         {container.port ? <span className="hover:text-blue-400 cursor-pointer flex items-center gap-1">{container.port} <ExternalLink size={10} /></span> : '-'}
                      </td>
                      <td className="p-4 text-gray-400 text-xs font-mono">
                         {container.cpu} / {container.mem}
                      </td>
                      <td className="p-4 text-right">
                         <div className="flex items-center justify-end gap-1">
                            {container.status !== 'running' ? (
                               <Button size="icon" variant="ghost" className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-500/10" onClick={() => dockerActions.startContainer(container.id)}>
                                  <Play size={14} />
                               </Button>
                            ) : (
                               <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => dockerActions.stopContainer(container.id)}>
                                  <Square size={14} />
                               </Button>
                            )}
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10">
                               <Terminal size={14} />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10" onClick={() => dockerActions.removeContainer(container.id)}>
                               <Trash2 size={14} />
                            </Button>
                         </div>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};

export default DockerContainers;
