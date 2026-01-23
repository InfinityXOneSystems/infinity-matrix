
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Save, Play, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';

const AgentCreatorPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDeploy = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Agent Deployed",
        description: "Your autonomous agent is now active on the network.",
        variant: "default" // This will use our custom toast style if configured
      });
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Agent Creator | Infinity X</title>
      </Helmet>

      <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Autonomous Agent Architect</h1>
          <p className="text-white/60">Design, configure, and deploy AI agents.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Configuration Panel - Silver Border Enforced */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass-panel p-8 rounded-2xl">
               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <Bot className="text-[#39FF14]" /> Core Configuration
               </h2>
               
               <div className="space-y-6">
                 <div className="space-y-2">
                   <Label className="text-white">Agent Name</Label>
                   <Input placeholder="e.g. Market Analyst Alpha" className="bg-black/20 text-white" />
                 </div>
                 
                 <div className="space-y-2">
                   <Label className="text-white">Primary Directive</Label>
                   <textarea 
                     className="w-full min-h-[120px] rounded-md border border-[#C0C0C0] bg-black/20 p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#39FF14] hover:border-[#39FF14]/50 transition-all"
                     placeholder="Describe the agent's main goal..."
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Model</Label>
                      <select className="w-full h-10 rounded-md border border-[#C0C0C0] bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#39FF14]">
                        <option>GPT-4 Turbo</option>
                        <option>Claude 3 Opus</option>
                        <option>Llama 3 70B</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Temperature</Label>
                      <Input type="number" placeholder="0.7" className="bg-black/20 text-white" />
                    </div>
                 </div>
               </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <Code2 className="text-[#0055FF]" /> Capabilities
               </h2>
               <div className="grid grid-cols-2 gap-4">
                  {['Web Browsing', 'Code Execution', 'Image Generation', 'Data Analysis', 'Memory', 'API Access'].map((cap) => (
                    <label key={cap} className="flex items-center space-x-3 p-3 rounded-lg border border-[#C0C0C0]/30 hover:bg-white/5 cursor-pointer transition-all hover:border-[#39FF14]">
                      <input type="checkbox" className="w-4 h-4 rounded border-[#C0C0C0] text-[#39FF14] focus:ring-[#39FF14]" />
                      <span className="text-white/80 text-sm">{cap}</span>
                    </label>
                  ))}
               </div>
            </div>
          </div>

          {/* Preview Panel - Silver Border Enforced */}
          <div className="space-y-6">
             <div className="glass-panel p-6 rounded-2xl sticky top-24">
                <h3 className="text-lg font-bold text-white mb-4">Deployment Status</h3>
                
                <div className="space-y-4 mb-8">
                   <div className="flex justify-between text-sm">
                      <span className="text-white/60">Compute Cost</span>
                      <span className="text-white font-mono">~$0.04/hr</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-white/60">Estimated Latency</span>
                      <span className="text-white font-mono">140ms</span>
                   </div>
                </div>

                <div className="space-y-3">
                   <Button 
                     className="w-full bg-[#39FF14] text-black hover:bg-[#32cc12] font-bold shadow-[0_0_20px_rgba(57,255,20,0.4)]"
                     onClick={handleDeploy}
                     disabled={loading}
                   >
                     {loading ? 'Initializing...' : (
                       <><Play size={16} className="mr-2" /> Deploy Agent</>
                     )}
                   </Button>
                   <Button variant="outline" className="w-full" onClick={() => toast({ title: "Draft Saved" })}>
                     <Save size={16} className="mr-2" /> Save Draft
                   </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-[#C0C0C0]/20">
                   <p className="text-xs text-white/40 text-center">
                      Agents are subject to the Titan Safety Protocol.
                   </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AgentCreatorPage;
