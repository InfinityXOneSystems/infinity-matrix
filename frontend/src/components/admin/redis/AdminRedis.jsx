
import React, { useState } from 'react';
import { 
  Database, LayoutDashboard, Terminal, List, 
  Server, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import RedisDashboard from './RedisDashboard';
import RedisExplorer from './RedisExplorer';
import RedisTerminal from './RedisTerminal';

const AdminRedis = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explorer', label: 'Data Explorer', icon: List },
    { id: 'cli', label: 'Command Line', icon: Terminal },
    { id: 'cluster', label: 'Cluster', icon: Server },
    { id: 'config', label: 'Configuration', icon: Settings },
  ];

  const renderContent = () => {
    switch(activeTab) {
       case 'dashboard': return <RedisDashboard />;
       case 'explorer': return <RedisExplorer />;
       case 'cli': return <RedisTerminal />;
       case 'cluster': return <div className="p-10 text-center text-white/40">Cluster Management & Sharding (Coming Soon)</div>;
       default: return <div className="p-10 text-center text-white/40">Module loaded. Ready for configuration.</div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent text-white overflow-hidden rounded-tl-2xl border-l border-t border-white/10">
       {/* Header */}
       <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#DC382D] rounded flex items-center justify-center border border-[#DC382D]/20">
                <Database className="text-white" size={20} />
             </div>
             <h1 className="font-bold text-lg">Redis<span className="font-light opacity-60">Manager</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs">
             <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full border border-green-500/20 text-green-400">
                <Server size={12} />
                Connected: 127.0.0.1:6379
             </div>
             <div className="text-white/40">v7.0.5</div>
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
                         ? "bg-white/5 text-white border-[#DC382D]" 
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

export default AdminRedis;
