
import React from 'react';
import { FileText } from 'lucide-react';

const AdminDocs = () => (
   <div className="p-8 flex flex-col items-center justify-center h-full text-white text-center">
      <div className="w-16 h-16 bg-blue-400/20 rounded-2xl flex items-center justify-center text-blue-400 mb-4">
         <FileText size={32} />
      </div>
      <h2 className="text-xl font-bold mb-2">Documentation</h2>
      <p className="text-white/40 max-w-md">Collaborative editing environment.</p>
   </div>
);
export default AdminDocs;
