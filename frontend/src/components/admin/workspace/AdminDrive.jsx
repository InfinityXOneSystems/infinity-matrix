
import React from 'react';
import { HardDrive } from 'lucide-react';

const AdminDrive = () => (
   <div className="p-8 flex flex-col items-center justify-center h-full text-white text-center">
      <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
         <HardDrive size={32} />
      </div>
      <h2 className="text-xl font-bold mb-2">Drive Storage</h2>
      <p className="text-white/40 max-w-md">Access corporate file systems and shared drives.</p>
   </div>
);
export default AdminDrive;
