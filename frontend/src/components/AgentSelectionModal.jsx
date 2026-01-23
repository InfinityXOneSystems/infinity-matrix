
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, Check, User, Code, Brain, LineChart, ShieldCheck, 
  Stethoscope, Factory, Scale, Zap, Briefcase, Plus, Terminal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
// Note: In a real implementation, you'd import firestore methods here to save the user's choice

const AGENTS = [
  {
    id: 'agent_1',
    name: 'Atlas Prime',
    role: 'Strategic Architect',
    traits: ['Visionary', 'Analytical', 'Decisive'],
    skills: ['System Design', 'Market Analysis', 'Roadmapping'],
    industry: 'Technology',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'agent_2',
    name: 'Nova Spark',
    role: 'Creative Director',
    traits: ['Innovative', 'Artistic', 'Empathetic'],
    skills: ['UI/UX Design', 'Branding', 'Content Strategy'],
    industry: 'Design',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'agent_3',
    name: 'Cipher Sentinel',
    role: 'Security Specialist',
    traits: ['Vigilant', 'Precise', 'Cautious'],
    skills: ['Cybersecurity', 'Audit', 'Risk Assessment'],
    industry: 'Security',
    icon: <ShieldCheck className="w-6 h-6" />,
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'agent_4',
    name: 'Quantus Flux',
    role: 'Financial Analyst',
    traits: ['Logical', 'Data-Driven', 'Strategic'],
    skills: ['Forecasting', 'Trading', 'Wealth Management'],
    industry: 'Finance',
    icon: <LineChart className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'agent_5',
    name: 'Helix Medica',
    role: 'Health Consultant',
    traits: ['Compassionate', 'Knowledgeable', 'Ethical'],
    skills: ['Diagnostics', 'Research', 'Patient Care'],
    industry: 'Healthcare',
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'from-teal-400 to-blue-400'
  },
  {
    id: 'agent_6',
    name: 'Forge Titan',
    role: 'Industrial Engineer',
    traits: ['Practical', 'Efficient', 'Robust'],
    skills: ['Supply Chain', 'Automation', 'Logistics'],
    industry: 'Manufacturing',
    icon: <Factory className="w-6 h-6" />,
    color: 'from-amber-500 to-yellow-500'
  },
  {
    id: 'agent_7',
    name: 'Lex Aeterna',
    role: 'Legal Advisor',
    traits: ['Objective', 'Detail-Oriented', 'Persuasive'],
    skills: ['Contract Law', 'Compliance', 'Negotiation'],
    industry: 'Legal',
    icon: <Scale className="w-6 h-6" />,
    color: 'from-indigo-500 to-violet-500'
  },
  {
    id: 'agent_8',
    name: 'Code Weaver',
    role: 'Full-Stack Dev',
    traits: ['Technical', 'Problem-Solver', 'Agile'],
    skills: ['React', 'Node.js', 'Cloud Architecture'],
    industry: 'Software',
    icon: <Terminal className="w-6 h-6" />,
    color: 'from-slate-500 to-zinc-500'
  },
  {
    id: 'agent_9',
    name: 'Growth Vector',
    role: 'Marketing Lead',
    traits: ['Charismatic', 'Insightful', 'Trends-Focused'],
    skills: ['SEO', 'Campaigns', 'Growth Hacking'],
    industry: 'Marketing',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'from-rose-500 to-red-500'
  },
  {
    id: 'agent_10',
    name: 'Quantum Sage',
    role: 'Research Scientist',
    traits: ['Curious', 'Academic', 'Theoretical'],
    skills: ['Physics', 'Data Science', 'Experimentation'],
    industry: 'Science',
    icon: <Bot className="w-6 h-6" />,
    color: 'from-cyan-400 to-blue-600'
  }
];

const AgentSelectionModal = ({ user, onComplete }) => {
  const { toast } = useToast();
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [mode, setMode] = useState('browse'); // 'browse' or 'create'
  
  // Custom Agent Form State
  const [customAgent, setCustomAgent] = useState({
    name: '',
    role: '',
    industry: '',
    traits: '',
    instructions: ''
  });

  const handleSelect = (id) => {
    setSelectedAgentId(id);
  };

  const handleConfirmSelection = () => {
    const agent = AGENTS.find(a => a.id === selectedAgentId);
    if (agent) {
      // In a real app: await saveToFirestore(user.uid, agent);
      console.log("Saving agent preference:", agent.name);
      onComplete(agent);
    }
  };

  const handleCreateCustom = (e) => {
    e.preventDefault();
    if (!customAgent.name || !customAgent.role) {
      toast({ title: "Incomplete Profile", description: "Name and Role are required.", variant: "destructive" });
      return;
    }

    const newAgent = {
      id: `custom_${Date.now()}`,
      name: customAgent.name,
      role: customAgent.role,
      industry: customAgent.industry || 'General',
      traits: customAgent.traits.split(',').map(t => t.trim()),
      skills: ['Custom Logic', 'User Defined'],
      icon: <User className="w-6 h-6" />,
      color: 'from-white to-gray-400',
      isCustom: true
    };

    // In a real app: await saveToFirestore(user.uid, newAgent);
    console.log("Saving custom agent:", newAgent);
    onComplete(newAgent);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg overflow-y-auto"
    >
      <div className="relative w-full max-w-6xl my-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Select Your <span className="text-[#39FF14] text-glow-green">AI Partner</span></h2>
            <p className="text-white/50 text-lg">Choose a specialized neural personality to augment your workflow.</p>
          </motion.div>
        </div>

        {mode === 'browse' ? (
          <>
            {/* Agent Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
              
              {/* Custom Create Card */}
              <motion.button
                onClick={() => setMode('create')}
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-[#39FF14]/10 hover:border-[#39FF14] transition-all group min-h-[280px]"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:bg-[#39FF14] group-hover:text-black transition-colors">
                  <Plus size={32} />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#39FF14]">Create Custom</h3>
                <p className="text-sm text-white/40 mt-2 text-center">Design a unique agent with specific parameters.</p>
              </motion.button>

              {/* Pre-made Agents */}
              {AGENTS.map((agent) => (
                <motion.div
                  key={agent.id}
                  onClick={() => handleSelect(agent.id)}
                  whileHover={{ y: -5 }}
                  className={cn(
                    "relative p-6 rounded-xl border bg-black/40 backdrop-blur-md cursor-pointer transition-all duration-300 flex flex-col h-full min-h-[280px]",
                    selectedAgentId === agent.id 
                      ? "border-[#39FF14] shadow-[0_0_30px_rgba(57,255,20,0.2)] bg-black/80" 
                      : "border-white/10 hover:border-[#39FF14]/50 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)]"
                  )}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center mb-4 text-white shadow-lg`}>
                    {agent.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
                  <div className="text-xs font-bold text-[#39FF14] uppercase tracking-wider mb-3">{agent.role}</div>
                  
                  <div className="space-y-3 mb-4 flex-1">
                    <div className="flex flex-wrap gap-1.5">
                      {agent.traits.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-white/60 border border-white/5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">{agent.industry}</span>
                      {selectedAgentId === agent.id ? (
                         <div className="flex items-center gap-1 text-[#39FF14] text-xs font-bold animate-pulse">
                            <Check size={14} /> Selected
                         </div>
                      ) : (
                         <span className="text-xs text-white/20 group-hover:text-white">Click to select</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="mt-8 flex justify-center">
              <Button 
                size="lg"
                disabled={!selectedAgentId}
                onClick={handleConfirmSelection}
                className="w-full max-w-md h-14 text-lg bg-[#39FF14] text-black font-bold uppercase tracking-widest hover:bg-[#32cc12] hover:shadow-[0_0_40px_rgba(57,255,20,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {selectedAgentId ? 'Confirm Neural Link' : 'Select a Partner'}
              </Button>
            </div>
          </>
        ) : (
          /* Create Mode */
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto bg-black/60 border border-white/20 p-8 rounded-2xl backdrop-blur-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Code className="text-[#39FF14]" /> Construct Custom Agent
            </h3>
            
            <form onSubmit={handleCreateCustom} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Agent Designation (Name)</label>
                  <Input 
                    placeholder="e.g. Nexus One" 
                    value={customAgent.name}
                    onChange={e => setCustomAgent({...customAgent, name: e.target.value})}
                    className="bg-white/5 border-white/10 focus:border-[#39FF14]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Primary Role</label>
                  <Input 
                    placeholder="e.g. Data Scientist" 
                    value={customAgent.role}
                    onChange={e => setCustomAgent({...customAgent, role: e.target.value})}
                    className="bg-white/5 border-white/10 focus:border-[#39FF14]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Personality Traits (comma separated)</label>
                <Input 
                  placeholder="e.g. Analytical, Witty, Strict" 
                  value={customAgent.traits}
                  onChange={e => setCustomAgent({...customAgent, traits: e.target.value})}
                  className="bg-white/5 border-white/10 focus:border-[#39FF14]"
                />
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-medium text-white/70">Custom Instructions / Context</label>
                 <textarea 
                    className="w-full h-32 rounded-md bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-[#39FF14] resize-none"
                    placeholder="Describe how this agent should behave, what knowledge it possesses, and its operational parameters..."
                    value={customAgent.instructions}
                    onChange={e => setCustomAgent({...customAgent, instructions: e.target.value})}
                 />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setMode('browse')}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Back to Selection
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-[#39FF14] text-black font-bold hover:bg-[#32cc12] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]"
                >
                  Initialize Agent
                </Button>
              </div>
            </form>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
};

export default AgentSelectionModal;
