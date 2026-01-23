
import React, { useState } from 'react';
import { 
  LayoutDashboard, Workflow, Shield, Settings, 
  Terminal, RefreshCw, Key, LogIn
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ManusDashboard from './ManusDashboard';
import ManusWorkflows from './ManusWorkflows';
import ManusTools from './ManusTools';

const AdminManus = () => {
  const { manus, manusActions } = useAdmin();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'tools', label: 'Tools', icon: Terminal },
    { id: 'settings', label: 'Configuration', icon: Settings },
  ];

  // Defensive check for auth state
  const isAuth = manus?.auth?.isAuthenticated;

  if (!isAuth) {
     return (
        <div className="h-full flex flex-col items-center justify-center bg-transparent p-6 text-white">
           <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
              <div className="flex justify-center mb-6">
                 <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                    <Workflow size={32} />
                 </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">Connect Manus</h2>
              <p className="text-center text-white/40 text-sm mb-8">
                 Enter your credentials to mirror your manus.im environment within Infinity Admin.
              </p>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-xs font-bold uppercase text-white/60 mb-2 block">Account Email</label>
                    <Input 
                       value={emailInput} 
                       onChange={(e) => setEmailInput(e.target.value)} 
                       placeholder="admin@company.com" 
                       className="bg-black/20 border-white/10"
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold uppercase text-white/60 mb-2 block">API Key</label>
                    <div className="relative">
                       <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                       <Input 
                          type="password"
                          value={apiKeyInput} 
                          onChange={(e) => setApiKeyInput(e.target.value)} 
                          placeholder="mns_live_..." 
                          className="bg-black/20 border-white/10 pl-9"
                       />
                    </div>
                 </div>
                 <Button 
                    onClick={() => manusActions.authenticate(apiKeyInput, emailInput)}
                    disabled={!apiKeyInput || !emailInput}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold"
                 >
                    <LogIn size={16} className="mr-2" /> Authenticate Mirror
                 </Button>
              </div>
           </div>
        </div>
     );
  }

  const renderContent = () => {
    switch(activeTab) {
       case 'dashboard': return <ManusDashboard />;
       case 'workflows': return <ManusWorkflows />;
       case 'tools': return <ManusTools />;
       case 'settings': return <div className="p-10 text-center text-white/40">Sync Settings & Webhook Configuration</div>;
       default: return <div className="p-10 text-center text-white/40">Module loaded.</div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent text-white overflow-hidden rounded-tl-2xl border-l border-t border-white/10">
       {/* Header */}
       <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-yellow-600 rounded flex items-center justify-center border border-yellow-600/20">
                <Workflow className="text-white" size={20} />
             </div>
             <h1 className="font-bold text-lg">Manus<span className="font-light opacity-60">Mirror</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs">
             <Button variant="ghost" size="sm" onClick={() => manusActions.sync()} className="text-white/40 hover:text-white h-7 gap-2">
                <RefreshCw size={12} /> Sync Now
             </Button>
             <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full border border-yellow-500/20 text-yellow-400">
                <Shield size={12} />
                Connected: {manus?.auth?.email || 'N/A'}
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
                         ? "bg-white/5 text-white border-yellow-500" 
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

export default AdminManus;
