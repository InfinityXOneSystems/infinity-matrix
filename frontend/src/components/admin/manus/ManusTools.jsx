
import React from 'react';
import { 
  Database, Globe, FileText, Mail, Search, 
  Terminal, Shield, Zap, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ManusTools = () => {
  const tools = [
    { id: 1, name: 'Web Scraper', icon: Globe, category: 'Extraction', status: 'Active', usage: 'High' },
    { id: 2, name: 'PDF Analyzer', icon: FileText, category: 'Processing', status: 'Active', usage: 'Medium' },
    { id: 3, name: 'Email Dispatch', icon: Mail, category: 'Communication', status: 'Active', usage: 'Low' },
    { id: 4, name: 'Data Pipeline', icon: Database, category: 'Integration', status: 'Maintenance', usage: 'None' },
    { id: 5, name: 'Search Engine', icon: Search, category: 'Research', status: 'Active', usage: 'High' },
    { id: 6, name: 'Code Exec', icon: Terminal, category: 'Compute', status: 'Active', usage: 'Low' },
  ];

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
             <h2 className="text-lg font-light text-white">Tool Registry</h2>
             <p className="text-xs text-gray-500">Available modules for Manus workflows</p>
          </div>
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white gap-2">
             <Plus size={16} /> Import Tool
          </Button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
             <div key={tool.id} className="bg-[#252526] p-6 rounded-xl border border-white/5 group hover:border-yellow-500/50 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                   <SettingsButton />
                </div>
                
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <tool.icon size={24} className="text-yellow-400" />
                </div>
                
                <h3 className="font-bold text-white text-lg mb-1">{tool.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                   <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">{tool.category}</span>
                   <span className={`text-xs px-2 py-0.5 rounded border ${tool.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{tool.status}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/5">
                   <span>Usage: <span className="text-white">{tool.usage}</span></span>
                   <span className="flex items-center gap-1"><Shield size={10} /> Verified</span>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const SettingsButton = () => (
   <button className="p-2 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors">
      <Zap size={14} />
   </button>
);

export default ManusTools;
