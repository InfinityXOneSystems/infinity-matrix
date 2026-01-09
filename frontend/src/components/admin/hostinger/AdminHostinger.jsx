
import React, { useState } from 'react';
import { 
  Globe, LayoutDashboard, Server, Shield, 
  Settings, Key, LogIn, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import HostingerDashboard from './HostingerDashboard';
import HostingerDomains from './HostingerDomains';
import HostingerHosting from './HostingerHosting';

const AdminHostinger = () => {
  const { hostinger, hostingerActions } = useAdmin();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'domains', label: 'Domains', icon: Globe },
    { id: 'hosting', label: 'Hosting', icon: Server },
    { id: 'dns', label: 'DNS Zone', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!hostinger.auth.isAuthenticated) {
     return (
        <div className="h-full flex flex-col items-center justify-center bg-transparent p-6 text-white">
           <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
              <div className="flex justify-center mb-6">
                 <div className="w-16 h-16 bg-[#673DE6]/10 rounded-2xl flex items-center justify-center text-[#673DE6] border border-[#673DE6]/20">
                    <Globe size={32} />
                 </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">Connect Hostinger</h2>
              <p className="text-center text-white/40 text-sm mb-8">
                 Access your hPanel directly. Enter your credentials to sync domains and hosting.
              </p>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-xs font-bold uppercase text-white/60 mb-2 block">Account Email</label>
                    <Input 
                       value={emailInput} 
                       onChange={(e) => setEmailInput(e.target.value)} 
                       placeholder="user@example.com" 
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
                          placeholder="hst_live_..." 
                          className="bg-black/20 border-white/10 pl-9"
                       />
                    </div>
                 </div>
                 <Button 
                    onClick={() => hostingerActions.authenticate(apiKeyInput, emailInput)}
                    disabled={!apiKeyInput || !emailInput}
                    className="w-full bg-[#673DE6] hover:bg-[#5835C4] text-white font-bold"
                 >
                    <LogIn size={16} className="mr-2" /> Connect hPanel
                 </Button>
              </div>
           </div>
        </div>
     );
  }

  const renderContent = () => {
    switch(activeTab) {
       case 'dashboard': return <HostingerDashboard />;
       case 'domains': return <HostingerDomains />;
       case 'hosting': return <HostingerHosting />;
       case 'dns': return <div className="p-10 text-center text-white/40">DNS Zone Editor (Loading Records...)</div>;
       case 'settings': return <div className="p-10 text-center text-white/40">Sync & Backup Settings</div>;
       default: return <div className="p-10 text-center text-white/40">Module loaded.</div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent text-white overflow-hidden rounded-tl-2xl border-l border-t border-white/10">
       {/* Header */}
       <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#673DE6] rounded flex items-center justify-center border border-[#673DE6]/20">
                <Globe className="text-white" size={20} />
             </div>
             <h1 className="font-bold text-lg">Hostinger<span className="font-light opacity-60">Connect</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs">
             <Button variant="ghost" size="sm" onClick={() => hostingerActions.sync()} className="text-white/40 hover:text-white h-7 gap-2">
                <RefreshCw size={12} /> Sync
             </Button>
             <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full border border-[#673DE6]/20 text-[#673DE6]">
                <Shield size={12} />
                User: {hostinger.auth.email}
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
                         ? "bg-white/5 text-white border-[#673DE6]" 
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

export default AdminHostinger;
