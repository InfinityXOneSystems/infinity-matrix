
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Brain, 
  Zap, 
  Users, 
  ArrowUpRight, 
  Clock, 
  Settings,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';

// Simple widget internal component for consistent styling
const StatCard = ({ title, value, change, icon: Icon, trend }) => (
  <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-full relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={64} />
    </div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="p-3 bg-white/5 rounded-xl border border-[#C0C0C0] group-hover:border-[#39FF14] transition-colors">
        <Icon className="text-white group-hover:text-[#39FF14] transition-colors" size={20} />
      </div>
      {change && (
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${trend === 'up' ? 'text-[#39FF14] border-[#39FF14]/30 bg-[#39FF14]/10' : 'text-red-400 border-red-400/30 bg-red-400/10'}`}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <Activity size={12} />}
          {change}
        </span>
      )}
    </div>
    <div className="relative z-10">
      <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleQuickAction = (action) => {
    toast({
      title: "Action Initiated",
      description: `Starting ${action}...`,
    });
    
    // Navigation logic
    if (action === "New Agent") navigate('/agent-creator');
    if (action === "New Workflow") navigate('/workflow-builder');
    if (action === "System Scan") setTimeout(() => toast({ title: "Scan Complete", description: "System operating at 100% efficiency.", variant: "default" }), 1500);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | Infinity X</title>
      </Helmet>

      <div className="min-h-screen pt-24 md:pt-32 pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header - Stacks on mobile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
            <p className="text-white/50">Welcome back, Architect. System operational.</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
             <Button 
                variant="outline" 
                onClick={() => navigate('/settings')}
                className="gap-2 flex-1 md:flex-none touch-target"
             >
                <Settings size={16} /> Settings
             </Button>
             <Button 
                className="gap-2 bg-[#0055FF] hover:bg-[#0044CC] text-white border-none shadow-[0_0_15px_rgba(0,85,255,0.4)] flex-1 md:flex-none touch-target"
                onClick={() => handleQuickAction("New Project")}
             >
                <Plus size={16} /> New Project
             </Button>
          </div>
        </div>

        {/* Stats Grid - Single col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value="$124,592" 
            change="+12.5%" 
            trend="up" 
            icon={Zap} 
          />
          <StatCard 
            title="Active Agents" 
            value="14" 
            change="+2" 
            trend="up" 
            icon={Brain} 
          />
          <StatCard 
            title="System Load" 
            value="34%" 
            change="-5%" 
            trend="up" 
            icon={Activity} 
          />
          <StatCard 
            title="Total Users" 
            value="8,942" 
            change="+128" 
            trend="up" 
            icon={Users} 
          />
        </div>

        {/* Main Content Split - Stacks on mobile/tablet */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white text-lg">System Intelligence</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/intelligence')} className="touch-target">View All</Button>
             </div>
             
             <div className="space-y-4">
                {[
                   { title: "Market Anomaly Detected", time: "2 min ago", type: "alert" },
                   { title: "Agent 'Alpha-1' completed task", time: "15 min ago", type: "success" },
                   { title: "New integration connected: Stripe", time: "1 hour ago", type: "info" },
                   { title: "Workflow optimized by 24%", time: "3 hours ago", type: "success" },
                ].map((item, i) => (
                   <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-[#C0C0C0]/20 hover:border-[#39FF14]/50 transition-all cursor-pointer gap-2" onClick={() => toast({ title: "Details", description: item.title })}>
                      <div className="flex items-center gap-4">
                         <div className={`flex-shrink-0 w-2 h-2 rounded-full ${item.type === 'alert' ? 'bg-red-500' : item.type === 'success' ? 'bg-[#39FF14]' : 'bg-blue-500'}`} />
                         <span className="text-white/90 text-sm md:text-base">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40 text-xs sm:ml-auto">
                         <Clock size={12} /> {item.time}
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold text-white text-lg mb-6">Quick Actions</h3>
            <div className="space-y-3">
               <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12 text-md touch-target"
                  onClick={() => handleQuickAction("New Agent")}
               >
                  <Brain size={18} className="text-[#39FF14]" /> Deploy New Agent
               </Button>
               <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12 text-md touch-target"
                  onClick={() => handleQuickAction("New Workflow")}
               >
                  <Zap size={18} className="text-[#0055FF]" /> Build Workflow
               </Button>
               <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12 text-md touch-target"
                  onClick={() => handleQuickAction("System Scan")}
               >
                  <Activity size={18} className="text-purple-500" /> Run Diagnostics
               </Button>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-[#0055FF]/10 border border-[#0055FF]/30">
               <h4 className="text-[#0055FF] font-bold text-sm mb-2">Vision Cortex Status</h4>
               <p className="text-xs text-white/70 mb-3">Neural engine is processing data at nominal capacity.</p>
               <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0055FF] w-[75%] animate-pulse" />
               </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default DashboardPage;
