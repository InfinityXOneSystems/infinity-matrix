
import React, { useState } from 'react';
import { 
  AppWindow, Plus, Activity, ExternalLink, 
  Clock, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/lib/AdminProvider';
import { cn } from '@/lib/utils';

const HorizonsDashboard = () => {
  const { horizons, horizonsActions } = useAdmin();
  const [newProjName, setNewProjName] = useState('');

  const handleCreate = () => {
    if (!newProjName) return;
    horizonsActions.createProject(newProjName, 'React');
    setNewProjName('');
  };

  return (
    <div className="space-y-8 p-8">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 bg-black/40 rounded-2xl shadow-xl">
             <h3 className="text-xs font-bold text-white/50 uppercase mb-3 tracking-widest">Total Projects</h3>
             <div className="text-5xl font-bold text-white tracking-tight">{horizons.projects.length}</div>
          </div>
          <div className="glass-panel p-8 bg-black/40 rounded-2xl shadow-xl">
             <h3 className="text-xs font-bold text-white/50 uppercase mb-3 tracking-widest">Live Deployments</h3>
             <div className="text-5xl font-bold text-green-400 tracking-tight">{horizons.projects.filter(p => p.status === 'Live').length}</div>
          </div>
          <div className="glass-panel p-8 bg-black/40 rounded-2xl shadow-xl">
             <h3 className="text-xs font-bold text-white/50 uppercase mb-3 tracking-widest">Editor Status</h3>
             <div className="flex items-center gap-3 text-white text-2xl font-medium">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-green-500/50" />
                Online
             </div>
          </div>
       </div>

       <div className="glass-panel bg-black/40 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b-2 border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5">
             <h3 className="font-bold text-white text-xl flex items-center gap-3">
                <AppWindow size={24} className="text-cyan-400" /> Recent Projects
             </h3>
             <div className="flex gap-3 mt-4 sm:mt-0">
                <input 
                   placeholder="New Project Name" 
                   value={newProjName}
                   onChange={(e) => setNewProjName(e.target.value)}
                   className="bg-black/40 border-2 border-white/20 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-cyan-500 w-64 transition-colors"
                />
                <Button size="sm" onClick={handleCreate} className="h-10 px-6 bg-cyan-600 hover:bg-cyan-700 font-bold border-2 border-cyan-400/50">
                   <Plus size={16} className="mr-2" /> Create
                </Button>
             </div>
          </div>
          <div className="divide-y divide-white/10">
             {horizons.projects.map(proj => (
                <div key={proj.id} className="p-6 hover:bg-white/5 transition-colors flex items-center justify-between group">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 border-2 border-cyan-500/30 group-hover:scale-105 transition-transform">
                         <AppWindow size={28} />
                      </div>
                      <div>
                         <div className="font-bold text-white text-lg mb-1">{proj.name}</div>
                         <div className="text-xs text-white/50 flex items-center gap-3 font-mono">
                            <span className="bg-white/10 px-2 py-0.5 rounded">{proj.framework}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {proj.lastEdited}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border-2 tracking-wide ${
                         proj.status === 'Live' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 
                         proj.status === 'Deploying' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 animate-pulse' : 
                         'bg-gray-500/10 text-white/40 border-gray-500/30'
                      }`}>
                         {proj.status}
                      </div>
                      <div className="flex gap-3">
                         {proj.url && (
                            <a href={`https://${proj.url}`} target="_blank" rel="noreferrer" className="p-2.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white border-2 border-transparent hover:border-white/20 transition-all">
                               <ExternalLink size={18} />
                            </a>
                         )}
                         <Button size="sm" variant="outline" className="h-10 px-4 border-2 border-white/20 bg-black/40 hover:bg-white/10" onClick={() => horizonsActions.deploy(proj.id)}>
                            Deploy
                         </Button>
                         <Button size="sm" className="h-10 px-6 bg-cyan-600 hover:bg-cyan-700 font-bold border-2 border-cyan-400/50">
                            Edit
                         </Button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default HorizonsDashboard;
