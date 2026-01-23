
import React from 'react';
import { GitFork, PhoneIncoming, MessageSquare, Voicemail, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TwilioIVR = () => {
  const steps = [
    { id: 1, type: 'trigger', label: 'Incoming Call', icon: PhoneIncoming },
    { id: 2, type: 'say', label: 'Say: "Welcome to Infinity X"', icon: MessageSquare },
    { id: 3, type: 'gather', label: 'Gather Input (1-9)', icon: GitFork },
    { id: 4, type: 'split', label: 'Split Based on Input', icon: GitFork, branches: [
       { key: '1', label: 'Sales' },
       { key: '2', label: 'Support' }
    ]},
    { id: 5, type: 'action', label: 'Dial Agent Swarm', icon: PhoneIncoming }
  ];

  return (
    <div className="h-full bg-[#1e1e1e] rounded-xl border border-white/10 flex flex-col">
       <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#252526]">
          <div>
             <h2 className="text-lg font-light text-white">IVR Studio</h2>
             <p className="text-xs text-gray-500">Visual Call Flow Builder</p>
          </div>
          <Button className="bg-blue-600 text-white gap-2"><Plus size={16} /> Add Widget</Button>
       </div>

       <div className="flex-1 overflow-auto p-10 bg-[#111] relative">
          <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
             {steps.map((step, idx) => (
                <React.Fragment key={step.id}>
                   <div className="w-64 p-4 bg-[#252526] rounded-xl border border-white/10 shadow-xl relative group hover:border-blue-500/50 transition-colors cursor-pointer z-10">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <step.icon size={18} />
                         </div>
                         <div className="font-bold text-sm text-white uppercase">{step.type}</div>
                      </div>
                      <div className="text-sm text-gray-400">{step.label}</div>
                      
                      {step.branches && (
                         <div className="mt-4 space-y-2">
                            {step.branches.map(b => (
                               <div key={b.key} className="text-xs bg-black/20 p-2 rounded flex justify-between text-gray-400">
                                  <span>Press {b.key}</span>
                                  <span>&rarr; {b.label}</span>
                               </div>
                            ))}
                         </div>
                      )}
                   </div>
                   {idx < steps.length - 1 && (
                      <div className="h-8 w-px bg-white/10 flex items-center justify-center">
                         <ArrowRight size={12} className="text-white/20 rotate-90" />
                      </div>
                   )}
                </React.Fragment>
             ))}
             
             <div className="h-8 w-px bg-white/10" />
             <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-white/20 cursor-pointer hover:border-blue-500/50 hover:text-blue-500">
                <Plus size={20} />
             </div>
          </div>
       </div>
    </div>
  );
};

export default TwilioIVR;
