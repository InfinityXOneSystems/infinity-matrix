
import React from 'react';
import { 
  Globe, Server, Mail, Database, 
  ShieldCheck, ArrowUpRight 
} from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';

const HostingerDashboard = () => {
  const { hostinger } = useAdmin();

  const stats = [
    { label: 'Domains', value: hostinger.stats.totalDomains, icon: Globe, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { label: 'Hosting Plans', value: hostinger.stats.totalHosting, icon: Server, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'Email Accounts', value: hostinger.stats.emails, icon: Mail, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { label: 'SSL Status', value: hostinger.stats.ssl, icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-500/20' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-[#252526] rounded-xl border border-white/5 relative overflow-hidden group">
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                   <stat.icon size={24} />
                </div>
                <div className="p-1 rounded bg-white/5 hover:bg-white/10 cursor-pointer text-gray-400 hover:text-white">
                   <ArrowUpRight size={16} />
                </div>
             </div>
             <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
             <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Domains Overview */}
         <div className="bg-[#252526] rounded-xl border border-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <Globe size={18} className="text-purple-400" /> Recent Domains
            </h3>
            <div className="space-y-3">
               {hostinger.domains.slice(0, 3).map(domain => (
                  <div key={domain.id} className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                     <div>
                        <div className="font-bold text-white text-sm">{domain.name}</div>
                        <div className="text-xs text-gray-500">Expires: {domain.expiry}</div>
                     </div>
                     <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                        domain.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                     }`}>
                        {domain.status}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Hosting Health */}
         <div className="bg-[#252526] rounded-xl border border-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <Server size={18} className="text-blue-400" /> System Health
            </h3>
            <div className="space-y-4">
               {hostinger.hosting.map(h => (
                  <div key={h.id} className="p-3 bg-black/20 rounded border border-white/5">
                     <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-white text-sm">{h.domain}</div>
                        <div className="text-xs text-green-400 flex items-center gap-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Running
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                           <div className="text-gray-500 mb-1">Disk Usage</div>
                           <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-blue-500 h-full" style={{ width: h.usage.disk }} />
                           </div>
                           <div className="mt-1 text-right text-white/60">{h.usage.disk}</div>
                        </div>
                        <div>
                           <div className="text-gray-500 mb-1">Bandwidth</div>
                           <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-purple-500 h-full" style={{ width: h.usage.bandwidth }} />
                           </div>
                           <div className="mt-1 text-right text-white/60">{h.usage.bandwidth}</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default HostingerDashboard;
