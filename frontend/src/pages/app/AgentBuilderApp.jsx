
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  Bot, Save, Play, Code2, Brain, Activity, 
  Terminal, Database, Network, Shield, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useContent } from '@/hooks/useContent';
import { cn } from '@/lib/utils';

// The Advanced Agent Builder Tool
const AgentBuilderApp = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('config'); // config, skills, memory, deploy

  // Dynamic Content from Admin
  const title = useContent('agent.builder.title', 'Autonomous Agent Architect');
  const desc = useContent('agent.builder.desc', 'Design, configure, and deploy AI agents.');

  const handleDeploy = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Agent Deployed",
        description: "Your autonomous agent is now active on the network.",
        className: "bg-[#0066FF] text-white border-none"
      });
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Agent Builder | Infinity X</title>
      </Helmet>

      <div className="min-h-screen bg-[#050a14] pt-24 pb-12 px-4 md:px-8">
        
        {/* TOOL HEADER */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#39FF14]/30 bg-[#39FF14]/10 text-[#39FF14] text-[10px] font-bold uppercase tracking-widest mb-4"
          >
             <Bot size={12} /> System Active
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
          <p className="text-white/60">{desc}</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <div className="lg:col-span-1 space-y-2">
             {[
                { id: 'config', label: 'Core Configuration', icon: Bot },
                { id: 'skills', label: 'Skill Matrix', icon: Code2 },
                { id: 'memory', label: 'Memory & Context', icon: Database },
                { id: 'deploy', label: 'Deploy & Monitor', icon: Activity },
             ].map(tab => (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                      activeTab === tab.id 
                         ? "bg-[#39FF14]/10 border-[#39FF14] text-[#39FF14]"
                         : "bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10"
                   )}
                >
                   <tab.icon size={20} />
                   <span className="font-bold text-sm">{tab.label}</span>
                   {activeTab === tab.id && <ChevronRight size={16} className="ml-auto" />}
                </button>
             ))}
          </div>

          {/* MAIN CONFIGURATION PANEL */}
          <div className="lg:col-span-3">
             <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-black/40 min-h-[600px]">
                
                {/* TAB: CONFIGURATION */}
                {activeTab === 'config' && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Bot className="text-[#39FF14]" /> Agent Identity
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label className="text-white">Agent Name</Label>
                            <Input placeholder="e.g. Market Analyst Alpha" className="bg-black/20 text-white" />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-white">Role / Archetype</Label>
                            <select className="w-full h-10 rounded-md border border-[#C0C0C0] bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#39FF14]">
                              <option>Analyst</option>
                              <option>Developer</option>
                              <option>Creative</option>
                              <option>Executive</option>
                            </select>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <Label className="text-white">Primary Directive</Label>
                         <textarea 
                           className="w-full min-h-[120px] rounded-md border border-[#C0C0C0] bg-black/20 p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#39FF14]"
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
                   </motion.div>
                )}

                {/* TAB: SKILLS */}
                {activeTab === 'skills' && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Code2 className="text-[#3399FF]" /> Capabilities
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        {['Web Browsing', 'Code Execution', 'Image Generation', 'Data Analysis', 'Memory', 'API Access', 'Email', 'Slack Integration'].map((cap) => (
                          <label key={cap} className="flex items-center space-x-3 p-4 rounded-xl border border-[#C0C0C0]/30 hover:bg-white/5 cursor-pointer transition-all hover:border-[#39FF14]">
                            <input type="checkbox" className="w-5 h-5 rounded border-[#C0C0C0] text-[#39FF14] focus:ring-[#39FF14] bg-transparent" />
                            <span className="text-white/80 font-medium">{cap}</span>
                          </label>
                        ))}
                     </div>
                   </motion.div>
                )}

                {/* TAB: DEPLOY */}
                {activeTab === 'deploy' && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 flex flex-col items-center justify-center h-full pt-12">
                      <div className="w-32 h-32 rounded-full border-4 border-[#39FF14] flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(57,255,20,0.3)]">
                         <Play size={48} className="text-[#39FF14] ml-2" />
                      </div>
                      <div className="text-center max-w-md">
                         <h2 className="text-3xl font-bold text-white mb-4">Ready to Launch</h2>
                         <p className="text-white/60 mb-8">
                            Your agent configuration is valid. Deploying will consume 1 Node Credit per hour of active uptime.
                         </p>
                         <Button 
                           className="w-full bg-[#39FF14] text-black hover:bg-[#32cc12] font-bold shadow-[0_0_20px_rgba(57,255,20,0.4)] py-6 text-lg"
                           onClick={handleDeploy}
                           disabled={loading}
                         >
                           {loading ? 'Initializing Neural Link...' : 'DEPLOY TO NETWORK'}
                         </Button>
                      </div>
                   </motion.div>
                )}

                {/* Placeholder for other tabs */}
                {activeTab === 'memory' && (
                   <div className="text-center text-white/40 pt-20">Memory Configuration Panel</div>
                )}

             </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AgentBuilderApp;
