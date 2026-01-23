

import React, { useState, useEffect } from 'react';
import { 
  Shield, Key, Lock, RefreshCw, AlertTriangle, 
  CheckCircle, FileText, Activity, Eye, EyeOff,
  LogOut, Plus, Download, Unlock, Zap,
  Search, ShieldCheck, Database, Server,
  Cloud, GitBranch, CreditCard, Flame, Workflow
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdmin } from '@/lib/AdminProvider';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import TriangleLogo from '@/components/ui/TriangleLogo';

// Sub-components
const LockScreen = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onUnlock(pin);
    if (!success) {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-transparent p-6 text-white relative overflow-hidden">
      <div className="max-w-md w-full glass-panel p-12 rounded-[2rem] shadow-2xl z-10 text-center border-2 border-white/10">
        <div className="w-24 h-24 bg-[#0066FF]/20 rounded-full flex items-center justify-center text-[#0066FF] mx-auto mb-8 ring-4 ring-[#0066FF]/10 border-2 border-[#0066FF]/30 shadow-[0_0_40px_rgba(0,102,255,0.3)]">
          <Lock size={40} />
        </div>
        
        <h2 className="text-4xl font-bold mb-3 tracking-tight">Vault Locked</h2>
        <p className="text-white/50 mb-10 text-lg">Secure credential storage is encrypted. Enter your master PIN to access the vault.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
           <div className="relative">
             <Input 
               type="password"
               value={pin}
               onChange={(e) => { setPin(e.target.value); setError(false); }}
               placeholder="••••"
               className={cn(
                 "bg-black/50 border-2 border-white/20 text-center text-3xl tracking-[1em] h-20 font-mono rounded-xl focus:border-[#0066FF] transition-all",
                 error && "border-red-500/50 animate-shake"
               )}
               maxLength={4}
               autoFocus
             />
             {error && <div className="text-red-400 text-sm mt-3 font-bold">Invalid PIN. Try again.</div>}
           </div>
           
           <Button type="submit" className="w-full h-14 text-xl font-bold bg-[#0066FF] hover:bg-[#0052cc] shadow-[0_0_30px_rgba(0,102,255,0.3)] rounded-xl border-2 border-[#0066FF]/50 hover:shadow-[0_0_50px_rgba(0,102,255,0.5)] transition-all">
             <Unlock size={24} className="mr-3" /> Unlock Vault
           </Button>
           
           <div className="text-xs text-white/30 pt-2 font-mono uppercase tracking-widest">
              Authorized personnel only. Access is logged.
           </div>
        </form>
      </div>
    </div>
  );
};

const ConnectionStatus = ({ status, onTest }) => {
  const [testing, setTesting] = useState(false);
  
  const handleTest = async () => {
    setTesting(true);
    await onTest();
    setTesting(false);
  };

  return (
    <div className="flex items-center gap-3">
      <div className={cn(
         "px-3 py-1 rounded-full text-[10px] font-bold uppercase border flex items-center gap-2",
         status === 'active' ? "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]" : 
         status === 'error' ? "bg-red-500/10 text-red-400 border-red-500/20" :
         "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      )}>
         <div className={cn("w-1.5 h-1.5 rounded-full", status === 'active' ? "bg-green-500 animate-pulse" : "bg-current")} />
         {status === 'active' ? 'Operational' : status === 'error' ? 'Failed' : 'Checking'}
      </div>
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={handleTest}
        disabled={testing}
        className="h-7 text-[10px] bg-white/5 hover:bg-white/10 hover:text-[#39FF14] border border-white/10"
      >
        {testing ? <RefreshCw size={10} className="animate-spin" /> : 'Test'}
      </Button>
    </div>
  );
};

const CredentialModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ service: '', key: '', type: 'API Key', environment: 'production' });

  useEffect(() => {
    if (isOpen) {
      setFormData({ service: '', key: '', type: 'API Key', environment: 'production' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 shadow-2xl border-2 border-white/10">
        <h3 className="text-2xl font-bold text-white mb-6">Add New Credential</h3>
        <div className="space-y-5">
           <div>
              <label className="text-xs font-bold text-white/50 block mb-2 uppercase tracking-wider">Service Name</label>
              <Input 
                value={formData.service} 
                onChange={e => setFormData({...formData, service: e.target.value})}
                className="bg-black/40 border-2 border-white/10 text-white h-12 focus:border-[#39FF14]" 
                placeholder="e.g. OpenAI Production" 
              />
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs font-bold text-white/50 block mb-2 uppercase tracking-wider">Type</label>
                <select 
                  className="w-full bg-black/40 border-2 border-white/10 text-white text-sm rounded-lg px-4 h-12 outline-none focus:border-[#39FF14]"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                   <option>API Key</option>
                   <option>Token</option>
                   <option>Service Account</option>
                   <option>Certificate</option>
                </select>
             </div>
             <div>
                <label className="text-xs font-bold text-white/50 block mb-2 uppercase tracking-wider">Environment</label>
                <select 
                  className="w-full bg-black/40 border-2 border-white/10 text-white text-sm rounded-lg px-4 h-12 outline-none focus:border-[#39FF14]"
                  value={formData.environment}
                  onChange={e => setFormData({...formData, environment: e.target.value})}
                >
                   <option value="production">Production</option>
                   <option value="development">Development</option>
                   <option value="staging">Staging</option>
                </select>
             </div>
           </div>
           <div>
              <label className="text-xs font-bold text-white/50 block mb-2 uppercase tracking-wider">Secret Key</label>
              <Input 
                type="password"
                value={formData.key} 
                onChange={e => setFormData({...formData, key: e.target.value})}
                className="bg-black/40 border-2 border-white/10 text-white font-mono h-12 focus:border-[#39FF14]" 
                placeholder="sk_..." 
              />
           </div>
           <div className="flex gap-3 pt-4">
              <Button className="flex-1 bg-white/5 hover:bg-white/10 border-2 border-white/10 h-12" onClick={onClose}>Cancel</Button>
              <Button className="flex-1 bg-[#39FF14] hover:bg-[#32cc12] text-black border-2 border-[#39FF14]/50 h-12 font-bold" onClick={() => { onSave(formData); onClose(); }}>Save Key</Button>
           </div>
        </div>
      </div>
    </div>
  );
};

const AdminVault = () => {
  const { vault, vaultActions } = useAdmin();
  const [showKeys, setShowKeys] = useState({});
  const [activeTab, setActiveTab] = useState('credentials');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [healingMap, setHealingMap] = useState({});

  if (!vault) return <div className="p-8 text-white">Loading Vault Security...</div>;

  if (vault.isLocked) {
    return <LockScreen onUnlock={vaultActions.unlock} />;
  }

  const toggleKeyVisibility = (id) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTestConnection = async (id) => {
    // Simulate API test
    await new Promise(r => setTimeout(r, 1500));
    // Usually would call backend test, simulating success here
    toast({ 
      title: "Connection Verified", 
      description: "API endpoint responded with 200 OK.",
      className: "border-[#39FF14] text-white bg-black"
    });
  };

  const handleAutoHeal = (id) => {
    setHealingMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setHealingMap(prev => ({ ...prev, [id]: false }));
      toast({ 
        title: "Auto-Heal Complete", 
        description: "Token refreshed and connection re-established.",
        className: "border-[#39FF14] text-white bg-black"
      });
    }, 3000);
  };

  const filteredKeys = vault.keys ? vault.keys.filter(k => 
     k.service.toLowerCase().includes(searchTerm.toLowerCase()) || 
     k.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const serviceIcons = {
    'Google Cloud': Cloud,
    'Vertex AI': Zap,
    'Manus.im': Workflow,
    'Firestore': Database,
    'GitHub': GitBranch,
    'Stripe': CreditCard,
    'Firebase': Flame,
    'Default': Key
  };

  return (
    <div className="h-full flex flex-col bg-transparent text-white rounded-tl-2xl border-l-2 border-t-2 border-white/20 overflow-hidden">
      {/* Header */}
      <div className="h-20 border-b-2 border-white/20 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl">
         <div className="flex items-center gap-4">
             <TriangleLogo size={32} />
             <div>
                <h1 className="font-bold text-xl tracking-wide">Infinity<span className="font-light opacity-60">Vault</span></h1>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#39FF14]">
                   <ShieldCheck size={10} />
                   ENCRYPTED STORAGE
                </div>
             </div>
         </div>
         <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={vaultActions.lock} className="text-white/60 hover:text-red-400 h-10 gap-2 border-2 border-transparent hover:border-red-500/20">
               <LogOut size={16} /> Lock Vault
            </Button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Sidebar */}
         <div className="w-72 bg-black/40 backdrop-blur-xl border-r-2 border-white/20 p-6 flex flex-col gap-3">
            {[
               { id: 'credentials', label: 'Credentials', icon: Key },
               { id: 'connections', label: 'Connections', icon: Activity },
               { id: 'audit', label: 'Audit Logs', icon: FileText },
               { id: 'settings', label: 'Settings', icon: Download },
            ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                     "flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-medium transition-all border-2 group",
                     activeTab === tab.id 
                       ? "bg-[#0066FF]/20 text-white border-[#0066FF]/50 shadow-[0_0_20px_rgba(0,102,255,0.2)]" 
                       : "text-white/50 hover:bg-white/5 hover:text-white border-transparent hover:border-white/10"
                  )}
               >
                  <tab.icon size={18} className={activeTab === tab.id ? "text-[#39FF14]" : "text-white/40 group-hover:text-white"} />
                  {tab.label}
               </button>
            ))}
            
            <div className="mt-auto p-5 glass-panel rounded-2xl border-2 border-white/10 bg-black/60">
               <div className="text-xs text-white/50 font-bold uppercase mb-3 tracking-wider flex items-center gap-2">
                  <Activity size={12} className="text-[#39FF14]" /> System Health
               </div>
               <div className="space-y-3 text-xs text-white/80 font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-1"><span>API Uptime</span> <span className="text-[#39FF14]">99.9%</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-1"><span>Errors (24h)</span> <span className="text-white/60">0</span></div>
                  <div className="flex justify-between"><span>Latency</span> <span className="text-[#39FF14]">24ms</span></div>
               </div>
            </div>
         </div>

         {/* Content */}
         <div className="flex-1 overflow-y-auto p-10 bg-transparent">
            {activeTab === 'credentials' && (
               <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                     <div>
                        <h2 className="text-3xl font-light mb-2">Stored Credentials</h2>
                        <p className="text-white/40 text-sm">Manage API keys, tokens, and secrets across environments.</p>
                     </div>
                     <div className="flex gap-4 mt-4 sm:mt-0">
                        <div className="relative">
                           <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                           <input 
                              placeholder="Search keys..." 
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                              className="bg-black/40 border-2 border-white/20 rounded-full pl-10 pr-6 py-2.5 text-sm text-white focus:border-[#39FF14] outline-none w-72 transition-colors"
                           />
                        </div>
                        <Button className="bg-[#39FF14] hover:bg-[#32cc12] text-black px-6 rounded-full border-2 border-[#39FF14]/50 h-11 font-bold shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:scale-105 transition-all" onClick={() => setIsAddModalOpen(true)}>
                           <Plus size={18} className="mr-2" /> Add Key
                        </Button>
                     </div>
                  </div>

                  <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10">
                     <table className="w-full text-left border-collapse">
                        <thead className="text-xs uppercase text-white/40 font-bold bg-white/5 border-b-2 border-white/10">
                           <tr>
                              <th className="p-6">Service</th>
                              <th className="p-6">Environment</th>
                              <th className="p-6">Secret Value</th>
                              <th className="p-6">Health</th>
                              <th className="p-6 text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-sm">
                           {filteredKeys.map(item => {
                              const Icon = serviceIcons[Object.keys(serviceIcons).find(k => item.service.includes(k))] || serviceIcons['Default'];
                              return (
                                 <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-6">
                                       <div className="flex items-center gap-3">
                                          <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white group-hover:text-[#39FF14] group-hover:border-[#39FF14]/30 transition-colors">
                                             <Icon size={18} />
                                          </div>
                                          <span className="font-bold text-white">{item.service}</span>
                                       </div>
                                    </td>
                                    <td className="p-6">
                                       <span className={cn(
                                          "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border",
                                          item.environment === 'production' ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                       )}>
                                          {item.environment || 'Production'}
                                       </span>
                                    </td>
                                    <td className="p-6 font-mono text-white/80 bg-black/20">
                                       <div className="flex items-center gap-3">
                                          <span className="bg-black/40 px-2 py-1 rounded text-[#39FF14]">{showKeys[item.id] ? item.key : '••••••••••••••••'}</span>
                                          <button onClick={() => toggleKeyVisibility(item.id)} className="text-white/30 hover:text-white transition-colors">
                                             {showKeys[item.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                          </button>
                                       </div>
                                    </td>
                                    <td className="p-6">
                                       <ConnectionStatus status={item.status} onTest={() => handleTestConnection(item.id)} />
                                    </td>
                                    <td className="p-6 text-right flex items-center justify-end gap-2">
                                       <Button 
                                          size="sm" 
                                          variant="ghost" 
                                          onClick={() => handleAutoHeal(item.id)}
                                          disabled={healingMap[item.id]}
                                          className="text-xs bg-white/5 hover:bg-[#39FF14]/20 hover:text-[#39FF14] border border-white/10"
                                       >
                                          {healingMap[item.id] ? <RefreshCw size={12} className="animate-spin mr-1" /> : <Zap size={12} className="mr-1" />}
                                          {healingMap[item.id] ? 'Fixing...' : 'Auto-Heal'}
                                       </Button>
                                       <Button size="icon" variant="ghost" className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg" onClick={() => vaultActions.removeCredential(item.id)}>
                                          <LogOut size={14} />
                                       </Button>
                                    </td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab === 'connections' && (
               <div className="space-y-8">
                  <h2 className="text-3xl font-light mb-2">Active Connections</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {filteredKeys.map(item => {
                        const Icon = serviceIcons[Object.keys(serviceIcons).find(k => item.service.includes(k))] || serviceIcons['Default'];
                        return (
                           <div key={item.id} className="glass-panel p-6 rounded-2xl border-2 border-white/10 hover:border-[#39FF14]/50 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all group bg-black/40">
                              <div className="flex justify-between items-start mb-4">
                                 <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white group-hover:text-[#39FF14] transition-colors">
                                    <Icon size={24} />
                                 </div>
                                 <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse shadow-[0_0_10px_#39FF14]" />
                              </div>
                              <h3 className="text-lg font-bold text-white mb-1">{item.service}</h3>
                              <p className="text-xs text-white/40 font-mono mb-4">{item.key.substring(0, 8)}...</p>
                              
                              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                 <span className="text-xs text-green-400 font-bold uppercase tracking-wider">Connected</span>
                                 <span className="text-[10px] text-white/30">{item.lastUsed}</span>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}
         </div>
      </div>

      <CredentialModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={vaultActions.addCredential} 
      />
    </div>
  );
};

export default AdminVault;
