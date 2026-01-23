
import React, { useState } from 'react';
import { 
  LayoutDashboard, Server, Layers, Network, 
  Database, ShipWheel, Settings, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import KubernetesDashboard from './KubernetesDashboard';
import KubernetesWorkloads from './KubernetesWorkloads';
import KubernetesClusters from './KubernetesClusters';

// Placeholders for sections not fully implemented in detail to save space but ensure functionality
const KubernetesServices = () => <div className="p-10 text-center text-white/40">Service & Ingress Management Module</div>;
const KubernetesStorage = () => <div className="p-10 text-center text-white/40">Persistent Volume Management Module</div>;
const KubernetesHelm = () => <div className="p-10 text-center text-white/40">Helm Chart Repository</div>;

const AdminKubernetes = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clusters', label: 'Clusters', icon: Server },
    { id: 'workloads', label: 'Workloads', icon: Layers },
    { id: 'network', label: 'Services & Ingress', icon: Network },
    { id: 'storage', label: 'Storage', icon: Database },
    { id: 'helm', label: 'Helm Charts', icon: ShipWheel },
  ];

  const renderContent = () => {
    switch(activeTab) {
       case 'dashboard': return <KubernetesDashboard />;
       case 'clusters': return <KubernetesClusters />;
       case 'workloads': return <KubernetesWorkloads />;
       case 'network': return <KubernetesServices />;
       case 'storage': return <KubernetesStorage />;
       case 'helm': return <KubernetesHelm />;
       default: return <div className="p-10 text-center text-white/40">Module loaded.</div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent text-white overflow-hidden rounded-tl-2xl border-l border-t border-white/10">
       {/* K8s Header */}
       <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#326ce5] rounded flex items-center justify-center border border-[#326ce5]/20">
                <ShipWheel className="text-white" size={20} />
             </div>
             <h1 className="font-bold text-lg">Kubernetes<span className="font-light opacity-60">Engine</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs">
             <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full border border-blue-500/20 text-blue-400">
                <Globe size={12} />
                context: gke-vision-prod
             </div>
          </div>
       </div>

       <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-56 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col py-4">
             {tabs.map(tab => (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={cn(
                      "flex items-center gap-3 px-6 py-3 text-sm transition-colors border-l-2",
                      activeTab === tab.id 
                         ? "bg-white/5 text-white border-[#326ce5]" 
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

export default AdminKubernetes;
