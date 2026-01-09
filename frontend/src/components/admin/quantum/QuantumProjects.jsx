
import React, { useState } from 'react';
import { 
  Box, Globe, MoreVertical, Play, Trash2, 
  GitBranch, Plus, ExternalLink 
} from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const QuantumProjects = () => {
  const { quantum, quantumActions } = useAdmin();
  const { toast } = useToast();
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreate = () => {
    if(!newProjectName) return;
    quantumActions.createProject(newProjectName, 'React + Vite');
    setNewProjectName('');
  };

  return (
    <div className="h-full flex gap-6">
       {/* Project List */}
       <div className="w-1/3 bg-[#252526] rounded-xl border border-white/10 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 flex flex-col gap-3 bg-[#252526]">
             <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">Repositories</span>
                <span className="text-xs text-gray-500">{quantum.projects.length} Total</span>
             </div>
             <div className="flex gap-2">
                <input 
                   value={newProjectName}
                   onChange={(e) => setNewProjectName(e.target.value)}
                   placeholder="New Project Name..."
                   className="flex-1 bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white"
                />
                <Button size="sm" onClick={handleCreate} className="h-7 text-xs bg-[#0066FF] hover:bg-[#0052cc] text-white">
                   <Plus size={12} />
                </Button>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
             {quantum.projects.map(proj => (
                <div 
                   key={proj.id} 
                   className="p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors group relative"
                >
                   <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-white text-sm truncate pr-4">{proj.name}</div>
                      <div className={cn(
                         "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0",
                         proj.status === 'Active' ? "bg-green-500/10 text-green-400" : 
                         proj.status === 'Building' ? "bg-yellow-500/10 text-yellow-400 animate-pulse" :
                         "bg-gray-500/10 text-gray-400"
                      )}>
                         {proj.status}
                      </div>
                   </div>
                   <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                      <Box size={12} /> {proj.framework}
                   </div>
                   <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-gray-500 flex items-center gap-1"><GitBranch size={10} /> main</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => quantumActions.deployProject(proj.id)} className="p-1 rounded hover:bg-white/10 text-green-400" title="Deploy"><Play size={12} /></button>
                         <button className="p-1 rounded hover:bg-white/10 text-blue-400" title="Open"><ExternalLink size={12} /></button>
                         <button className="p-1 rounded hover:bg-white/10 text-red-400" title="Delete"><Trash2 size={12} /></button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Editor Preview Placeholder */}
       <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-white/10 flex flex-col relative overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#252526]">
             <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Globe size={16} className="text-[#0066FF]" /> Live Preview
             </div>
             <div className="flex gap-2">
                <div className="flex items-center gap-2 px-2 py-1 bg-black/20 rounded text-[10px] text-gray-400 font-mono">
                   localhost:3000
                </div>
             </div>
          </div>
          
          <div className="flex-1 bg-white relative flex flex-col">
             {/* Fake App Header */}
             <div className="h-12 border-b flex items-center px-4 justify-between bg-white">
                <div className="font-bold text-lg text-black">My Application</div>
                <div className="flex gap-4 text-sm text-gray-500">
                   <span>Home</span>
                   <span>About</span>
                   <span>Contact</span>
                </div>
             </div>
             {/* Fake App Body */}
             <div className="flex-1 p-8 bg-gray-50">
                <div className="max-w-2xl mx-auto text-center mt-10">
                   <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Quantum X</h1>
                   <p className="text-gray-600 mb-8">This is a live preview of your generated application. Changes made in the builder reflect here instantly.</p>
                   <button className="px-6 py-3 bg-[#0066FF] text-white rounded-lg font-bold">Get Started</button>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto">
                   {[1,2,3].map(i => (
                      <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                         <div className="w-10 h-10 bg-gray-100 rounded mb-4" />
                         <div className="h-4 w-2/3 bg-gray-100 rounded mb-2" />
                         <div className="h-3 w-full bg-gray-50 rounded" />
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default QuantumProjects;
