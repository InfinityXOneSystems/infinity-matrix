
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Shield, MoreVertical, Check, User, DollarSign, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

// Mock Data
const MOCK_USERS = [
  { id: 'u1', name: 'Alice Chen', email: 'alice@example.com', role: 'admin', status: 'active', lastActive: '2 min ago' },
  { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', role: 'investor', status: 'active', lastActive: '1 hr ago' },
  { id: 'u3', name: 'Charlie Day', email: 'charlie@example.com', role: 'user', status: 'inactive', lastActive: '2 days ago' },
  { id: 'u4', name: 'Dana White', email: 'dana@example.com', role: 'user', status: 'active', lastActive: '5 min ago' },
  { id: 'u5', name: 'Eve Black', email: 'eve@example.com', role: 'user', status: 'active', lastActive: '1 min ago' },
];

const AdminUserManagement = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    toast({
      title: "Role Updated",
      description: `User permissions updated to ${newRole}.`,
      className: "bg-[#39FF14] text-black border-none"
    });
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <Crown size={14} className="text-yellow-500" />;
      case 'investor': return <DollarSign size={14} className="text-[#39FF14]" />;
      default: return <User size={14} className="text-white/60" />;
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="text-[#0066FF]" /> User Management
          </h2>
          <p className="text-white/50 text-sm">Manage access controls and roles.</p>
        </div>
        <div className="bg-white/5 p-1 rounded-lg border border-white/10 flex items-center">
          <span className="text-xs font-bold px-3 py-1">Total Users: {users.length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 items-center bg-black/20 p-4 rounded-xl border border-white/10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <Input 
            placeholder="Search users..." 
            className="pl-10 bg-transparent border-white/10 text-white placeholder:text-white/30 focus:border-[#0066FF]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
          <Filter size={18} />
        </Button>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/40 uppercase tracking-wider text-xs">
            <tr>
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Last Active</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/20 flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-white/40 text-xs">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-transparent border-none text-white/80 focus:ring-0 cursor-pointer text-xs uppercase font-bold"
                    >
                      <option value="user" className="bg-black text-white">User</option>
                      <option value="investor" className="bg-black text-white">Investor</option>
                      <option value="admin" className="bg-black text-white">Admin</option>
                    </select>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                    user.status === 'active' 
                      ? 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20' 
                      : 'bg-white/10 text-white/40 border-white/10'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-white/40 text-xs font-mono">
                  {user.lastActive}
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white">
                    <MoreVertical size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagement;
