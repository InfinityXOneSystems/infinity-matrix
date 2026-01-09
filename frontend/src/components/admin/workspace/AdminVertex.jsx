
import React from 'react';
import { Sparkles } from 'lucide-react';

const AdminVertex = () => (
   <div className="p-8 flex flex-col items-center justify-center h-full text-white text-center">
      <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-500 mb-4">
         <Sparkles size={32} />
      </div>
      <h2 className="text-xl font-bold mb-2">Vertex AI Studio</h2>
      <p className="text-white/40 max-w-md">Model tuning and prompt engineering workbench.</p>
   </div>
);
export default AdminVertex;
