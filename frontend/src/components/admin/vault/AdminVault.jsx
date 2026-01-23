
import React, { useState, useEffect } from 'react';
import { 
  Shield, Key, Lock, RefreshCw, AlertTriangle, 
  CheckCircle, FileText, Activity, Eye, EyeOff,
  LogOut, Plus, Download, Unlock, Zap,
  Search, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdmin } from '@/lib/AdminProvider';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

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
      <div className="max-w-md w-full glass-panel p-10 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl z-10 text-center">
        <div className="w-20 h-20 bg-[#0066FF]/20 rounded-full flex items-center justify-center text-[#0066FF] mx-auto mb-6 ring-4 ring-[#0066FF]/10 border border-[#0066FF]/20">
          <Lock size={32} />
        </div>
        
        <h2 className="text-3xl font-bold mb-2">Vault Locked</h2>
        <p className="text-white/40 mb-8">Secure credential storage is encrypted. Enter your master PIN to access the vault.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="relative">
             <Input 
               type="password"
               value={pin}
               onChange={(e) => { setPin(e.target.value); setError(false); }}
               placeholder="••••"
               className={cn(
                 "bg-black/30 border-white/10 text-center text-2xl tracking-[1em] h-16 font-mono",
                 error && "border-red-500/50 animate-shake"
               )}
               maxLength={4}
               autoFocus
             />
             {error && <div className="text-red-400 text-xs mt-2 font-bold">Invalid PIN. Try again.</div>}
           </div>
           
           <Button type="submit" className="w-full h-12 text-lg font-bold bg-[#0066FF] hover:bg-[#0052cc] shadow-lg shadow-blue-900/20">
             <Unlock size={20} className="mr-2" /> Unlock Vault
           </Button>
           
           <div className="text-xs text-white/30 pt-4">
              Authorized personnel only. Access is logged.
           </div>
        </form>
      </div>
    </div>
  );
};

const CredentialModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ service: '', key: '', type: 'API Key' });

  useEffect(() => {
    if (isOpen) {
      setFormData({ service: '', key: '', type: 'API Key' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/90 border border-white/10 rounded-xl p-6 shadow-2xl backdrop-blur-xl">
        <h3 className="text-lg font-bold text-white mb-4">Add New Credential</h3>
        <div className="space-y-4">
           <div>
              <label className="text-xs text-white/40 block mb-1">Service Name</label>
              <Input 
                value={formData.service} 
                onChange={e => setFormData({...formData, service: e.target.value})}
                className="bg-black/40 border-white/10 text-white" 
                placeholder="e.g. OpenAI Production" 
              />
           </div>
           <div>
              <label className="text-xs text-white/40 block mb-1">Credential Type</label>
              <select 
                className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-md px-3 py-2 outline-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                 <option>API Key</option>
                 <option>Token</option>
                 <option>Password</option>
                 <option>Certificate</option>
              </select>
           </div>
           <div>
              <label className="text-xs text-white/40 block mb-1">Secret Key</label>
              <Input 
                type="password"
                value={formData.key} 
                onChange={e => setFormData({...formData, key: e.target.value})}
                className="bg-black/40 border-white/10 text-white font-mono" 
                placeholder="sk_..." 
              />
           </div>
           <div className="flex gap-2 pt-4">
              <Button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10" onClick={onClose}>Cancel</Button>
              <Button className="flex-1 bg-[#0066FF] hover:bg-[#0052cc]" onClick={() => { onSave(formData); onClose(); }}>Save Key</Button>
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

  if (!vault) return <div className="p-8 text-white">Loading Vault Security...</div>;

  if (vault.isLocked) {
    return <LockScreen onUnlock={vaultActions.unlock} />;
  }

  const toggleKeyVisibility = (id) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredKeys = vault.keys ? vault.keys.filter(k => 
     k.service.toLowerCase().includes(searchTerm.toLowerCase()) || 
     k.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="h-full flex flex-col bg-transparent text-white rounded-tl-2xl border-l border-t border-white/10 overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/40 backdrop-blur-xl">
         <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center border border-blue-600/20">
                <Shield className="text-white" size={20} />
             </div>
             <h1 className="font-bold text-lg">Infinity<span className="font-light opacity-60">Vault</span></h1>
             <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20 flex items-center gap-1">
                <ShieldCheck size={10} /> ENCRYPTED
             </span>
         </div>
         <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={vaultActions.lock} className="text-white/40 hover:text-red-400 h-8 gap-2">
               <LogOut size={14} /> Lock Vault
            </Button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Sidebar */}
         <div className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col gap-2">
            {[
               { id: 'credentials', label: 'Credentials', icon: Key },
               { id: 'audit', label: 'Audit Logs', icon: FileText },
               { id: 'integrations', label: 'Integrations', icon: Zap },
               { id: 'settings', label: 'Settings', icon: Download },
            ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                     "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
                     activeTab === tab.id ? "bg-[#0066FF]/20 text-white border border-[#0066FF]/50" : "text-white/40 hover:bg-white/5 hover:text-white border border-transparent"
                  )}
               >
                  <tab.icon size={16} />
                  {tab.label}
               </button>
            ))}
            
            <div className="mt-auto p-4 glass-panel bg-black/40 rounded-xl border border-white/10">
               <div className="text-xs text-white/50 font-bold uppercase mb-2">Policy Status</div>
               <div className="space-y-2 text-xs text-white/70">
                  <div className="flex justify-between"><span>Auto-Lock</span> <span>15m</span></div>
                  <div className="flex justify-between"><span>Rotation</span> <span>30d</span></div>
                  <div className="flex justify-between"><span>Encryption</span> <span>AES-256</span></div>
               </div>
            </div>
         </div>

         {/* Content */}
         <div className="flex-1 overflow-y-auto p-8 bg-transparent">
            {activeTab === 'credentials' && (
               <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                     <div>
                        <h2 className="text-2xl font-light mb-1">Stored Credentials</h2>
                        <p className="text-white/40 text-sm">Manage API keys, tokens, and secrets.</p>
                     </div>
                     <div className="flex gap-3 mt-4 sm:mt-0">
                        <div className="relative">
                           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                           <input 
                              placeholder="Search keys..." 
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                              className="bg-black/40 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:border-blue-500 outline-none w-64"
                           />
                        </div>
                        <Button className="bg-[#0066FF] hover:bg-[#0052cc]" onClick={() => setIsAddModalOpen(true)}>
                           <Plus size={16} className="mr-2" /> Add Key
                        </Button>
                     </div>
                  </div>

                  <div className="glass-panel rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden shadow-xl">
                     <table className="w-full text-left">
                        <thead className="text-xs uppercase text-white/40 font-semibold bg-white/5 border-b border-white/10">
                           <tr>
                              <th className="p-4">Service</th>
                              <th className="p-4">Type</th>
                              <th className="p-4">Secret Value</th>
                              <th className="p-4">Status</th>
                              <th className="p-4">Last Used</th>
                              <th className="p-4 text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                           {filteredKeys.map(item => (
                              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                 <td className="p-4 font-medium text-white">{item.service}</td>
                                 <td className="p-4 text-white/60 text-xs">{item.type}</td>
                                 <td className="p-4 font-mono text-white/60">
                                    <div className="flex items-center gap-2">
                                       {showKeys[item.id] ? item.key : '••••••••••••••••'}
                                       <button onClick={() => toggleKeyVisibility(item.id)} className="text-white/20 hover:text-white transition-colors">
                                          {showKeys[item.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                       </button>
                                    </div>
                                 </td>
                                 <td className="p-4">
                                    <div className={cn(
                                       "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                                       item.status === 'active' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                    )}>
                                       {item.status === 'active' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                                       {item.status}
                                    </div>
                                 </td>
                                 <td className="p-4 text-white/40 text-xs">{item.lastUsed}</td>
                                 <td className="p-4 text-right flex items-center justify-end gap-2">
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-white/50 hover:text-blue-400" onClick={() => vaultActions.rotateKey(item.id)} title="Rotate Key">
                                       <RefreshCw size={12} />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-white/50 hover:text-red-400" onClick={() => vaultActions.removeCredential(item.id)} title="Delete">
                                       <LogOut size={12} />
                                    </Button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                     {filteredKeys.length === 0 && (
                        <div className="p-8 text-center text-white/40">No credentials found matching your search.</div>
                     )}
                  </div>
               </div>
            )}

            {activeTab === 'audit' && (
               <div className="space-y-6">
                  <h2 className="text-2xl font-light mb-1">Access Logs</h2>
                  <div className="glass-panel rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden shadow-xl">
                     <div className="p-4 border-b border-white/10 bg-white/5 font-mono text-xs text-white/40 flex gap-4">
                        <span className="w-40">TIMESTAMP</span>
                        <span className="w-24">ACTION</span>
                        <span className="w-24">STATUS</span>
                        <span className="flex-1">TARGET RESOURCE</span>
                     </div>
                     <div className="divide-y divide-white/5">
                        {vault.logs.map((log, i) => (
                           <div key={i} className="p-4 flex gap-4 text-sm hover:bg-white/5 font-mono">
                              <span className="w-40 text-white/50 text-xs">{new Date(log.time).toLocaleTimeString()}</span>
                              <span className="w-24 text-blue-400 font-bold">{log.action.toUpperCase()}</span>
                              <span className="w-24 text-green-400">{log.status}</span>
                              <span className="flex-1 text-white">{log.target}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'integrations' && (
               <div className="space-y-6">
                  <h2 className="text-2xl font-light mb-1">MCP Connections</h2>
                  <p className="text-white/40 text-sm mb-6">Model Context Protocol allows authenticated agents to securely request credentials.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {vault.mcp.connectedAgents.map((agent, i) => (
                        <div key={i} className="glass-panel p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md relative overflow-hidden shadow-lg group hover:border-[#0066FF]/30 transition-all">
                           <div className="absolute top-0 right-0 p-2 opacity-50"><Zap className="text-yellow-500" size={64} /></div>
                           <h3 className="text-lg font-bold text-white relative z-10">{agent}</h3>
                           <div className="mt-2 flex items-center gap-2 text-xs text-green-400 relative z-10">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse border border-green-500/50" /> Connected
                           </div>
                           <p className="text-xs text-white/50 mt-4 relative z-10">
                              Permitted to access: <span className="text-white">Read-Only</span>
                           </p>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {activeTab === 'settings' && (
               <div className="space-y-6">
                  <h2 className="text-2xl font-light mb-1">Vault Settings</h2>
                  <div className="glass-panel p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md space-y-6 max-w-2xl shadow-xl">
                     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/5">
                        <div>
                           <div className="font-bold text-white">Export Vault Data</div>
                           <div className="text-xs text-white/50">Download an encrypted JSON backup of all keys.</div>
                        </div>
                        <Button variant="outline" onClick={vaultActions.exportData} className="border-white/10 text-white gap-2 bg-white/5 hover:bg-white/10 mt-4 sm:mt-0">
                           <Download size={14} /> Export
                        </Button>
                     </div>
                     <div className="flex items-center justify-between pt-6">
                        <div>
                           <div className="font-bold text-white">Auto-Lock Timer</div>
                           <div className="text-xs text-white/50">Lock vault after inactivity (minutes).</div>
                        </div>
                        <input className="w-16 bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-center" defaultValue="15" />
                     </div>
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
