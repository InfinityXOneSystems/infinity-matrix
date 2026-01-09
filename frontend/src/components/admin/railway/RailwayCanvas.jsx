
import React from 'react';
import { Database, Box, Plus, Globe, ArrowRight, Activity, Terminal } from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const RailwayCanvas = () => {
  const { railway, railwayActions } = useAdmin();
  // Simply visualize the first project for demo purposes
  const project = railway.projects[0];

  return (
    <div className="h-full flex flex-col bg-[#111] overflow-hidden rounded-xl border border-white/10 relative">
       {/* Canvas Header */}
       <div className="absolute top-4 left-4 z-10 flex gap-4">
          <div className="bg-[#252526] border border-white/10 rounded-lg px-4 py-2 text-white shadow-xl">
             <div className="text-xs text-gray-500 uppercase font-bold">Project</div>
             <div className="font-bold">{project.name}</div>
          </div>
          <div className="bg-[#252526] border border-white/10 rounded-lg px-4 py-2 text-white shadow-xl">
             <div className="text-xs text-gray-500 uppercase font-bold">Environment</div>
             <div className="font-bold text-green-400">{project.environment}</div>
          </div>
       </div>

       <div className="absolute top-4 right-4 z-10">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2 shadow-xl" onClick={() => railwayActions.createProject('New Service')}>
             <Plus size={16} /> New Service
          </Button>
       </div>

       {/* Canvas Area (Simulated Graph) */}
       <div className="flex-1 overflow-auto p-10 flex items-center justify-center relative">
          {/* Background Grid */}
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
          />
          
          <div className="relative z-10 flex gap-12 items-center">
             
             {/* Database Tier */}
             <div className="flex flex-col gap-6">
                {project.services.filter(s => s.type === 'database').map(s => (
                   <div key={s.id} className="w-64 bg-[#1e1e1e] rounded-xl border border-white/10 p-4 shadow-2xl relative group hover:border-purple-500/50 transition-all cursor-pointer">
                      <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-gray-700" />
                      <div className="flex justify-between items-start mb-2">
                         <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                            <Database size={20} />
                         </div>
                         <div className="text-[10px] uppercase font-bold text-green-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Active
                         </div>
                      </div>
                      <div className="font-bold text-white mb-1">{s.name}</div>
                      <div className="text-xs text-gray-500 font-mono mb-3">{s.engine} • {s.ram}</div>
                      <div className="text-xs bg-black/40 rounded p-2 text-gray-400 font-mono truncate">
                         {s.engine === 'PostgreSQL' ? 'postgres://...' : 'redis://...'}
                      </div>
                   </div>
                ))}
             </div>

             {/* Web Service Tier */}
             <div className="flex flex-col gap-6">
                {project.services.filter(s => s.type === 'service').map(s => (
                   <div key={s.id} className="w-72 bg-[#1e1e1e] rounded-xl border border-white/10 p-5 shadow-2xl relative group hover:border-purple-500/50 transition-all cursor-pointer">
                      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-gray-700" />
                      <div className="flex justify-between items-start mb-3">
                         <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <Box size={24} />
                         </div>
                         <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-gray-500 hover:text-white" onClick={() => railwayActions.deploy(project.id, s.id)}>
                               <ArrowRight size={14} />
                            </Button>
                         </div>
                      </div>
                      <div className="font-bold text-white text-lg mb-1">{s.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mb-4">
                         <Globe size={12} /> {s.name}.up.railway.app
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                         <div className="bg-black/20 p-2 rounded text-center">
                            <div className="text-[10px] text-gray-500 uppercase">CPU</div>
                            <div className="text-xs text-white font-mono">{s.cpu}</div>
                         </div>
                         <div className="bg-black/20 p-2 rounded text-center">
                            <div className="text-[10px] text-gray-500 uppercase">MEM</div>
                            <div className="text-xs text-white font-mono">{s.ram}</div>
                         </div>
                      </div>

                      <div className="border-t border-white/5 pt-3 mt-2">
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">Last Deploy</span>
                            <span className="text-white">10m ago</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>

             {/* Internet Gateway */}
             <div className="relative">
                 <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-gray-700" />
                 <div className="w-24 h-24 rounded-full bg-[#252526] border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 shadow-xl">
                    <Globe size={24} className="mb-1" />
                    <span className="text-[10px] uppercase font-bold">Internet</span>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default RailwayCanvas;
