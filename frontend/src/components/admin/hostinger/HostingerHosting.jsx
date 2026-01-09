
import React from 'react';
import { Server, Database, Folder, Mail, Cloud, Globe } from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';

const HostingerHosting = () => {
  const { hostinger, hostingerActions } = useAdmin();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {hostinger.hosting.map(account => (
          <div key={account.id} className="bg-[#252526] rounded-xl border border-white/5 overflow-hidden">
             <div className="p-6 bg-gradient-to-r from-[#673DE6]/10 to-transparent border-b border-white/5">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#673DE6] rounded text-white">
                         <Cloud size={20} />
                      </div>
                      <div>
                         <h3 className="font-bold text-white">{account.domain}</h3>
                         <p className="text-xs text-[#673DE6] font-bold uppercase">{account.plan}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Globe size={12} /> {account.location}
                   </div>
                </div>
             </div>
             
             <div className="p-6 grid grid-cols-2 gap-4">
                <Button variant="outline" className="border-white/10 hover:bg-white/5 flex flex-col h-20 items-center justify-center gap-2">
                   <Folder size={20} className="text-yellow-400" />
                   <span className="text-xs text-white">File Manager</span>
                </Button>
                <Button variant="outline" className="border-white/10 hover:bg-white/5 flex flex-col h-20 items-center justify-center gap-2">
                   <Database size={20} className="text-blue-400" />
                   <span className="text-xs text-white">Databases</span>
                </Button>
                <Button variant="outline" className="border-white/10 hover:bg-white/5 flex flex-col h-20 items-center justify-center gap-2">
                   <Mail size={20} className="text-red-400" />
                   <span className="text-xs text-white">Emails</span>
                </Button>
                <Button variant="outline" className="border-white/10 hover:bg-white/5 flex flex-col h-20 items-center justify-center gap-2" onClick={() => hostingerActions.backup(account.id)}>
                   <Server size={20} className="text-green-400" />
                   <span className="text-xs text-white">Backups</span>
                </Button>
             </div>
             
             <div className="px-6 pb-6 pt-2">
                <div className="text-xs text-gray-500 mb-2 font-bold uppercase">Resource Usage</div>
                <div className="flex items-center gap-4 text-xs text-gray-300">
                   <div className="flex-1">
                      <div className="flex justify-between mb-1"><span>Disk</span> <span>{account.usage.disk}</span></div>
                      <div className="w-full bg-white/10 h-1 rounded-full"><div className="bg-blue-500 h-full" style={{width: account.usage.disk}} /></div>
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between mb-1"><span>Bandwidth</span> <span>{account.usage.bandwidth}</span></div>
                      <div className="w-full bg-white/10 h-1 rounded-full"><div className="bg-purple-500 h-full" style={{width: account.usage.bandwidth}} /></div>
                   </div>
                </div>
             </div>
          </div>
       ))}
    </div>
  );
};

export default HostingerHosting;
