
import React, { useState } from 'react';
import { 
  Phone, MessageSquare, LayoutDashboard, GitMerge, 
  Settings, Voicemail, List, Shield 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TwilioDashboard from './TwilioDashboard';
import TwilioVoice from './TwilioVoice';
import TwilioSMS from './TwilioSMS';
import TwilioIVR from './TwilioIVR';

const AdminTwilio = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'voice', label: 'Voice & Dispatch', icon: Phone },
    { id: 'sms', label: 'Messaging', icon: MessageSquare },
    { id: 'ivr', label: 'IVR Studio', icon: GitMerge },
    { id: 'numbers', label: 'Phone Numbers', icon: List },
    { id: 'logs', label: 'Logs & Recordings', icon: Voicemail },
  ];

  const renderContent = () => {
    switch(activeTab) {
       case 'dashboard': return <TwilioDashboard />;
       case 'voice': return <TwilioVoice />;
       case 'sms': return <TwilioSMS />;
       case 'ivr': return <TwilioIVR />;
       default: return <div className="p-10 text-center text-white/40">Module loaded. Ready for configuration.</div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent text-white overflow-hidden rounded-tl-2xl border-l border-t border-white/10">
       {/* Twilio Header */}
       <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#F22F46] rounded flex items-center justify-center border border-[#F22F46]/20">
                <Phone className="text-white" size={20} />
             </div>
             <h1 className="font-bold text-lg">Twilio<span className="font-light opacity-60">Mirror</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs">
             <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full border border-red-500/20 text-red-400">
                <Shield size={12} />
                Status: Connected
             </div>
             <div className="text-white/40">SID: AC...8f91</div>
          </div>
       </div>

       <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-56 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col py-4">
             {tabs.map(tab => (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={cn(
                      "flex items-center gap-3 px-6 py-3 text-sm transition-colors border-l-2",
                      activeTab === tab.id 
                         ? "bg-white/5 text-white border-[#F22F46]" 
                         : "text-white/40 hover:text-white border-transparent hover:bg-white/5"
                   )}
                >
                   <tab.icon size={16} />
                   {tab.label}
                </button>
             ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-transparent">
             {renderContent()}
          </div>
       </div>
    </div>
  );
};

export default AdminTwilio;
