
import React, { useState } from 'react';
import { 
  Bot, Plus, Play, GitMerge, Copy, 
  Settings, Trash2, Cpu, Zap, Layers 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/lib/AdminProvider';
import { useToast } from '@/components/ui/use-toast';

export const AgentWorkstation = () => {
  const { agents, swarms, createSwarm, executeAgent } = useAdmin();
  const [activeView, setActiveView] = useState('builder'); // builder, replicator, swarms
  const [draggedAgent, setDraggedAgent] = useState(null);
  const [workflow, setWorkflow] = useState([]);
  const { toast } = useToast();

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedAgent) {
      setWorkflow([...workflow, { ...draggedAgent, instanceId: Date.now() }]);
      setDraggedAgent(null);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const runWorkflow = () => {
    toast({ title: "Workflow Started", description: `Executing chain with ${workflow.length} agents.` });
    workflow.forEach((node, i) => {
      setTimeout(() => executeAgent(node.id, "Workflow Task"), i * 1500);
    });
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] text-white overflow-hidden">
      {/* Toolbox */}
      <div className="w-64 border-r border-white/10 flex flex-col bg-[#252526]">
        <div className="p-3 bg-[#333333] font-xs font-bold text-gray-300 uppercase">Agent Toolkit</div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {agents.map(agent => (
            <div
              key={agent.id}
              draggable
              onDragStart={() => setDraggedAgent(agent)}
              className="p-3 bg-[#3c3c3c] rounded border border-white/5 cursor-grab hover:bg-[#444] flex items-center gap-3"
            >
              <Bot size={16} className="text-blue-400" />
              <div>
                <div className="text-sm font-medium">{agent.name}</div>
                <div className="text-[10px] text-gray-400">{agent.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col">
        <div className="h-10 border-b border-white/10 flex items-center px-4 bg-[#2d2d2d] gap-4">
          <button onClick={() => setActiveView('builder')} className={cn("text-xs font-bold uppercase hover:text-white", activeView === 'builder' ? "text-blue-400" : "text-gray-400")}>Workflow Builder</button>
          <button onClick={() => setActiveView('swarms')} className={cn("text-xs font-bold uppercase hover:text-white", activeView === 'swarms' ? "text-blue-400" : "text-gray-400")}>Swarm Creator</button>
          <button onClick={() => setActiveView('replicator')} className={cn("text-xs font-bold uppercase hover:text-white", activeView === 'replicator' ? "text-blue-400" : "text-gray-400")}>Replicator</button>
        </div>

        <div className="flex-1 bg-[#1e1e1e] relative p-8 overflow-auto" onDrop={handleDrop} onDragOver={handleDragOver}>
          {activeView === 'builder' && (
            <div className="h-full">
              {workflow.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-700 rounded-xl">
                  <Layers size={48} className="mb-4 opacity-50" />
                  <p>Drag agents here to build a workflow</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  {workflow.map((node, i) => (
                    <div key={node.instanceId} className="relative">
                      <div className="w-64 p-4 bg-[#2d2d2d] rounded-lg border border-blue-500/30 shadow-lg flex items-center gap-4">
                        <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                          <Bot size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{node.name}</div>
                          <div className="text-xs text-gray-400">Step {i + 1}</div>
                        </div>
                        <button onClick={() => setWorkflow(workflow.filter(n => n.instanceId !== node.instanceId))} className="ml-auto text-gray-500 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {i < workflow.length - 1 && (
                        <div className="h-8 w-px bg-gray-600 mx-auto my-1" />
                      )}
                    </div>
                  ))}
                  <Button onClick={runWorkflow} className="mt-8 bg-green-600 hover:bg-green-700 text-white gap-2">
                    <Play size={16} /> Execute Workflow
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeView === 'swarms' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-white/10 bg-[#252526]">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Zap className="text-yellow-400" /> Active Swarms</h3>
                {swarms.length === 0 && <p className="text-gray-500 text-sm">No active swarms.</p>}
                {swarms.map(swarm => (
                  <div key={swarm.id} className="p-3 mb-2 bg-black/20 rounded border border-white/5">
                    <div className="font-medium">{swarm.name}</div>
                    <div className="text-xs text-gray-400">{swarm.agents.length} Agents • {swarm.status}</div>
                  </div>
                ))}
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-[#252526]">
                <h3 className="text-lg font-bold mb-4">Create New Swarm</h3>
                <div className="space-y-4">
                  <input placeholder="Swarm Name" className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm text-white" />
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400 uppercase">Select Agents</div>
                    <div className="flex flex-wrap gap-2">
                      {agents.map(a => (
                        <span key={a.id} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs cursor-pointer hover:bg-blue-500/20">{a.name}</span>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => createSwarm("New Swarm", agents.slice(0,3))} className="w-full bg-blue-600">Initialize Swarm</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
