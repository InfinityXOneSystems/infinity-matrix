
import React from 'react';
import { Terminal, AlertCircle, Info, CheckCircle } from 'lucide-react';

const AdminLogs = () => {
  const logs = [
    { type: 'info', msg: 'System initialization complete', time: '10:42:01' },
    { type: 'success', msg: 'Database connection established', time: '10:42:05' },
    { type: 'warning', msg: 'High latency detected on Node-7', time: '10:45:12' },
    { type: 'error', msg: 'Failed to sync with external API', time: '10:48:30' },
    { type: 'info', msg: 'User authentication attempt: admin', time: '10:50:00' },
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Terminal className="text-[#39FF14]" />
        <h2 className="text-2xl font-bold text-white">System Logs</h2>
      </div>

      <div className="flex-1 bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-sm overflow-y-auto custom-scrollbar">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-4 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded">
            <span className="text-white/30 shrink-0">{log.time}</span>
            <span className="shrink-0">
              {log.type === 'info' && <Info size={14} className="text-blue-400" />}
              {log.type === 'success' && <CheckCircle size={14} className="text-green-400" />}
              {log.type === 'warning' && <AlertCircle size={14} className="text-yellow-400" />}
              {log.type === 'error' && <AlertCircle size={14} className="text-red-400" />}
            </span>
            <span className={`
              ${log.type === 'error' ? 'text-red-400' : 'text-white/80'}
            `}>
              {log.msg}
            </span>
          </div>
        ))}
        <div className="mt-2 animate-pulse text-[#39FF14]">_</div>
      </div>
    </div>
  );
};

export default AdminLogs;
