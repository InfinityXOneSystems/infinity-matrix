
import React from 'react';
import { Power, Activity, Settings, RefreshCw, Plug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const IntegrationPanel = ({ 
  title, 
  icon: Icon, 
  connected, 
  color, 
  children, 
  onConnect, 
  onDisconnect, 
  onTest 
}) => {
  return (
    <div className={cn(
       "glass-panel p-6 rounded-xl border-2 transition-all duration-300 flex flex-col h-full relative overflow-hidden group",
       connected ? "border-[#39FF14]/30 bg-black/60 shadow-[0_0_20px_rgba(57,255,20,0.1)]" : "border-white/10 bg-black/30 opacity-100"
    )}>
       {/* Connection Status Indicator */}
       <div className={cn(
          "absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl border-b border-l flex items-center gap-1.5",
          connected ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-white/5 text-white/40 border-white/10"
       )}>
          <div className={cn("w-1.5 h-1.5 rounded-full", connected ? "bg-green-400 animate-pulse" : "bg-white/40")} />
          {connected ? "Active" : "Not Configured"}
       </div>

       <div className="flex items-center gap-4 mb-6">
          <div className={cn(
             "p-3 rounded-lg border shadow-lg transition-transform group-hover:scale-105",
             connected ? `bg-opacity-10 border-opacity-30` : "bg-white/5 border-white/10 grayscale"
          )} style={{ backgroundColor: connected ? 'rgba(255,255,255,0.1)' : '', borderColor: connected ? 'rgba(255,255,255,0.2)' : '' }}>
             <Icon size={24} className={cn(color)} />
          </div>
          <div>
             <h3 className="font-bold text-lg text-white">{title}</h3>
             <div className="flex gap-2 mt-1">
                {connected && (
                   <button onClick={onTest} className="text-[10px] text-white/40 hover:text-[#39FF14] flex items-center gap-1 transition-colors">
                      <Activity size={10} /> Test Connection
                   </button>
                )}
             </div>
          </div>
       </div>

       <div className="flex-1 mb-6">
          {children}
       </div>

       <div className="mt-auto flex gap-2 pt-4 border-t border-white/5">
          {connected ? (
             <Button size="sm" variant="outline" onClick={onDisconnect} className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs h-8 hover:text-red-300">
                <Power size={12} className="mr-2" /> Disconnect
             </Button>
          ) : (
             <Button size="sm" onClick={onConnect} className="w-full bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold h-9">
                <Plug size={14} className="mr-2" /> Connect Service
             </Button>
          )}
       </div>
    </div>
  );
};

export default IntegrationPanel;
