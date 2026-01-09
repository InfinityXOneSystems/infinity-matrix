
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, Play, Code, Database, Globe, Shield, 
  Zap, Copy, Check, Terminal, RotateCcw, 
  ChevronRight, ChevronDown, Activity, FileJson
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdmin } from '@/lib/AdminProvider';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const MethodBadge = ({ method }) => {
  const colors = {
    GET: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    POST: 'bg-green-500/20 text-green-400 border-green-500/30',
    PUT: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
    PATCH: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colors[method] || 'bg-gray-500/20 text-gray-400'}`}>
      {method}
    </span>
  );
};

const EndpointCard = ({ endpoint, isSelected, onClick }) => (
  <div 
    onClick={onClick}
    className={cn(
      "p-3 rounded-lg cursor-pointer border transition-all mb-2 group",
      isSelected 
        ? "bg-[#39FF14]/10 border-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.1)]" 
        : "bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/5"
    )}
  >
    <div className="flex items-center justify-between mb-1">
      <MethodBadge method={endpoint.method} />
      <span className={cn("text-[10px] font-mono", isSelected ? "text-[#39FF14]" : "text-white/30")}>
        ID: {endpoint.id}
      </span>
    </div>
    <div className={cn("text-xs font-mono truncate mb-1", isSelected ? "text-white" : "text-white/70")}>
      {endpoint.path}
    </div>
    <div className="text-[10px] text-white/40 truncate">
      {endpoint.desc}
    </div>
  </div>
);

const AdminApiLab = () => {
  const { apiContract, apiContractActions, testResults, testHistory } = useAdmin();
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [requestParams, setRequestParams] = useState({});
  const [authToken, setAuthToken] = useState('admin_sk_live_83729...');
  const [activeTab, setActiveTab] = useState('console'); // console, docs, history
  const { toast } = useToast();

  const handleEndpointSelect = (endpoint) => {
    setSelectedEndpoint(endpoint);
    setRequestParams({}); // Clear params
  };

  const handleAutoFill = () => {
    if (!selectedEndpoint?.schema) return;
    
    const mockData = {};
    Object.entries(selectedEndpoint.schema).forEach(([key, rule]) => {
      if (rule.example) mockData[key] = rule.example;
      else if (rule.type === 'number') mockData[key] = Math.floor(Math.random() * 100);
      else if (rule.type === 'boolean') mockData[key] = true;
      else mockData[key] = "sample_string";
    });
    
    setRequestParams(mockData);
    toast({ description: "Form auto-filled with mock data." });
  };

  const handleRunTest = async () => {
    if (!selectedEndpoint) return;
    await apiContractActions.runTest(selectedEndpoint, requestParams);
  };

  const currentResult = selectedEndpoint ? testResults[selectedEndpoint.id] : null;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="shrink-0 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-white flex items-center gap-3">
             <Terminal className="text-[#39FF14]" size={28} /> API Laboratory
          </h2>
          <p className="text-white/40 text-sm mt-1">Backend contract verification and endpoint testing facility.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" onClick={apiContractActions.resetContract} className="text-white/40 hover:text-white">
             <RotateCcw size={14} className="mr-2" /> Reset Defaults
           </Button>
           <Button variant="outline" size="sm" onClick={apiContractActions.clearHistory} className="text-white/40 hover:text-white">
             <FileJson size={14} className="mr-2" /> Clear Logs
           </Button>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        
        {/* LEFT: ENDPOINT EXPLORER */}
        <div className="w-80 flex flex-col glass-panel rounded-xl border border-white/10 bg-black/20 shrink-0">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Globe size={14} /> Available Endpoints
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {apiContract.map((group) => (
              <div key={group.id} className="mb-6">
                 <div className="flex items-center gap-2 mb-3">
                    <span className={cn("w-1.5 h-1.5 rounded-full", group.color.replace('text-', 'bg-'))} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${group.color}`}>{group.title}</span>
                 </div>
                 {group.endpoints.map(ep => (
                   <EndpointCard 
                      key={ep.id} 
                      endpoint={ep} 
                      isSelected={selectedEndpoint?.id === ep.id} 
                      onClick={() => handleEndpointSelect(ep)} 
                   />
                 ))}
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE: TEST CONSOLE */}
        <div className="flex-1 flex flex-col glass-panel rounded-xl border border-white/10 bg-black/20 overflow-hidden">
          {selectedEndpoint ? (
            <>
              {/* Console Header */}
              <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <MethodBadge method={selectedEndpoint.method} />
                    <code className="text-sm text-white font-mono">{selectedEndpoint.path}</code>
                 </div>
                 <div className="flex gap-2">
                    {['console', 'docs'].map(tab => (
                       <button 
                         key={tab} 
                         onClick={() => setActiveTab(tab)}
                         className={cn(
                           "px-3 py-1 rounded text-xs font-bold uppercase transition-colors",
                           activeTab === tab ? "bg-[#39FF14]/10 text-[#39FF14]" : "text-white/40 hover:text-white"
                         )}
                       >
                         {tab}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Console Body */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
                 {activeTab === 'console' ? (
                   <div className="space-y-8 max-w-3xl mx-auto">
                      
                      {/* AUTH SECTION */}
                      <div className="space-y-3">
                         <label className="text-xs font-bold text-white/50 uppercase flex items-center gap-2">
                            <Shield size={12} /> Authorization
                         </label>
                         <div className="flex gap-2">
                            <Input 
                               value={authToken} 
                               onChange={(e) => setAuthToken(e.target.value)}
                               className="font-mono text-xs bg-black/40 border-white/10 text-yellow-500" 
                            />
                            <Button size="sm" variant="outline" className="shrink-0 text-xs">Update Token</Button>
                         </div>
                         <div className="flex gap-2">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/5">Scope: {selectedEndpoint.required_tokens}</span>
                         </div>
                      </div>

                      {/* PARAMETERS FORM */}
                      {selectedEndpoint.method !== 'GET' && (
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-white/50 uppercase flex items-center gap-2">
                                  <Code size={12} /> Request Body (JSON)
                              </label>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={handleAutoFill}
                                className="h-6 text-[10px] text-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/10"
                              >
                                 <Zap size={10} className="mr-1" /> Auto-Fill Mock Data
                              </Button>
                           </div>
                           
                           {/* Dynamic Form Generation */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                              {selectedEndpoint.schema && Object.keys(selectedEndpoint.schema).length > 0 ? (
                                 Object.entries(selectedEndpoint.schema).map(([key, rule]) => (
                                    <div key={key} className="space-y-1.5">
                                       <label className="text-[11px] text-white/70 font-mono flex items-center justify-between">
                                          {key}
                                          {rule.required && <span className="text-red-500 text-[9px]">*REQ</span>}
                                       </label>
                                       {rule.options ? (
                                          <select 
                                            className="w-full h-9 bg-black/40 border border-white/10 rounded-md text-xs px-3 text-white focus:outline-none focus:border-[#39FF14]"
                                            value={requestParams[key] || ''}
                                            onChange={(e) => setRequestParams({...requestParams, [key]: e.target.value})}
                                          >
                                             <option value="">Select...</option>
                                             {rule.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                          </select>
                                       ) : (
                                          <Input 
                                             className="h-9 bg-black/40 border-white/10 text-xs font-mono"
                                             placeholder={rule.example ? `e.g. ${rule.example}` : ''}
                                             value={requestParams[key] || ''}
                                             onChange={(e) => setRequestParams({...requestParams, [key]: e.target.value})}
                                          />
                                       )}
                                       <div className="text-[9px] text-white/30 truncate">Type: {rule.type}</div>
                                    </div>
                                 ))
                              ) : (
                                 <div className="col-span-2 text-center text-xs text-white/30 italic py-4">No parameters required for this endpoint.</div>
                              )}
                           </div>
                           
                           {/* Raw Preview */}
                           <div className="p-3 bg-black/60 rounded border border-white/10 font-mono text-[10px] text-white/60">
                              {JSON.stringify(requestParams, null, 2)}
                           </div>
                        </div>
                      )}

                      <Button 
                        onClick={handleRunTest} 
                        disabled={currentResult?.status === 'pending'}
                        className="w-full py-6 bg-[#0066FF] hover:bg-[#0055EE] text-white font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(0,102,255,0.3)]"
                      >
                         {currentResult?.status === 'pending' ? 'Sending Request...' : 'Execute Request'} <Play size={16} className="ml-2 fill-current" />
                      </Button>
                   </div>
                 ) : (
                   /* DOCS TAB */
                   <div className="space-y-6 max-w-3xl mx-auto">
                      <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                         <h3 className="text-lg font-bold text-white mb-2">{selectedEndpoint.desc}</h3>
                         <div className="flex gap-4 text-xs text-white/50 mb-4">
                            <span>Requires: <strong className="text-white">{selectedEndpoint.required_tokens}</strong> token</span>
                            <span>Format: <strong className="text-white">JSON</strong></span>
                         </div>
                         <div className="space-y-4">
                            <div>
                               <h4 className="text-xs font-bold uppercase text-white/40 mb-2">Request Schema</h4>
                               <pre className="bg-black/50 p-4 rounded-lg text-xs font-mono text-blue-300 overflow-x-auto border border-white/10">
                                  {JSON.stringify(selectedEndpoint.schema, null, 2)}
                               </pre>
                            </div>
                            <div>
                               <h4 className="text-xs font-bold uppercase text-white/40 mb-2">Expected Response</h4>
                               <pre className="bg-black/50 p-4 rounded-lg text-xs font-mono text-green-300 overflow-x-auto border border-white/10">
                                  {selectedEndpoint.response_format ? JSON.stringify(JSON.parse(selectedEndpoint.response_format), null, 2) : '{}'}
                               </pre>
                            </div>
                         </div>
                      </div>
                   </div>
                 )}
              </div>

              {/* RESPONSE PANEL (Conditional) */}
              <AnimatePresence>
                 {currentResult && activeTab === 'console' && (
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: 300 }} 
                      className="border-t border-white/20 bg-[#0a0a0a] flex flex-col shrink-0"
                    >
                       <div className="p-2 px-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                          <div className="flex items-center gap-3">
                             <span className={cn("text-xs font-bold px-2 py-0.5 rounded", currentResult.status === 'success' ? "bg-green-500/20 text-green-400" : (currentResult.status === 'pending' ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"))}>
                                {currentResult.statusCode || '...'}
                             </span>
                             <span className="text-xs text-white/50">Time: {currentResult.time}ms</span>
                          </div>
                          <Button size="sm" variant="ghost" className="h-6 text-[10px] text-white/40 hover:text-white">
                             <Copy size={12} className="mr-1" /> Copy JSON
                          </Button>
                       </div>
                       <div className="flex-1 overflow-auto p-4 font-mono text-xs">
                          {currentResult.status === 'pending' ? (
                             <div className="flex items-center gap-2 text-white/50">
                                <Activity size={14} className="animate-spin" /> Waiting for response stream...
                             </div>
                          ) : (
                             <pre className={cn("whitespace-pre-wrap", currentResult.status === 'error' ? "text-red-400" : "text-[#39FF14]")}>
                                {JSON.stringify(currentResult.response || currentResult.error, null, 2)}
                             </pre>
                          )}
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/30">
               <Server size={48} className="mb-4 opacity-50" />
               <p>Select an endpoint to begin testing.</p>
            </div>
          )}
        </div>
        
        {/* RIGHT: HISTORY LOGS */}
        <div className="w-64 flex flex-col glass-panel rounded-xl border border-white/10 bg-black/20 shrink-0">
           <div className="p-4 border-b border-white/10 bg-white/5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                 <Activity size={14} /> Request Log
              </h3>
           </div>
           <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
              {testHistory.length === 0 && <div className="text-[10px] text-white/30 text-center py-4">No requests logged.</div>}
              {testHistory.map((log, i) => (
                 <div key={i} className="p-2 rounded bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-colors group">
                    <div className="flex items-center justify-between mb-1">
                       <span className={cn("text-[9px] font-bold px-1 rounded", log.status === 'success' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                          {log.statusCode}
                       </span>
                       <span className="text-[9px] text-white/30">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-[10px] font-mono text-white/70 truncate">{log.method} {log.path}</div>
                    <div className="text-[9px] text-white/30 mt-1 flex justify-between">
                       <span>{log.time}ms</span>
                       <ChevronRight size={10} className="opacity-0 group-hover:opacity-100" />
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminApiLab;
