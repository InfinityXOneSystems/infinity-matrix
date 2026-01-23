
import React from 'react';
import { Cloud, Server, Database, Shield, Activity } from 'lucide-react';

const AdminCloudConsole = () => {
  const resources = [
    { id: "vm-neural-1", type: "Compute Engine", region: "us-central1", status: "running", cpu: "85%" },
    { id: "db-vectors-prod", type: "Cloud SQL", region: "us-east1", status: "ok", cpu: "12%" },
    { id: "k8s-cluster-main", type: "GKE Cluster", region: "us-west1", status: "scaling", cpu: "64%" },
  ];

  return (
    <div className="h-full p-8 text-white overflow-y-auto">
      <div className="flex items-center gap-4 mb-8 p-6 glass-panel rounded-2xl bg-black/40">
        <div className="p-3 bg-[#4285F4]/20 rounded-xl text-[#4285F4] border-2 border-[#4285F4]/30">
          <Cloud size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-light tracking-wide">Google Cloud Platform</h2>
          <div className="flex items-center gap-3 text-sm text-white/50 mt-1 font-mono">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
             Project: infinity-x-production
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="glass-panel p-6 bg-black/40 rounded-2xl border-2 border-white/10">
            <div className="text-xs text-white/40 uppercase mb-2 font-bold tracking-wider">Monthly Cost</div>
            <div className="text-3xl font-mono text-white font-bold">$12,450.00</div>
         </div>
         <div className="glass-panel p-6 bg-black/40 rounded-2xl border-2 border-white/10">
            <div className="text-xs text-white/40 uppercase mb-2 font-bold tracking-wider">Active Instances</div>
            <div className="text-3xl font-mono text-white font-bold">42</div>
         </div>
         <div className="glass-panel p-6 bg-black/40 rounded-2xl border-2 border-white/10">
            <div className="text-xs text-white/40 uppercase mb-2 font-bold tracking-wider">Health Score</div>
            <div className="text-3xl font-mono text-green-400 font-bold">98/100</div>
         </div>
      </div>

      <h3 className="text-lg font-bold text-white/70 uppercase mb-6 tracking-widest pl-2">Resource Inventory</h3>
      <div className="space-y-4">
         {resources.map((res) => (
            <div key={res.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 glass-panel bg-black/40 rounded-2xl hover:border-[#4285F4]/50 transition-colors group">
               <div className="flex items-center gap-6">
                  <div className={`p-3 rounded-xl bg-white/5 border-2 border-white/10 group-hover:border-white/30 transition-colors ${res.type.includes('SQL') ? 'text-blue-400' : 'text-yellow-400'}`}>
                     {res.type.includes('SQL') ? <Database size={24} /> : <Server size={24} />}
                  </div>
                  <div>
                     <div className="font-mono text-lg font-bold text-white mb-1">{res.id}</div>
                     <div className="text-sm text-white/40 flex items-center gap-2">
                        <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{res.type}</span>
                        <span>• {res.region}</span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-8 mt-4 md:mt-0">
                  <div className="text-sm font-mono text-white/60 bg-black/20 px-4 py-2 rounded-lg border border-white/5">
                     CPU: <span className={parseInt(res.cpu) > 80 ? "text-red-400 font-bold" : "text-green-400 font-bold"}>{res.cpu}</span>
                  </div>
                  <div className="px-4 py-1.5 rounded-lg text-xs uppercase font-bold bg-green-500/10 text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                     {res.status}
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default AdminCloudConsole;
