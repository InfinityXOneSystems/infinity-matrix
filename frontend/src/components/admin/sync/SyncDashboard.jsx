
import React from 'react';
import { 
  RefreshCw, CheckCircle, AlertTriangle, 
  Clock, Activity, Database, ArrowUp, ArrowDown
} from 'lucide-react';
import { useSync } from '@/lib/SyncProvider';
import { Button } from '@/components/ui/button';

const SyncDashboard = () => {
  const { status, queueSize, lastSync, retryCount, forceSync } = useSync();

  return (
    <div className="space-y-6">
       {/* High-level Stats */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
                   <Activity size={24} />
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                    status === 'connected' ? 'bg-emerald-500/10 text-emerald-400' : 
                    status === 'offline' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                   {status}
                </div>
             </div>
             <div className="text-3xl font-bold text-white mb-1">
                {status === 'offline' ? `${retryCount} Retries` : 'Active'}
             </div>
             <div className="text-sm text-gray-400">Connection Status</div>
          </div>
          
          <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                   <Database size={24} />
                </div>
                <div className="text-xs font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400">
                   Buffered
                </div>
             </div>
             <div className="text-3xl font-bold text-white mb-1">{queueSize}</div>
             <div className="text-sm text-gray-400">Pending Changes</div>
          </div>

          <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                   <Clock size={24} />
                </div>
             </div>
             <div className="text-sm font-mono text-white mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {lastSync ? new Date(lastSync).toLocaleTimeString() : 'Never'}
             </div>
             <div className="text-sm text-gray-400">Last Successful Sync</div>
          </div>

          <div className="p-6 bg-[#252526] rounded-xl border border-white/5 flex flex-col justify-center items-center">
             <Button 
                onClick={forceSync}
                disabled={status === 'syncing' || status === 'offline'}
                className="w-full h-full bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold gap-2 text-lg disabled:opacity-50"
             >
                <RefreshCw size={24} className={status === 'syncing' ? 'animate-spin' : ''} />
                {status === 'syncing' ? 'Syncing...' : 'Force Sync'}
             </Button>
          </div>
       </div>

       {/* Visualizations */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <ArrowUp className="text-green-400" size={16} /> Outbound Traffic
              </h3>
              <div className="h-32 flex items-end gap-1 border-b border-white/10 pb-2">
                  {[40, 60, 20, 80, 50, 90, 30].map((h, i) => (
                      <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-green-500/20 hover:bg-green-500/40 transition-colors rounded-t-sm relative group">
                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-white border border-white/20">
                            {h}kb
                         </div>
                      </div>
                  ))}
              </div>
          </div>
          <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <ArrowDown className="text-blue-400" size={16} /> Inbound Updates
              </h3>
              <div className="h-32 flex items-end gap-1 border-b border-white/10 pb-2">
                  {[20, 30, 45, 25, 60, 40, 20].map((h, i) => (
                      <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-blue-500/20 hover:bg-blue-500/40 transition-colors rounded-t-sm relative group">
                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-white border border-white/20">
                            {h} updates
                         </div>
                      </div>
                  ))}
              </div>
          </div>
       </div>
    </div>
  );
};

export default SyncDashboard;
