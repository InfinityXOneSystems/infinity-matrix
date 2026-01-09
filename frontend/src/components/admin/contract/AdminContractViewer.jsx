
import React, { useState } from 'react';
import { 
  FileText, Database, GitMerge, Shield, 
  Download, Search, Globe, Code2, Layers,
  Terminal, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/lib/AdminProvider';
import EndpointBrowser from './EndpointBrowser';
import SchemaViewer from './SchemaViewer';
import ContractDiagrams from './ContractDiagrams';
import { ERROR_CODES, WEBHOOK_EVENTS, WEBSOCKET_MESSAGES } from './contractData';

const ReferenceTable = ({ title, data, columns }) => (
  <div className="mb-8">
    <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
    <div className="bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full text-left text-xs">
        <thead className="bg-black/20 text-white/40 font-bold uppercase border-b border-white/10">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="p-4">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-white/5">
              {columns.map((col, j) => (
                <td key={j} className={cn("p-4", col.className)}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminContractViewer = () => {
  const [activeTab, setActiveTab] = useState('endpoints');
  const { apiContractActions } = useAdmin();

  const tabs = [
    { id: 'endpoints', label: 'Endpoints', icon: Globe },
    { id: 'schemas', label: 'Data Models', icon: Database },
    { id: 'diagrams', label: 'Architecture', icon: GitMerge },
    { id: 'reference', label: 'Reference', icon: FileText },
  ];

  const handleExport = () => {
    apiContractActions.exportResults(); // Reusing the export function from provider for now
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'endpoints': return <EndpointBrowser />;
      case 'schemas': return <SchemaViewer />;
      case 'diagrams': return <ContractDiagrams />;
      case 'reference': 
        return (
          <div className="space-y-10 animate-in fade-in">
             <ReferenceTable 
                title="Error Codes" 
                data={ERROR_CODES}
                columns={[
                   { header: 'Code', accessor: 'code', className: 'font-mono text-red-400 font-bold' },
                   { header: 'Status', accessor: 'status', className: 'font-mono' },
                   { header: 'Message', accessor: 'message', className: 'text-white/70' }
                ]}
             />
             <ReferenceTable 
                title="Webhook Events" 
                data={WEBHOOK_EVENTS}
                columns={[
                   { header: 'Event Name', accessor: 'event', className: 'font-mono text-blue-400 font-bold' },
                   { header: 'Description', accessor: 'desc', className: 'text-white/70' }
                ]}
             />
             <ReferenceTable 
                title="WebSocket Messages" 
                data={WEBSOCKET_MESSAGES}
                columns={[
                   { header: 'Type', accessor: 'type', className: 'font-mono text-purple-400 font-bold' },
                   { header: 'Direction', accessor: 'dir', className: 'text-white/50 text-[10px] uppercase tracking-wide' },
                   { header: 'Description', accessor: 'desc', className: 'text-white/70' }
                ]}
             />
             
             <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Rate Limiting Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {[
                      { tier: 'Public', limit: '60 req/min', burst: 10 },
                      { tier: 'User', limit: '1000 req/min', burst: 50 },
                      { tier: 'Enterprise', limit: 'Unlimited', burst: '-' }
                   ].map((rule, i) => (
                      <div key={i} className="bg-black/20 p-4 rounded-lg border border-white/5">
                         <div className="text-xs text-white/40 uppercase font-bold mb-1">{rule.tier}</div>
                         <div className="text-xl font-bold text-white">{rule.limit}</div>
                         <div className="text-xs text-white/30 mt-1">Burst: {rule.burst}</div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent text-white overflow-hidden rounded-tl-2xl border-l border-t border-white/10 animate-in fade-in duration-500">
       {/* Header */}
       <div className="h-20 border-b border-white/10 flex items-center px-8 justify-between bg-black/40 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#0066FF]/10 rounded-xl flex items-center justify-center border border-[#0066FF]/20 text-[#0066FF]">
                <FileText size={24} />
             </div>
             <div>
                <h1 className="font-bold text-2xl tracking-wide text-white">API Contract<span className="text-[#0066FF] font-light">Viewer</span></h1>
                <div className="flex items-center gap-3 text-xs font-mono text-white/40">
                   <span className="flex items-center gap-1"><Activity size={10} className="text-green-400" /> v3.1.0</span>
                   <span>•</span>
                   <span>Last Updated: 2026-01-04</span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <Button variant="outline" className="border-white/10 hover:bg-white/5 gap-2" onClick={handleExport}>
                <Download size={14} /> Export JSON
             </Button>
          </div>
       </div>

       <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col py-6 px-4 gap-2 shrink-0">
             {tabs.map(tab => (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left",
                      activeTab === tab.id 
                         ? "bg-[#0066FF] text-white shadow-lg shadow-blue-900/20" 
                         : "text-white/50 hover:bg-white/5 hover:text-white"
                   )}
                >
                   <tab.icon size={18} />
                   {tab.label}
                </button>
             ))}
             
             <div className="mt-auto p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="text-xs font-bold text-white/40 uppercase mb-2">Version History</div>
                <div className="space-y-2 text-[10px] text-white/60 font-mono">
                   <div className="flex justify-between"><span>v3.1.0</span> <span className="text-green-400">Current</span></div>
                   <div className="flex justify-between"><span>v3.0.0</span> <span>Jan 01</span></div>
                   <div className="flex justify-between"><span>v2.4.2</span> <span>Dec 15</span></div>
                </div>
             </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-[#050505] relative">
             <div className="max-w-6xl mx-auto">
                {renderContent()}
             </div>
          </div>
       </div>
    </div>
  );
};

export default AdminContractViewer;
