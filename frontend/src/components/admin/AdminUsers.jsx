
import React from 'react';
import { Users, UserPlus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminUsers = () => (
  <div className="p-6 text-white max-w-6xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-light flex items-center gap-2"><Users className="text-[#0066FF]" /> User Directory</h2>
      <Button className="bg-[#0066FF] text-white"><UserPlus size={16} className="mr-2" /> Add User</Button>
    </div>
    <div className="glass-panel rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl">
       <table className="w-full text-left">
          <thead className="bg-white/5 text-xs uppercase text-white/40 border-b border-white/10">
             <tr>
                <th className="p-4">Name</th>
                <th className="p-4 hidden md:table-cell">Role</th>
                <th className="p-4 hidden md:table-cell">Status</th>
                <th className="p-4 text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
             {[1,2,3].map(i => (
                <tr key={i} className="hover:bg-white/5">
                   <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0066FF] to-purple-500 border border-white/10" />
                      <div>
                         <div className="font-bold">Admin User {i}</div>
                         <div className="text-xs text-white/40">user{i}@infinity.ai</div>
                      </div>
                   </td>
                   <td className="p-4 hidden md:table-cell text-white/60">System Administrator</td>
                   <td className="p-4 hidden md:table-cell"><span className="text-green-400 text-xs px-2 py-1 rounded bg-green-400/10 border border-green-400/20">Active</span></td>
                   <td className="p-4 text-right"><MoreHorizontal className="ml-auto text-white/40 cursor-pointer hover:text-white" size={16} /></td>
                </tr>
             ))}
          </tbody>
       </table>
    </div>
  </div>
);

export default AdminUsers;
