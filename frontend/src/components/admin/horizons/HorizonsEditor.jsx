
import React from 'react';
import { 
  Save, Play, Code2, Monitor, Smartphone, 
  Sparkles, Download, Layers 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/lib/AdminProvider';

const HorizonsEditor = () => {
  const { horizons, horizonsActions } = useAdmin();

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
       {/* Toolbar */}
       <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-[#252526]">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Code2 className="text-cyan-400" size={16} />
                {horizons.editor.activeFile}
             </div>
             {horizons.editor.isDirty && <span className="text-[10px] text-yellow-500 font-bold uppercase">Unsaved</span>}
          </div>
          
          <div className="flex items-center gap-2">
             <div className="flex bg-black/20 rounded p-1 mr-4">
                <button className="p-1.5 rounded hover:bg-white/10 text-white"><Monitor size={14} /></button>
                <button className="p-1.5 rounded hover:bg-white/10 text-gray-500"><Smartphone size={14} /></button>
             </div>
             
             <Button 
                size="sm" 
                className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white gap-2"
             >
                <Sparkles size={12} /> Generate with AI
             </Button>

             <Button 
                size="sm" 
                variant="outline"
                className="h-7 text-xs border-white/10 gap-2"
                onClick={horizonsActions.save}
             >
                <Save size={12} /> Save
             </Button>
             
             <Button 
                size="sm" 
                className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white gap-2"
             >
                <Play size={12} /> Run
             </Button>
          </div>
       </div>

       {/* Main Area */}
       <div className="flex-1 flex overflow-hidden">
          {/* Component Sidebar */}
          <div className="w-64 border-r border-white/10 bg-[#252526] flex flex-col">
             <div className="p-3 text-xs font-bold text-gray-400 uppercase border-b border-white/5">Components</div>
             <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {horizons.components.map(comp => (
                   <div key={comp.id} className="p-2 rounded hover:bg-white/5 cursor-pointer flex items-center gap-2 group">
                      <Layers size={14} className="text-gray-500 group-hover:text-cyan-400" />
                      <div className="text-sm text-gray-300 group-hover:text-white">{comp.name}</div>
                   </div>
                ))}
             </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-[#1e1e1e] relative">
             <textarea 
                className="w-full h-full bg-transparent text-gray-300 font-mono text-sm p-4 outline-none resize-none"
                value={horizons.editor.code}
                onChange={(e) => horizonsActions.updateCode(e.target.value)}
                spellCheck="false"
             />
          </div>

          {/* Live Preview */}
          <div className="w-[40%] border-l border-white/10 bg-white flex flex-col">
             <div className="h-8 bg-gray-100 border-b flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                   <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                   <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white border h-5 rounded text-[10px] flex items-center px-2 text-gray-400 mx-4">
                   localhost:3000
                </div>
             </div>
             <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                 {/* Visual Representation of the Code (Mocked) */}
                 <div className="bg-white shadow-sm p-6 rounded-lg border max-w-sm mx-auto mt-10 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Hello Horizons</h1>
                    <p className="text-gray-600">Start building your vision.</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Click Me</button>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default HorizonsEditor;
