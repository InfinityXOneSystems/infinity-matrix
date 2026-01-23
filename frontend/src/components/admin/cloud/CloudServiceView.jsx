
import React, { useState, useEffect } from 'react';
import { 
  Play, Square, Trash2, Settings, Terminal, Activity, 
  RefreshCw, Plus, CheckCircle, AlertTriangle, XCircle,
  MoreVertical, FileText, Database, Server, Cpu, Globe,
  Lock, CreditCard, Code, Cloud, Radio, RadioReceiver,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Mock Log Generator
const generateMockLogs = (serviceName) => {
  const levels = ['INFO', 'INFO', 'INFO', 'WARN', 'INFO', 'ERROR', 'INFO'];
  const messages = [
    'Health check passed', 'Request processed in 45ms', 'Connection pool initialized', 
    'High latency detected on pod-2', 'User authentication successful', 
    'Database timeout exceeded', 'Scaling event triggered', 'Message ack received',
    'Subscription backlog cleared', 'Dead letter queue processed'
  ];
  return Array(20).fill(0).map((_, i) => ({
    id: i,
    timestamp: new Date(Date.now() - i * 5000).toISOString(),
    level: levels[Math.floor(Math.random() * levels.length)],
    message: `[${serviceName}] ${messages[Math.floor(Math.random() * messages.length)]}`
  }));
};

const CloudServiceView = ({ serviceId, serviceName, serviceType, icon: Icon }) => {
  const { toast } = useToast();
  const [instances, setInstances] = useState(() => {
    // Initial mock data depending on service type
    if (serviceId === 'pubsub') {
      return [
        { id: 1, name: 'user-events-topic', status: 'Active', region: 'global', uptime: '99.99%', config: { type: 'Topic', subscribers: 12 } },
        { id: 2, name: 'order-processing-sub', status: 'Active', region: 'us-east1', uptime: '99.99%', config: { type: 'Subscription', backlog: '0 msgs' } },
        { id: 3, name: 'analytics-stream', status: 'Paused', region: 'global', uptime: '-', config: { type: 'Topic', subscribers: 3 } },
      ];
    }
    return [
      { id: 1, name: `${serviceName}-prod`, status: 'Running', region: 'us-east1', uptime: '99.9%', config: { cpu: 2, ram: '4GB' } },
      { id: 2, name: `${serviceName}-dev`, status: 'Stopped', region: 'us-central1', uptime: '-', config: { cpu: 1, ram: '2GB' } },
      { id: 3, name: `${serviceName}-staging`, status: 'Running', region: 'eu-west1', uptime: '98.5%', config: { cpu: 1, ram: '2GB' } },
    ];
  });
  
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Backend Handlers (MCP Ready)
  const handleCreate = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const isPubSub = serviceId === 'pubsub';
      const newInstance = {
        id: Date.now(),
        name: isPubSub ? `new-topic-${Math.floor(Math.random()*100)}` : `${serviceName}-new-${Math.floor(Math.random()*100)}`,
        status: isPubSub ? 'Active' : 'Starting',
        region: 'us-east1',
        uptime: '0%',
        config: isPubSub ? { type: 'Topic', subscribers: 0 } : { cpu: 1, ram: '1GB' }
      };
      setInstances([newInstance, ...instances]);
      setIsLoading(false);
      toast({ title: "Resource Created", description: `New ${serviceName} resource initiated.` });
    }, 1000);
  };

  const handleDelete = (id) => {
    setInstances(prev => prev.filter(i => i.id !== id));
    if (selectedInstance?.id === id) setSelectedInstance(null);
    toast({ title: "Resource Deleted", description: `Resource terminated successfully.` });
  };

  const handleAction = (id, action) => {
    toast({ title: `Action: ${action}`, description: `Signal sent to ${serviceName} controller.` });
    setInstances(prev => prev.map(i => {
      if (i.id === id) {
        if (action === 'Start' || action === 'Resume') return { ...i, status: serviceId === 'pubsub' ? 'Active' : 'Running' };
        if (action === 'Stop' || action === 'Pause') return { ...i, status: serviceId === 'pubsub' ? 'Paused' : 'Stopped' };
      }
      return i;
    }));
  };

  const refreshLogs = () => {
    if (selectedInstance) {
      setLogs(generateMockLogs(selectedInstance.name));
    }
  };

  useEffect(() => {
    if (selectedInstance) {
      refreshLogs();
    }
  }, [selectedInstance]);

  return (
    <div className="flex h-full gap-6">
      {/* List Panel */}
      <div className={cn("flex-col gap-4 flex", selectedInstance ? "w-1/3 hidden md:flex" : "w-full")}>
        <div className="flex justify-between items-center mb-2">
           <div>
              <h2 className="text-xl font-light text-white flex items-center gap-2">
                 <Icon className="text-[#0066FF]" size={24} />
                 {serviceName}
              </h2>
              <p className="text-white/40 text-sm mt-1">Manage {serviceType} resources</p>
           </div>
           <Button onClick={handleCreate} disabled={isLoading} className="bg-[#0066FF] hover:bg-[#0052cc] text-white gap-2">
              <Plus size={16} /> Create
           </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
          {instances.map(instance => (
            <div 
              key={instance.id}
              onClick={() => setSelectedInstance(instance)}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all hover:bg-white/5 relative overflow-hidden group",
                selectedInstance?.id === instance.id 
                  ? "bg-[#0066FF]/10 border-[#0066FF]/50" 
                  : "bg-[#0A0A0A] border-white/5"
              )}
            >
               <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-white flex items-center gap-2">
                    {serviceId === 'pubsub' && (instance.config.type === 'Topic' ? <Radio size={14} className="text-blue-400" /> : <Share2 size={14} className="text-purple-400" />)}
                    {instance.name}
                  </div>
                  <div className={cn(
                     "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                     (instance.status === 'Running' || instance.status === 'Active') ? "bg-green-500/20 text-green-400" : 
                     instance.status === 'Starting' ? "bg-blue-500/20 text-blue-400 animate-pulse" :
                     "bg-gray-500/20 text-gray-400"
                  )}>
                     {instance.status}
                  </div>
               </div>
               <div className="flex items-center gap-4 text-xs text-white/40">
                  <div className="flex items-center gap-1"><Globe size={10} /> {instance.region}</div>
                  <div className="flex items-center gap-1"><Activity size={10} /> {instance.uptime}</div>
                  {serviceId === 'pubsub' && (
                    <div className="ml-auto text-[10px] text-white/60 bg-white/5 px-1.5 py-0.5 rounded">
                      {instance.config.type}
                    </div>
                  )}
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedInstance && (
        <div className="flex-1 glass-panel rounded-2xl border border-white/10 bg-[#0A0A0A] flex flex-col overflow-hidden">
           {/* Header */}
           <div className="p-6 border-b border-white/5 flex justify-between items-start">
              <div>
                 <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">{selectedInstance.name}</h3>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded text-xs text-white/60">
                       <div className={cn("w-1.5 h-1.5 rounded-full", (selectedInstance.status === 'Running' || selectedInstance.status === 'Active') ? "bg-green-500" : "bg-gray-500")} />
                       {selectedInstance.status}
                    </div>
                 </div>
                 <div className="text-sm text-white/40 mt-1 font-mono">ID: {serviceType}-{selectedInstance.id}</div>
              </div>
              
              <div className="flex gap-2">
                 <Button variant="outline" size="sm" onClick={() => setSelectedInstance(null)} className="md:hidden">Back</Button>
                 {(selectedInstance.status === 'Running' || selectedInstance.status === 'Active') ? (
                    <Button variant="outline" size="sm" onClick={() => handleAction(selectedInstance.id, serviceId === 'pubsub' ? 'Pause' : 'Stop')} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                      {serviceId === 'pubsub' ? 'Pause' : 'Stop'}
                    </Button>
                 ) : (
                    <Button variant="outline" size="sm" onClick={() => handleAction(selectedInstance.id, serviceId === 'pubsub' ? 'Resume' : 'Start')} className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                      {serviceId === 'pubsub' ? 'Resume' : 'Start'}
                    </Button>
                 )}
                 <Button variant="outline" size="icon" onClick={() => handleDelete(selectedInstance.id)} className="border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"><Trash2 size={16} /></Button>
              </div>
           </div>

           {/* Tabs */}
           <div className="flex items-center gap-6 px-6 border-b border-white/5 text-sm font-medium overflow-x-auto">
              {['overview', 'configuration', 'logs', 'monitoring'].map(tab => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                       "py-4 capitalize border-b-2 transition-colors",
                       activeTab === tab ? "border-[#0066FF] text-white" : "border-transparent text-white/40 hover:text-white"
                    )}
                 >
                    {tab}
                 </button>
              ))}
           </div>

           {/* Content */}
           <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {activeTab === 'overview' && (
                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="text-xs text-white/40 uppercase mb-1">Region</div>
                          <div className="text-lg text-white">{selectedInstance.region}</div>
                       </div>
                       <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="text-xs text-white/40 uppercase mb-1">
                            {serviceId === 'pubsub' ? 'Type' : 'Endpoints'}
                          </div>
                          <div className="text-lg text-[#0066FF] truncate">
                            {serviceId === 'pubsub' ? selectedInstance.config.type : `https://api.${selectedInstance.name}.cloud`}
                          </div>
                       </div>
                    </div>
                    
                    {serviceId === 'pubsub' ? (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="text-xs text-white/40 uppercase mb-1">Message Count</div>
                          <div className="text-2xl font-mono text-white">2.4M</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="text-xs text-white/40 uppercase mb-1">Storage Bytes</div>
                          <div className="text-2xl font-mono text-white">450 MB</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="text-xs text-white/40 uppercase mb-1">Ack Rate</div>
                          <div className="text-2xl font-mono text-green-400">99.2%</div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-sm font-bold text-white mb-3">Resource Usage</h4>
                        <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-xs text-white/60 mb-1"><span>CPU (2 Cores)</span><span>45%</span></div>
                              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[45%]" /></div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs text-white/60 mb-1"><span>Memory (4GB)</span><span>62%</span></div>
                              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[62%]" /></div>
                            </div>
                        </div>
                      </div>
                    )}
                 </div>
              )}

              {activeTab === 'configuration' && (
                 <div className="space-y-6 max-w-xl">
                    <div className="space-y-4">
                       <div>
                          <label className="text-xs font-bold text-white/60 uppercase block mb-2">Resource Name</label>
                          <input type="text" value={selectedInstance.name} readOnly className="w-full bg-[#02040F] border border-white/10 rounded-lg p-2.5 text-white text-sm" />
                       </div>
                       
                       {serviceId === 'pubsub' ? (
                          <>
                            <div>
                               <label className="text-xs font-bold text-white/60 uppercase block mb-2">Schema Settings</label>
                               <div className="bg-[#02040F] border border-white/10 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                     <span className="text-sm text-white">Use Schema Validation</span>
                                     <input type="checkbox" className="rounded border-white/20 bg-transparent" />
                                  </div>
                                  <select className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white">
                                     <option>Avro</option>
                                     <option>Protocol Buffer</option>
                                  </select>
                               </div>
                            </div>
                            <div>
                               <label className="text-xs font-bold text-white/60 uppercase block mb-2">Message Retention Duration</label>
                               <div className="flex gap-2">
                                  <input type="number" defaultValue="7" className="w-20 bg-[#02040F] border border-white/10 rounded-lg p-2.5 text-white text-sm" />
                                  <select className="flex-1 bg-[#02040F] border border-white/10 rounded-lg p-2.5 text-white text-sm">
                                     <option>Days</option>
                                     <option>Hours</option>
                                  </select>
                               </div>
                            </div>
                          </>
                       ) : (
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="text-xs font-bold text-white/60 uppercase block mb-2">CPU Allocation</label>
                               <select className="w-full bg-[#02040F] border border-white/10 rounded-lg p-2.5 text-white text-sm">
                                  <option>1 vCPU</option>
                                  <option>2 vCPU</option>
                                  <option>4 vCPU</option>
                               </select>
                            </div>
                            <div>
                               <label className="text-xs font-bold text-white/60 uppercase block mb-2">Memory</label>
                               <select className="w-full bg-[#02040F] border border-white/10 rounded-lg p-2.5 text-white text-sm">
                                  <option>1 GB</option>
                                  <option>2 GB</option>
                                  <option>4 GB</option>
                               </select>
                            </div>
                         </div>
                       )}
                       
                       <div>
                          <label className="text-xs font-bold text-white/60 uppercase block mb-2">Labels / Variables</label>
                          <div className="bg-[#02040F] border border-white/10 rounded-lg p-4 space-y-2">
                             <div className="flex gap-2">
                                <input placeholder="KEY" className="flex-1 bg-white/5 border-none rounded px-2 py-1 text-xs text-white" />
                                <input placeholder="VALUE" className="flex-1 bg-white/5 border-none rounded px-2 py-1 text-xs text-white" />
                             </div>
                             <Button size="sm" variant="ghost" className="w-full text-xs text-white/40 h-6">+ Add Label</Button>
                          </div>
                       </div>
                    </div>
                    <Button onClick={() => toast({title: "Configuration Saved"})} className="bg-[#0066FF] text-white">Save Changes</Button>
                 </div>
              )}

              {activeTab === 'logs' && (
                 <div className="h-full flex flex-col">
                    <div className="flex justify-between mb-2">
                       <div className="flex gap-2">
                          <input placeholder="Filter logs..." className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white" />
                       </div>
                       <Button size="sm" variant="ghost" onClick={refreshLogs}><RefreshCw size={14} /></Button>
                    </div>
                    <div className="flex-1 bg-[#02040F] rounded-lg border border-white/10 p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
                       {logs.map(log => (
                          <div key={log.id} className="mb-1 flex gap-2">
                             <span className="text-white/30 shrink-0">{log.timestamp.split('T')[1].split('.')[0]}</span>
                             <span className={cn(
                                "font-bold w-12 shrink-0",
                                log.level === 'INFO' ? 'text-blue-400' : 
                                log.level === 'WARN' ? 'text-yellow-400' : 'text-red-400'
                             )}>{log.level}</span>
                             <span className="text-white/80">{log.message}</span>
                          </div>
                       ))}
                    </div>
                 </div>
              )}

              {activeTab === 'monitoring' && (
                 <div className="h-full flex items-center justify-center text-white/40 flex-col gap-4">
                    <Activity size={48} className="opacity-20" />
                    <p>Real-time telemetry stream requires active WebSocket connection.</p>
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default CloudServiceView;
