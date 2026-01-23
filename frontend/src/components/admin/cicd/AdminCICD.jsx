
import React, { useState } from 'react';
import { LayoutDashboard, GitMerge, Settings, ShieldAlert, Workflow } from 'lucide-react';
import { cn } from '@/lib/utils';
import CICDDashboard from './CICDDashboard';
import PipelineManager from './PipelineManager';

const AdminCICD = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipelines', label: 'Pipelines', icon: Workflow },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch(activeTab) {
       case 'dashboard': return <CICDDashboard />;
       case 'pipelines': return <PipelineManager />;
       case 'settings': return <div className="p-10 text-center text-white/40">CI/CD Configuration & Secrets Management</div>;
       default: return <div className="p-10 text-center text-white/40">Module loaded.</div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent text-white overflow-hidden rounded-tl-2xl border-l border-t border-white/10">
       {/* Header */}
       <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center border border-orange-600/20">
                <GitMerge className="text-white" size={20} />
             </div>
             <h1 className="font-bold text-lg">Infinity<span className="font-light opacity-60">Pipelines</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs">
             <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full border border-green-500/20 text-green-400">
                <ShieldAlert size={12} />
                Runner Status: Online
             </div>
          </div>
       </div>

       <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col py-4">
             {tabs.map(tab => (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={cn(
                      "flex items-center gap-3 px-6 py-3 text-sm transition-colors border-l-2",
                      activeTab === tab.id 
                         ? "bg-white/5 text-white border-orange-500" 
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

export default AdminCICD;
