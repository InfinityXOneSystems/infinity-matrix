
import React, { useState } from 'react';
import { 
  Layout, Type, Image, Database, Code, 
  Settings, Save, Play, Smartphone, Monitor 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const QuantumBuilder = () => {
  const [activeDevice, setActiveDevice] = useState('desktop');

  const components = [
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'text', label: 'Typography', icon: Type },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'code', label: 'Logic', icon: Code },
  ];

  return (
    <div className="flex h-full bg-[#111]">
       {/* Component Toolbox */}
       <div className="w-16 bg-[#252526] border-r border-white/10 flex flex-col items-center py-4 gap-4">
          {components.map(comp => (
             <button key={comp.id} className="p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title={comp.label}>
                <comp.icon size={20} />
             </button>
          ))}
          <div className="mt-auto border-t border-white/10 pt-4 w-full flex justify-center">
             <button className="p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
                <Settings size={20} />
             </button>
          </div>
       </div>

       {/* Canvas Area */}
       <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Canvas Toolbar */}
          <div className="h-12 bg-[#1e1e1e] border-b border-white/10 flex justify-between items-center px-4">
             <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveDevice('desktop')}
                  className={`p-1.5 rounded ${activeDevice === 'desktop' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                   <Monitor size={16} />
                </button>
                <button 
                  onClick={() => setActiveDevice('mobile')}
                  className={`p-1.5 rounded ${activeDevice === 'mobile' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                   <Smartphone size={16} />
                </button>
             </div>
             <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="h-8 text-xs text-gray-400">Preview</Button>
                <Button size="sm" className="h-8 text-xs bg-[#0066FF] text-white gap-2"><Save size={12} /> Save</Button>
             </div>
          </div>

          {/* Actual Canvas */}
          <div className="flex-1 bg-[#111] relative flex items-center justify-center p-8 overflow-auto">
             <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
             />
             
             <div 
                className={`bg-white transition-all duration-300 shadow-2xl overflow-hidden relative ${
                   activeDevice === 'mobile' ? 'w-[375px] h-[667px] rounded-3xl border-8 border-gray-800' : 'w-full h-full max-w-5xl rounded-lg border border-gray-800'
                }`}
             >
                {/* Visual Representation of App */}
                <div className="h-full w-full bg-white text-black p-8 font-sans">
                   <div className="border-2 border-dashed border-blue-300 bg-blue-50 p-4 mb-4 rounded text-center text-blue-500 text-sm font-bold uppercase tracking-wide cursor-pointer hover:bg-blue-100 transition-colors">
                      Header Component
                   </div>
                   <div className="flex gap-4 h-64 mb-4">
                      <div className="flex-1 border-2 border-dashed border-gray-300 bg-gray-50 rounded flex items-center justify-center text-gray-400 text-xs">
                         Sidebar
                      </div>
                      <div className="flex-[3] border-2 border-dashed border-gray-300 bg-gray-50 rounded flex items-center justify-center text-gray-400 text-xs flex-col gap-2">
                         <span>Main Content Area</span>
                         <button className="px-4 py-2 bg-blue-500 text-white rounded text-xs">Primary Action</button>
                      </div>
                   </div>
                   <div className="border-2 border-dashed border-gray-300 bg-gray-50 p-4 rounded text-center text-gray-400 text-xs">
                      Footer Component
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Properties Panel */}
       <div className="w-64 bg-[#252526] border-l border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10 font-bold text-sm text-white">Properties</div>
          <div className="p-4 space-y-4">
             <div className="space-y-2">
                <label className="text-xs text-gray-400">Component ID</label>
                <input className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white" value="main-content" readOnly />
             </div>
             <div className="space-y-2">
                <label className="text-xs text-gray-400">Background</label>
                <div className="flex gap-2">
                   <div className="w-6 h-6 rounded border border-white/20 bg-white cursor-pointer" />
                   <div className="w-6 h-6 rounded border border-white/20 bg-gray-100 cursor-pointer" />
                   <div className="w-6 h-6 rounded border border-white/20 bg-black cursor-pointer" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs text-gray-400">Spacing</label>
                <input type="range" className="w-full" />
             </div>
          </div>
       </div>
    </div>
  );
};

export default QuantumBuilder;
