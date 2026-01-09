
import React, { useState } from 'react';
import { 
  RefreshCw, LayoutDashboard, ScrollText, Settings, 
  Activity, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSync } from '@/lib/SyncProvider'; // Use the real sync context
import SyncDashboard from './SyncDashboard';
import SyncLogs from './SyncLogs';

const AdminSyncCenter = () => {
  const { status } = useSync();
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Sync Overview', icon: LayoutDashboard },
    { id: 'logs', label: 'Event Logs', icon: ScrollText },
    { id: 'config', label: 'Configuration', icon: Settings },
  ];

  const renderContent = () => {
    switch(activeTab) {
       case 'dashboard': return <SyncDashboard />;
       case 'logs': return <SyncLogs />;
       case 'config': return (
          <div className="glass-panel p-6 bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 space-y-6">
             <h3 className="text-lg font-bold text-white">Sync Strategy Configuration</h3>
             <div className="p-4 bg-white/5 rounded-lg border border-white/5 text-white/50 text-sm">
                Configuration for Exponential Backoff and Conflict Resolution is currently managed by <code>SyncEngine.js</code>.
             </div>
          </div>
       );
       default: return <div className="p-10 text-center text-white/40">Module loaded.</div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent text-white overflow-hidden rounded-tl-2xl border-l border-t border-white/10">
       {/* Header */}
       <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center border border-emerald-600/20">
                <RefreshCw className="text-white" size={20} />
             </div>
             <h1 className="font-bold text-lg">Real-Time<span className="font-light opacity-60">Sync</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs">
             <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full border", 
                status === 'connected' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                status === 'offline' ? "bg-red-500/10 border-red-500/20 text-red-400" :
                "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
             )}>
                <Activity size={12} className={status === 'syncing' ? 'animate-spin' : ''} />
                {status.toUpperCase()}
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
                         ? "bg-white/5 text-white border-emerald-600" 
                         : "text-white/40 hover:text-white border-transparent hover:bg-white/5"
                   )}
                >
                   <tab.icon size={16} />
                   {tab.label}
                </button>
             ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-transparent">
             {renderContent()}
          </div>
       </div>
    </div>
  );
};

export default AdminSyncCenter;
