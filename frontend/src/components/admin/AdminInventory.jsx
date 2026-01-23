
import React from 'react';
import { Package, Search, Filter, MoreVertical } from 'lucide-react';

const AdminInventory = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">System Inventory</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-[#39FF14] outline-none w-64"
            />
          </div>
          <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="glass-panel border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-xs uppercase text-white/40 font-bold">
            <tr>
              <th className="p-4">Asset Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last Updated</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#0066FF]/20 flex items-center justify-center text-[#0066FF]">
                    <Package size={16} />
                  </div>
                  <span className="text-white font-medium">Neural Core v{i}.0</span>
                </td>
                <td className="p-4 text-white/60">Hardware Node</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
                    Operational
                  </span>
                </td>
                <td className="p-4 text-white/40 text-sm font-mono">2024-03-1{i}</td>
                <td className="p-4 text-right">
                  <button className="text-white/40 hover:text-white">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;
