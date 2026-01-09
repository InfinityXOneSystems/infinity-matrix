
import React, { useState } from 'react';
import { 
  Phone, PhoneOff, Mic, MicOff, MoreVertical, 
  Play, Pause, User, Bot, Signal, Volume2 
} from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TwilioVoice = () => {
  const { twilio, twilioActions, agents } = useAdmin();
  const [dialNumber, setDialNumber] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(agents[0]?.id || '');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
       {/* Softphone Dialer */}
       <div className="col-span-1 flex flex-col gap-6">
          <div className="p-6 bg-[#252526] rounded-xl border border-white/5 shadow-lg">
             <div className="mb-6">
                <div className="text-xs font-bold text-gray-400 uppercase mb-2">Outbound Line</div>
                <div className="text-lg text-white font-mono flex items-center justify-between bg-black/20 p-3 rounded border border-white/10">
                   {dialNumber || "Enter number..."}
                   {dialNumber && <span onClick={() => setDialNumber(prev => prev.slice(0, -1))} className="cursor-pointer text-gray-500 hover:text-white">⌫</span>}
                </div>
             </div>
             
             <div className="grid grid-cols-3 gap-3 mb-6">
                {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(key => (
                   <button 
                      key={key}
                      onClick={() => setDialNumber(prev => prev + key)}
                      className="h-12 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-xl transition-colors"
                   >
                      {key}
                   </button>
                ))}
             </div>

             <div className="space-y-4">
                <div>
                   <label className="text-xs text-gray-400 mb-1 block">Assign Agent</label>
                   <select 
                      value={selectedAgent} 
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm text-white"
                   >
                      {agents.map(a => (
                         <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                   </select>
                </div>
                <Button 
                   onClick={() => twilioActions.makeCall(dialNumber, twilio.numbers[0]?.phoneNumber, selectedAgent)}
                   disabled={!dialNumber}
                   className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                >
                   <Phone size={20} /> Call Now
                </Button>
             </div>
          </div>
       </div>

       {/* Active Calls & History */}
       <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          {/* Active Calls List */}
          <div className="p-6 bg-[#252526] rounded-xl border border-white/5">
             <h3 className="text-lg font-light text-white mb-4 flex items-center gap-2">
                <Signal className="text-green-400 animate-pulse" /> Active Sessions
             </h3>
             <div className="space-y-3">
                {twilio.activeCalls.length === 0 ? (
                   <div className="text-gray-500 text-sm py-4 text-center">No active calls</div>
                ) : (
                   twilio.activeCalls.map(call => (
                      <div key={call.id} className="p-4 bg-black/20 rounded-lg border border-white/5 flex flex-col gap-3">
                         <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                  <User size={20} className="text-gray-400" />
                               </div>
                               <div>
                                  <div className="font-bold text-white text-lg">{call.from}</div>
                                  <div className="text-xs text-blue-400 flex items-center gap-1">
                                     <Bot size={12} /> Agent: {call.agentId}
                                  </div>
                               </div>
                            </div>
                            <div className="text-right">
                               <div className="text-2xl font-mono text-white">{call.duration}</div>
                               <div className="text-xs text-green-400 uppercase font-bold">{call.status}</div>
                            </div>
                         </div>
                         
                         {/* Live Transcription Simulation */}
                         <div className="bg-black/40 p-3 rounded text-sm text-gray-300 font-mono relative overflow-hidden">
                            <div className="absolute top-2 right-2 flex gap-1">
                               <span className="w-1 h-3 bg-green-500 rounded-full animate-pulse" />
                               <span className="w-1 h-3 bg-green-500 rounded-full animate-pulse delay-75" />
                               <span className="w-1 h-3 bg-green-500 rounded-full animate-pulse delay-150" />
                            </div>
                            <span className="text-white/40 uppercase text-[10px] block mb-1">Live Transcript</span>
                            {call.transcription || "Listening for audio stream..."}
                         </div>

                         <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white"><MicOff size={16} /></Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white"><MoreVertical size={16} /></Button>
                            <Button 
                               size="sm" 
                               onClick={() => twilioActions.endCall(call.id)}
                               className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                            >
                               <PhoneOff size={16} className="mr-2" /> End Call
                            </Button>
                         </div>
                      </div>
                   ))
                )}
             </div>
          </div>

          {/* Call Logs */}
          <div className="flex-1 bg-[#252526] rounded-xl border border-white/5 p-6 overflow-hidden flex flex-col">
             <h3 className="text-lg font-light text-white mb-4">Call History</h3>
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-sm">
                   <thead className="text-xs uppercase text-white/40 font-semibold border-b border-white/5">
                      <tr>
                         <th className="pb-2">Caller</th>
                         <th className="pb-2">Direction</th>
                         <th className="pb-2">Duration</th>
                         <th className="pb-2">Cost</th>
                         <th className="pb-2 text-right">Recording</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5 text-gray-300">
                      {[1,2,3].map(i => (
                         <tr key={i} className="hover:bg-white/5">
                            <td className="py-3 font-mono">+1 (415) 555-09{i}2</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs uppercase">Inbound</span></td>
                            <td className="py-3">4:12</td>
                            <td className="py-3">$0.06</td>
                            <td className="py-3 text-right">
                               <Button size="icon" variant="ghost" className="h-6 w-6 text-gray-400 hover:text-white">
                                  <Play size={12} />
                               </Button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
       </div>
    </div>
  );
};

export default TwilioVoice;
