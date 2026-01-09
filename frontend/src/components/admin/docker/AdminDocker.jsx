
import React, { useState } from 'react';
import { 
  LayoutDashboard, Box, HardDrive, Network, 
  Settings, PenTool, Globe, Database 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/lib/AdminProvider';
import DockerDashboard from './DockerDashboard';
import DockerContainers from './DockerContainers';
import DockerBuilder from './DockerBuilder';

// Placeholder components for sections not fully implemented in detail
const DockerImages = ({ images }) => (
   <div className="space-y-4">
      <h2 className="text-lg font-light text-white mb-4">Local Image Repository</h2>
      <div className="grid gap-2">
         {images && images.map(img => (
            <div key={img.id} className="glass-panel p-4 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 text-purple-400 rounded border border-purple-500/20"><HardDrive size={16} /></div>
                  <div>
                     <div className="font-mono text-sm text-white">{img.tag}</div>
                     <div className="text-xs text-white/50">{img.size} • {img.created}</div>
                  </div>
               </div>
               <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-white border border-white/10">Push to Registry</button>
            </div>
         ))}
      </div>
   </div>
);

const AdminDocker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { docker } = useAdmin();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'containers', label: 'Containers', icon: Box },
    { id: 'images', label: 'Images', icon: HardDrive },
    { id: 'builder', label: 'Builder', icon: PenTool },
    { id: 'networks', label: 'Networks', icon: Network },
    { id: 'volumes', label: 'Volumes', icon: Database },
  ];

  const renderContent = () => {
    switch(activeTab) {
       case 'dashboard': return <DockerDashboard />;
       case 'containers': return <DockerContainers />;
       case 'images': return <DockerImages images={docker?.images || []} />;
       case 'builder': return <DockerBuilder />;
       default: return <div className="p-10 text-center text-white/40">Module loaded. Ready for configuration.</div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent text-white overflow-hidden rounded-tl-2xl border-l border-t border-white/10">
       {/* Docker Header */}
       <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center border border-blue-600/20">
                <Box className="text-white" size={20} />
             </div>
             <h1 className="font-bold text-lg">Docker<span className="font-light opacity-60">Desktop</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs">
             <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full border border-green-500/20 text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse border border-green-500/50" />
                Engine Running
             </div>
             <div className="text-white/40">v24.0.5</div>
          </div>
       </div>

       <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-48 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col py-4">
             {tabs.map(tab => (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={cn(
                      "flex items-center gap-3 px-6 py-3 text-sm transition-colors border-l-2",
                      activeTab === tab.id 
                         ? "bg-white/5 text-white border-blue-500" 
                         : "text-white/40 hover:text-white border-transparent hover:bg-white/5"
                   )}
                >
                   <tab.icon size={16} />
                   {tab.label}
                </button>
             ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-transparent">
             {renderContent()}
          </div>
       </div>
    </div>
  );
};

export default AdminDocker;
