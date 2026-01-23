
import React, { useState } from 'react';
import { 
  Search, Lock, Globe, Server, Code, 
  Copy, Check, Play, ChevronRight, ChevronDown 
} from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const MethodBadge = ({ method }) => {
  const colors = {
    GET: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    POST: 'bg-green-500/20 text-green-400 border-green-500/30',
    PUT: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colors[method] || 'bg-gray-500/20 text-gray-400'}`}>
      {method}
    </span>
  );
};

const EndpointBrowser = () => {
  const { apiContract } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState('all');
  const [expandedEndpoints, setExpandedEndpoints] = useState({});
  const { toast } = useToast();

  const toggleEndpoint = (id) => {
    setExpandedEndpoints(prev => ({...prev, [id]: !prev[id]}));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({ description: "Copied to clipboard" });
  };

  // Flatten and filter endpoints
  const allEndpoints = apiContract.flatMap(group => 
    group.endpoints.map(ep => ({ ...ep, groupTitle: group.title, groupId: group.id }))
  );

  const filteredEndpoints = allEndpoints.filter(ep => {
    const matchesSearch = ep.path.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ep.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = activeGroup === 'all' || ep.groupId === activeGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="h-full flex flex-col">
       {/* Toolbar */}
       <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-0 bg-[#050505] z-20 pb-4 border-b border-white/10">
          <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
             <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search endpoints (e.g. /users, auth)..."
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#0066FF] outline-none"
             />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
             <button 
                onClick={() => setActiveGroup('all')}
                className={cn(
                   "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border",
                   activeGroup === 'all' ? "bg-white text-black border-white" : "bg-[#1e1e1e] text-white/60 border-white/10 hover:text-white"
                )}
             >
                All Groups
             </button>
             {apiContract.map(group => (
                <button 
                   key={group.id}
                   onClick={() => setActiveGroup(group.id)}
                   className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border",
                      activeGroup === group.id ? "bg-white text-black border-white" : "bg-[#1e1e1e] text-white/60 border-white/10 hover:text-white"
                   )}
                >
                   {group.title}
                </button>
             ))}
          </div>
       </div>

       {/* List */}
       <div className="space-y-4 pb-10">
          {filteredEndpoints.length === 0 && (
             <div className="text-center py-20 text-white/30 italic">
                No endpoints found matching your criteria.
             </div>
          )}
          
          {filteredEndpoints.map(ep => (
             <div key={ep.id} className="border border-white/10 rounded-xl bg-[#111] overflow-hidden group">
                <div 
                   onClick={() => toggleEndpoint(ep.id)}
                   className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                   <div className="flex items-center gap-4 overflow-hidden">
                      <MethodBadge method={ep.method} />
                      <code className="text-sm font-mono text-white/90 truncate">{ep.path}</code>
                      <span className="text-xs text-white/40 hidden md:inline-block">• {ep.desc}</span>
                   </div>
                   <div className="flex items-center gap-4 shrink-0">
                      {ep.required_tokens !== 'public' && (
                         <div className="flex items-center gap-1 text-[10px] text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                            <Lock size={10} /> {ep.required_tokens}
                         </div>
                      )}
                      {expandedEndpoints[ep.id] ? <ChevronDown size={16} className="text-white/40" /> : <ChevronRight size={16} className="text-white/40" />}
                   </div>
                </div>

                {expandedEndpoints[ep.id] && (
                   <div className="border-t border-white/10 bg-[#0a0a0a] p-4 md:p-6 space-y-6">
                      <div className="flex justify-between items-start">
                         <div>
                            <h4 className="text-white font-bold mb-1">{ep.desc}</h4>
                            <p className="text-xs text-white/40">Group: {ep.groupTitle}</p>
                         </div>
                         <Button size="sm" variant="outline" className="h-8 text-xs border-white/10 gap-2" onClick={() => copyToClipboard(ep.path)}>
                            <Copy size={12} /> Copy Path
                         </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Request */}
                         <div>
                            <h5 className="text-xs font-bold text-white/60 uppercase mb-3 flex items-center gap-2">
                               <Server size={12} /> Request Parameters
                            </h5>
                            {ep.schema ? (
                               <div className="bg-[#1e1e1e] rounded-lg border border-white/10 p-3">
                                  <pre className="text-[10px] font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap">
                                     {JSON.stringify(ep.schema, null, 2)}
                                  </pre>
                               </div>
                            ) : (
                               <div className="text-xs text-white/30 italic bg-[#1e1e1e] p-3 rounded-lg border border-white/10">
                                  No body parameters required.
                               </div>
                            )}
                         </div>

                         {/* Response */}
                         <div>
                            <h5 className="text-xs font-bold text-white/60 uppercase mb-3 flex items-center gap-2">
                               <Code size={12} /> Response Example
                            </h5>
                            <div className="bg-[#1e1e1e] rounded-lg border border-white/10 p-3 relative group/code">
                               <pre className="text-[10px] font-mono text-green-400 overflow-x-auto whitespace-pre-wrap">
                                  {ep.response_format ? JSON.stringify(JSON.parse(ep.response_format), null, 2) : '{}'}
                               </pre>
                               <button 
                                  onClick={() => copyToClipboard(ep.response_format)} 
                                  className="absolute top-2 right-2 p-1.5 bg-black/50 rounded text-white/40 hover:text-white opacity-0 group-hover/code:opacity-100 transition-opacity"
                               >
                                  <Copy size={12} />
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>
                )}
             </div>
          ))}
       </div>
    </div>
  );
};

export default EndpointBrowser;
