
import React from 'react';
import { BarChart3, TrendingUp, Users, Globe } from 'lucide-react';

const AdminAnalytics = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Platform Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl border border-white/10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider">Total Traffic</p>
              <h3 className="text-2xl font-bold text-white mt-1">2.4M</h3>
            </div>
            <Globe className="text-[#0066FF]" />
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#0066FF] w-[70%]" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-white/10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider">Conversion Rate</p>
              <h3 className="text-2xl font-bold text-white mt-1">4.2%</h3>
            </div>
            <TrendingUp className="text-[#39FF14]" />
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#39FF14] w-[45%]" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-white/10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider">Active Users</p>
              <h3 className="text-2xl font-bold text-white mt-1">18.5k</h3>
            </div>
            <Users className="text-purple-500" />
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-[85%]" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-white/10 h-64 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40">Detailed visualization engine initializing...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
