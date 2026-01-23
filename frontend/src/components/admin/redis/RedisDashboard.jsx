
import React from 'react';
import { Database, Zap, Activity, Users, Server, Clock } from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';

const RedisDashboard = () => {
  const { redis } = useAdmin();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-red-500/20 text-red-400">
                  <Database size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-red-500/10 text-red-400">Memory</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{redis.stats.used_memory_human}</div>
            <div className="text-sm text-gray-400">Used Memory</div>
         </div>
         
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
                  <Zap size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-green-500/10 text-green-400">Fast</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{redis.stats.ops_per_sec}</div>
            <div className="text-sm text-gray-400">Ops / Sec</div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                  <Users size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400">{redis.stats.total_connections}</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{redis.stats.hit_rate}</div>
            <div className="text-sm text-gray-400">Keyspace Hit Rate</div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                  <Server size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-purple-500/10 text-purple-400">Cluster</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{redis.cluster.length} Nodes</div>
            <div className="text-sm text-gray-400">Shards Active</div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5 h-80 flex flex-col justify-center items-center text-gray-500">
            <Activity className="mb-4 opacity-20" size={48} />
            <p>Throughput & Latency Visualization</p>
         </div>
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5 h-80 overflow-y-auto font-mono text-xs">
            <div className="mb-2 text-gray-400 font-bold uppercase sticky top-0 bg-[#252526] pb-2">Redis Info & Stats</div>
            <div className="space-y-2">
               <div className="flex justify-between border-b border-white/5 pb-1"><span>uptime_in_days</span><span className="text-white">{redis.stats.uptime}</span></div>
               <div className="flex justify-between border-b border-white/5 pb-1"><span>role</span><span className="text-green-400">master</span></div>
               <div className="flex justify-between border-b border-white/5 pb-1"><span>connected_clients</span><span className="text-white">{redis.stats.total_connections}</span></div>
               <div className="flex justify-between border-b border-white/5 pb-1"><span>used_memory_peak_human</span><span className="text-white">{redis.stats.peak_memory_human}</span></div>
               <div className="flex justify-between border-b border-white/5 pb-1"><span>total_system_memory</span><span className="text-white">64GB</span></div>
               <div className="flex justify-between border-b border-white/5 pb-1"><span>rdb_last_save_time</span><span className="text-white">10m ago</span></div>
               <div className="flex justify-between border-b border-white/5 pb-1"><span>aof_enabled</span><span className="text-green-400">1</span></div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RedisDashboard;
