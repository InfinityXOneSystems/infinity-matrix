
import React, { useEffect, useState } from 'react';
import { Terminal, Filter, RefreshCw } from 'lucide-react';
import { logger } from '@/lib/logger'; // Use the isolated logger directly to get 'sync' type logs

const SyncLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Subscribe to logger for live updates
    const unsubscribe = logger.subscribe((allLogs) => {
      // Filter for sync-related activities or system logs
      const syncLogs = allLogs.filter(l => l.type === 'sync' || l.message.toLowerCase().includes('sync'));
      setLogs(syncLogs);
    });
    return unsubscribe;
  }, []);

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(l => l.type === filter);

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A] rounded-xl border border-white/10 overflow-hidden font-mono">
       <div className="p-4 border-b border-white/5 bg-[#252526] flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold">
             <Terminal size={16} className="text-emerald-400" /> Sync Engine Audit Trail
          </div>
          <div className="flex gap-2">
             <button onClick={() => setFilter('all')} className="text-xs px-2 py-1 bg-white/5 rounded hover:bg-white/10 text-white/60">All</button>
             <button onClick={() => setFilter('sync')} className="text-xs px-2 py-1 bg-emerald-500/10 rounded hover:bg-emerald-500/20 text-emerald-400">Sync</button>
             <button onClick={() => setFilter('error')} className="text-xs px-2 py-1 bg-red-500/10 rounded hover:bg-red-500/20 text-red-400">Errors</button>
          </div>
       </div>
       <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {filteredLogs.length === 0 ? (
             <div className="text-center text-white/20 py-10 italic">No sync activity recorded.</div>
          ) : (
             filteredLogs.map(log => (
                <div key={log.id} className="flex gap-3 text-xs border-b border-white/5 pb-1 last:border-0 hover:bg-white/5 p-1 rounded">
                   <span className="text-gray-500 w-24 shrink-0 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                   </span>
                   <span className={`uppercase font-bold w-16 shrink-0 ${
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'success' ? 'text-green-400' :
                      log.type === 'sync' ? 'text-emerald-400' :
                      'text-blue-400'
                   }`}>
                      {log.type}
                   </span>
                   <span className="text-white/80 break-all">{log.message}</span>
                   {log.data && (
                      <span className="text-white/30 truncate max-w-[200px] hidden md:inline">
                         {JSON.stringify(log.data)}
                      </span>
                   )}
                </div>
             ))
          )}
       </div>
    </div>
  );
};

export default SyncLogs;
