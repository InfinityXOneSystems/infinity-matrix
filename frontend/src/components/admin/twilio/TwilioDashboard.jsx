
import React from 'react';
import { Phone, MessageSquare, Clock, DollarSign, Activity } from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';

const TwilioDashboard = () => {
  const { twilio } = useAdmin();
  const stats = twilio?.stats || { activeCalls: 0, totalSMS: 0, totalMinutes: 0, costToday: '$0.00' };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-red-500/20 text-red-400">
                  <Phone size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-red-500/10 text-red-400">Live</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.activeCalls}</div>
            <div className="text-sm text-gray-400">Active Calls</div>
         </div>
         
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                  <MessageSquare size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400">+12%</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalSMS.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Messages Sent</div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-orange-500/20 text-orange-400">
                  <Clock size={24} />
               </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalMinutes.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Voice Minutes</div>
         </div>

         <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
                  <DollarSign size={24} />
               </div>
               <div className="text-xs font-bold px-2 py-1 rounded bg-green-500/10 text-green-400">Balance: {twilio?.balance || '$0.00'}</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.costToday}</div>
            <div className="text-sm text-gray-400">Cost Today</div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5 h-80 flex flex-col justify-center items-center text-gray-500">
            <Activity className="mb-4 opacity-20" size={48} />
            <p>Call Volume & API Latency Graph</p>
         </div>
         <div className="p-6 bg-[#252526] rounded-xl border border-white/5 h-80 overflow-y-auto font-mono text-xs">
            <div className="mb-2 text-gray-400 font-bold uppercase sticky top-0 bg-[#252526] pb-2">Telephony Event Stream</div>
            <div className="space-y-2">
               <div className="text-blue-400">[VOICE] Incoming call on +1 (415) 555-0123</div>
               <div className="text-gray-400">[AGENT] Vertex Agent assigned to active call</div>
               <div className="text-green-400">[SMS] Message delivered to +1 (555) 999-8888</div>
               <div className="text-gray-400">[IVR] User selected option 2 (Technical Support)</div>
               <div className="text-yellow-400">[BILLING] Low balance warning threshold approaching</div>
               <div className="text-gray-400">[TRANSCRIPTION] "...I would like to upgrade my plan..."</div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TwilioDashboard;
