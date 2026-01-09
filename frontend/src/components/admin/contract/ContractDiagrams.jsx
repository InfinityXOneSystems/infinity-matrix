
import React from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ERD_NODES, ERD_EDGES, AUTH_NODES, AUTH_EDGES } from './contractData';

const DiagramContainer = ({ initialNodes, initialEdges, title }) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[500px] border border-white/10 rounded-xl overflow-hidden bg-[#0A0A0A] relative group">
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded text-xs font-bold text-white uppercase tracking-wider border border-white/10">
        {title}
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#333" gap={20} />
        <Controls className="bg-black/50 border-white/10 fill-white" />
      </ReactFlow>
    </div>
  );
};

const ContractDiagrams = () => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Entity Relationship Diagram (ERD)</h3>
        <p className="text-sm text-white/50 mb-4">Visualizing core data relationships and dependencies.</p>
        <DiagramContainer initialNodes={ERD_NODES} initialEdges={ERD_EDGES} title="Core Entities" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Authentication & Data Flow</h3>
        <p className="text-sm text-white/50 mb-4">Request lifecycle from client to persistence layer.</p>
        <DiagramContainer initialNodes={AUTH_NODES} initialEdges={AUTH_EDGES} title="Request Lifecycle" />
      </div>
    </div>
  );
};

export default ContractDiagrams;
