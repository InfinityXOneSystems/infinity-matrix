
import React, { useState } from 'react';
import { Send, User, Bot, Search, MoreHorizontal } from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TwilioSMS = () => {
  const { twilio, twilioActions } = useAdmin();
  const [activeChat, setActiveChat] = useState('+1 (555) 123-4567');
  const [messageInput, setMessageInput] = useState('');

  const handleSend = () => {
     if (!messageInput.trim()) return;
     twilioActions.sendMessage(activeChat, messageInput);
     setMessageInput('');
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden">
       {/* Sidebar List */}
       <div className="w-80 bg-[#252526] border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/5">
             <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input placeholder="Search conversations..." className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-blue-500/50 outline-none" />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
             {['+1 (555) 123-4567', '+1 (646) 999-0000', '+44 7700 900077'].map(num => (
                <div 
                   key={num}
                   onClick={() => setActiveChat(num)}
                   className={cn(
                      "p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors",
                      activeChat === num ? "bg-blue-500/10 border-l-4 border-l-blue-500" : "border-l-4 border-l-transparent"
                   )}
                >
                   <div className="flex justify-between mb-1">
                      <div className="font-bold text-white text-sm font-mono truncate">{num}</div>
                      <div className="text-[10px] text-gray-500">2m</div>
                   </div>
                   <div className="text-xs text-gray-400 truncate">Last message content preview...</div>
                </div>
             ))}
          </div>
       </div>

       {/* Chat Area */}
       <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#252526]">
             <div>
                <div className="font-bold text-white">{activeChat}</div>
                <div className="text-xs text-green-400 flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Agent Active
                </div>
             </div>
             <Button variant="ghost" size="icon"><MoreHorizontal size={16} className="text-gray-400" /></Button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4">
             {twilio.messages.filter(m => m.from === activeChat || m.to === activeChat).map(msg => (
                <div key={msg.id} className={cn("flex gap-3 max-w-[80%]", msg.direction === 'outbound' ? "ml-auto flex-row-reverse" : "")}>
                   <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      msg.direction === 'outbound' ? "bg-blue-600" : "bg-gray-600"
                   )}>
                      {msg.direction === 'outbound' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
                   </div>
                   <div className={cn(
                      "p-3 rounded-2xl text-sm",
                      msg.direction === 'outbound' ? "bg-blue-600/20 text-white rounded-tr-none" : "bg-white/10 text-white rounded-tl-none"
                   )}>
                      {msg.body}
                      <div className="text-[10px] opacity-40 mt-1 text-right">{msg.time}</div>
                   </div>
                </div>
             ))}
             {twilio.messages.length === 0 && <div className="text-center text-gray-500 mt-10">No messages yet</div>}
          </div>

          <div className="p-4 bg-[#252526] border-t border-white/5">
             <div className="flex gap-2">
                <input 
                   value={messageInput}
                   onChange={(e) => setMessageInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                   placeholder="Type a message or use /agent command..." 
                   className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-blue-500/50 outline-none" 
                />
                <Button onClick={handleSend} size="icon" className="bg-blue-600 hover:bg-blue-700 text-white">
                   <Send size={16} />
                </Button>
             </div>
             <div className="text-[10px] text-gray-500 mt-2">
                Agent 'Vertex' will auto-respond if idle for 5 minutes.
             </div>
          </div>
       </div>
    </div>
  );
};

export default TwilioSMS;
