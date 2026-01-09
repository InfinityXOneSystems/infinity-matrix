
import React from 'react';
import { Lightbulb } from 'lucide-react';

const AdminKeep = () => (
   <div className="p-8 flex flex-col items-center justify-center h-full text-white text-center">
      <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-500 mb-4">
         <Lightbulb size={32} />
      </div>
      <h2 className="text-xl font-bold mb-2">Notes & Ideas</h2>
      <p className="text-white/40 max-w-md">Rapid capture for neural agent context.</p>
   </div>
);
export default AdminKeep;
