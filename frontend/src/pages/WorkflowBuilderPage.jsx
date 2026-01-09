
import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Plus, Save, Play, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';
import WorkflowNeuralGrid from '@/components/WorkflowNeuralGrid';

const WorkflowBuilderPage = () => {
  const { toast } = useToast();

  return (
    <>
      <Helmet>
        <title>Workflow Builder | Infinity X</title>
      </Helmet>
      
      <div className="h-screen pt-24 pb-6 px-4 md:px-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
           <div>
              <h1 className="text-2xl font-bold text-white">Quantum Workflow Engine</h1>
              <p className="text-white/50 text-sm">Visual automation builder</p>
           </div>
           <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => toast({ title: "Saved", description: "Workflow v1.2 saved." })}>
                 <Save size={14} className="mr-2" /> Save
              </Button>
              <Button size="sm" className="bg-[#0055FF] text-white hover:bg-[#0044CC]" onClick={() => toast({ title: "Running", description: "Workflow execution started." })}>
                 <Play size={14} className="mr-2" /> Execute
              </Button>
           </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
           {/* Sidebar - Tools - Silver Border Enforced */}
           <div className="glass-panel rounded-2xl p-4 overflow-y-auto">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Tools</h3>
              <div className="space-y-2">
                 {['Trigger', 'Action', 'Condition', 'Delay', 'Iterator', 'Agent Handoff'].map((tool) => (
                    <div 
                      key={tool} 
                      className="p-3 rounded-lg bg-white/5 border border-[#C0C0C0]/30 hover:border-[#39FF14] cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 text-white/80 hover:text-white"
                      draggable
                    >
                       <MousePointer2 size={16} />
                       <span className="text-sm font-medium">{tool}</span>
                    </div>
                 ))}
              </div>

              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mt-8 mb-4">Integrations</h3>
              <div className="space-y-2">
                 {['Slack', 'Gmail', 'GitHub', 'Notion', 'Stripe'].map((tool) => (
                    <div 
                      key={tool} 
                      className="p-3 rounded-lg bg-white/5 border border-[#C0C0C0]/30 hover:border-[#0055FF] cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 text-white/80 hover:text-white"
                      draggable
                    >
                       <div className="w-4 h-4 rounded-full bg-white/20" />
                       <span className="text-sm font-medium">{tool}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* Canvas Area - Silver Border Enforced */}
           <div className="lg:col-span-3 glass-panel rounded-2xl relative overflow-hidden bg-black/40 group">
              <div className="absolute inset-0 opacity-30">
                 <WorkflowNeuralGrid />
              </div>
              
              <div className="absolute top-4 left-4 p-2 bg-black/60 backdrop-blur-md border border-[#C0C0C0] rounded-lg">
                 <p className="text-xs text-white/60">Canvas Mode: <span className="text-[#39FF14]">Edit</span></p>
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                    <p className="text-white/30 text-lg mb-4">Drag and drop nodes to begin</p>
                    <Button variant="outline" className="pointer-events-auto bg-black/50" onClick={() => toast({ title: "Template Loaded" })}>
                       <Plus size={16} className="mr-2" /> Load Template
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowBuilderPage;
