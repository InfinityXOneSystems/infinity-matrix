
import React from 'react';
import { Settings, ExternalLink, RefreshCw, Shield } from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';

const HostingerDomains = () => {
  const { hostinger, hostingerActions } = useAdmin();

  return (
    <div className="bg-[#252526] rounded-xl border border-white/5 overflow-hidden">
       <div className="p-4 border-b border-white/5 bg-[#252526] flex items-center justify-between">
          <h3 className="font-bold text-white">Domain Management</h3>
          <Button size="sm" className="bg-[#673DE6] hover:bg-[#5835C4] text-white">Register New Domain</Button>
       </div>
       <div className="divide-y divide-white/5">
          {hostinger.domains.map(domain => (
             <div key={domain.id} className="p-4 hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded bg-[#673DE6]/20 flex items-center justify-center text-[#673DE6]">
                      <span className="font-bold text-lg">{domain.name.charAt(0).toUpperCase()}</span>
                   </div>
                   <div>
                      <div className="font-bold text-white">{domain.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                         Expires: {domain.expiry}
                         {domain.autoRenew && <span className="text-green-400 bg-green-500/10 px-1.5 rounded">Auto-Renew</span>}
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center gap-2 self-end md:self-auto">
                   <Button size="sm" variant="ghost" className="h-8 text-xs text-gray-400 hover:text-white border border-white/10">
                      <Shield size={12} className="mr-2" /> DNS
                   </Button>
                   <Button size="sm" variant="ghost" className="h-8 text-xs text-gray-400 hover:text-white border border-white/10" onClick={() => hostingerActions.renewDomain(domain.id)}>
                      <RefreshCw size={12} className="mr-2" /> Renew
                   </Button>
                   <Button size="sm" variant="ghost" className="h-8 text-xs text-gray-400 hover:text-white border border-white/10">
                      <Settings size={12} className="mr-2" /> Manage
                   </Button>
                   <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400">
                      <ExternalLink size={14} />
                   </Button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default HostingerDomains;
