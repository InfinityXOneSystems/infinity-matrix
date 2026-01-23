
import React from 'react';
import { Box, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminProjects = () => (
  <div className="p-6 text-white">
    <div className="flex justify-between items-center mb-6">
       <h2 className="text-2xl font-light flex items-center gap-2"><Box className="text-[#0066FF]" /> Deployments</h2>
       <Button className="bg-[#0066FF] text-white"><Plus size={16} className="mr-2" /> New Project</Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       {[1,2,3,4].map(i => (
          <div key={i} className="glass-panel p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl hover:border-[#0066FF]/50 transition-colors cursor-pointer group">
             <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] group-hover:bg-[#0066FF] group-hover:text-white transition-colors border border-[#0066FF]/20">
                   <Box size={20} />
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse border border-green-500/50" />
             </div>
             <h3 className="font-bold text-lg mb-1">Project Alpha-{i}</h3>
             <p className="text-xs text-white/40 mb-4">Last deployed 2h ago</p>
             <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                <div className="bg-[#0066FF] h-full w-2/3" />
             </div>
          </div>
       ))}
    </div>
  </div>
);

export default AdminProjects;
