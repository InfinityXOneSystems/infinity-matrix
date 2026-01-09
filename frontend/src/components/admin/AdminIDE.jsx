
import React, { useState } from 'react';
import { Save, Code, FileText, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdmin } from '@/lib/AdminProvider';
import { useToast } from '@/components/ui/use-toast';

const AdminIDE = () => {
  const { siteContent, updateContent } = useAdmin();
  const { toast } = useToast();
  const [activeFile, setActiveFile] = useState('home.hero.title');
  const [editorContent, setEditorContent] = useState(siteContent['home.hero.title'] || '');

  const handleFileSelect = (key) => {
    setActiveFile(key);
    setEditorContent(siteContent[key] || '');
  };

  const handleSave = () => {
    updateContent(activeFile, editorContent);
    toast({
      title: "Content Updated",
      description: `Updated ${activeFile} successfully. Check the live site.`,
      className: "bg-[#39FF14] text-black border-none"
    });
  };

  return (
    <div className="h-[600px] flex border border-white/10 rounded-xl overflow-hidden bg-[#0a0a0a]">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-[#050505] flex flex-col">
        <div className="p-4 border-b border-white/10 text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
           <Layout size={12} /> Site Content Keys
        </div>
        <div className="flex-1 overflow-y-auto">
          {Object.keys(siteContent).map(key => (
            <button
              key={key}
              onClick={() => handleFileSelect(key)}
              className={`w-full text-left px-4 py-3 text-xs font-mono transition-colors border-l-2 ${
                activeFile === key 
                  ? 'bg-white/5 text-[#39FF14] border-[#39FF14]' 
                  : 'text-white/50 hover:bg-white/5 border-transparent'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-10 bg-[#111] border-b border-white/10 flex items-center justify-between px-4">
           <div className="flex items-center gap-2 text-white/60 text-xs">
              <FileText size={12} /> {activeFile}
           </div>
           <Button size="sm" variant="ghost" onClick={handleSave} className="h-7 text-[#39FF14] hover:bg-[#39FF14]/10">
              <Save size={12} className="mr-2" /> Save Changes
           </Button>
        </div>
        <div className="flex-1 relative">
           <textarea 
             className="w-full h-full bg-[#0a0a0a] text-white p-6 font-mono text-sm focus:outline-none resize-none"
             value={editorContent}
             onChange={(e) => setEditorContent(e.target.value)}
           />
        </div>
      </div>
    </div>
  );
};

export default AdminIDE;
