
import React, { useState } from 'react';
import { 
  LayoutTemplate, Code2, Rocket, Settings, 
  Compass, ShieldCheck, RefreshCw 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';
import HorizonsDashboard from './HorizonsDashboard';
import HorizonsEditor from './HorizonsEditor';

const AdminHorizons = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { horizonsActions } = useAdmin();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutTemplate },
    { id: 'editor', label: 'Editor', icon: Code2 },
    { id: 'deployments', label: 'Deployments', icon: Rocket },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch(activeTab) {
       case 'dashboard': return <HorizonsDashboard />;
       case 'editor': return <HorizonsEditor />;
       case 'deployments': return <div className="p-10 text-center text-white/40">Deployment History & Logs</div>;
       case 'settings': return <div className="p-10 text-center text-white/40">Editor Configuration</div>;
       default: return <div className="p-10 text-center text-white/40">Module loaded.</div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent text-white overflow-hidden rounded-tl-2xl border-l border-t border-white/10">
       {/* Header */}
       <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-cyan-600 rounded flex items-center justify-center border border-cyan-600/20">
                <Compass className="text-white" size={20} />
             </div>
             <h1 className="font-bold text-lg">Horizons<span className="font-light opacity-60">Builder</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs">
             <Button variant="ghost" size="sm" onClick={() => horizonsActions.syncService && horizonsActions.syncService('horizons')} className="text-white/40 hover:text-white h-7 gap-2">
                <RefreshCw size={12} /> Sync
             </Button>
             <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full border border-cyan-500/20 text-cyan-400">
                <ShieldCheck size={12} />
                Vault Connected
             </div>
          </div>
       </div>

       <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col py-4">
             {tabs.map(tab => (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={cn(
                      "flex items-center gap-3 px-6 py-3 text-sm transition-colors border-l-2",
                      activeTab === tab.id 
                         ? "bg-white/5 text-white border-cyan-500" 
                         : "text-white/40 hover:text-white border-transparent hover:bg-white/5"
                   )}
                >
                   <tab.icon size={16} />
                   {tab.label}
                </button>
             ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-transparent">
             {renderContent()}
          </div>
       </div>
    </div>
  );
};

export default AdminHorizons;
