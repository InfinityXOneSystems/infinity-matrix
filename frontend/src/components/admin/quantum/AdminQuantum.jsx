
import React, { useState } from 'react';
import { 
  Hammer, LayoutDashboard, Box, Settings, 
  PenTool, Shield, RefreshCw, LogIn, Key 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import QuantumDashboard from './QuantumDashboard';
import QuantumProjects from './QuantumProjects';
import QuantumBuilder from './QuantumBuilder';

const AdminQuantum = () => {
  const { quantum, quantumActions } = useAdmin();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Box },
    { id: 'builder', label: 'Visual Builder', icon: PenTool },
    { id: 'settings', label: 'Configuration', icon: Settings },
  ];

  if (!quantum.auth.isAuthenticated) {
     return (
        <div className="h-full flex flex-col items-center justify-center bg-transparent p-6 text-white">
           <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
              <div className="flex justify-center mb-6">
                 <div className="w-16 h-16 bg-[#0066FF]/10 rounded-2xl flex items-center justify-center text-[#0066FF] border border-[#0066FF]/20">
                    <Hammer size={32} />
                 </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">Connect Quantum X</h2>
              <p className="text-center text-white/40 text-sm mb-8">
                 Access the architectural engine. Enter your credentials to initialize the builder environment.
              </p>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-xs font-bold uppercase text-white/60 mb-2 block">Account Email</label>
                    <Input 
                       value={emailInput} 
                       onChange={(e) => setEmailInput(e.target.value)} 
                       placeholder="architect@infinity.ai" 
                       className="bg-black/20 border-white/10"
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold uppercase text-white/60 mb-2 block">Builder API Key</label>
                    <div className="relative">
                       <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                       <Input 
                          type="password"
                          value={apiKeyInput} 
                          onChange={(e) => setApiKeyInput(e.target.value)} 
                          placeholder="qxb_live_..." 
                          className="bg-black/20 border-white/10 pl-9"
                       />
                    </div>
                 </div>
                 <Button 
                    onClick={() => quantumActions.authenticate(apiKeyInput, emailInput)}
                    disabled={!apiKeyInput || !emailInput}
                    className="w-full bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold"
                 >
                    <LogIn size={16} className="mr-2" /> Initialize System
                 </Button>
              </div>
           </div>
        </div>
     );
  }

  const renderContent = () => {
    switch(activeTab) {
       case 'dashboard': return <QuantumDashboard />;
       case 'projects': return <QuantumProjects />;
       case 'builder': return <QuantumBuilder />;
       case 'settings': return <div className="p-10 text-center text-white/40">Builder Configuration & Template Management</div>;
       default: return <div className="p-10 text-center text-white/40">Module loaded.</div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent text-white overflow-hidden rounded-tl-2xl border-l border-t border-white/10">
       {/* Header */}
       <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#0066FF] rounded flex items-center justify-center border border-[#0066FF]/20">
                <Hammer className="text-white" size={20} />
             </div>
             <h1 className="font-bold text-lg">Quantum<span className="font-light opacity-60">Builder</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs">
             <Button variant="ghost" size="sm" onClick={() => quantumActions.sync()} className="text-white/40 hover:text-white h-7 gap-2">
                <RefreshCw size={12} /> Sync
             </Button>
             <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full border border-[#0066FF]/20 text-[#0066FF]">
                <Shield size={12} />
                Architect: {quantum.auth.email}
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
                         ? "bg-white/5 text-white border-[#0066FF]" 
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

export default AdminQuantum;
