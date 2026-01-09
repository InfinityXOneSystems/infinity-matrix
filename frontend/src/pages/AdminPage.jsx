
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useAdmin } from '@/lib/AdminProvider';
import { useAuth } from '@/lib/AuthContext';

// Icons
import { 
  Users, Database, Settings, Lock, Terminal, Server, 
  Menu, Bell, Search, Shield, Activity, LogOut,
  ChevronRight, ChevronLeft, BookOpen, Edit
} from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminAgents from '@/components/admin/AdminAgents';
import AdminIntelligence from '@/components/admin/AdminIntelligence';
import AdminUserManagement from '@/components/admin/AdminUserManagement';
import AdminApiLab from '@/components/admin/AdminApiLab';
import AdminLLMLab from '@/components/admin/AdminLLMLab';
import AdminContractViewer from '@/components/admin/contract/AdminContractViewer';
import AdminLiveData from '@/components/admin/AdminLiveData'; 
import AdminTechnologyOverview from '@/components/admin/AdminTechnologyOverview';
import AdminSEODashboard from '@/components/admin/seo/AdminSEODashboard';
import AdminIDE from '@/components/admin/AdminIDE'; // NEW
import ChatWidget from '@/components/ChatWidget';

// -- Sub-component for Dashboard View --
const DashboardView = ({ handleAccess, setActiveTab }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="space-y-8"
  >
    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[
        { label: "Active Agents", value: "14", trend: "+2 this week", color: "#39FF14" },
        { label: "System Load", value: "34%", trend: "Nominal", color: "#0066FF" },
        { label: "API Requests", value: "1.2M", trend: "+15% YoY", color: "#39FF14" },
        { label: "Security Status", value: "Secure", trend: "0 Threats", color: "#39FF14" }
      ].map((stat, i) => (
        <div key={i} className="glass-panel p-5 rounded-xl border border-white/10 relative overflow-hidden group hover:border-[#39FF14]/30 transition-all">
          <div className="text-white/50 text-xs uppercase tracking-wider font-bold mb-1">{stat.label}</div>
          <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
          <div className="text-[10px] font-mono" style={{ color: stat.color }}>{stat.trend}</div>
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity size={40} />
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <AdminCard 
        title="Live Operations" 
        icon={Activity} 
        description="Real-time trading feeds, system health, and neural telemetry."
        action={() => setActiveTab("live-ops")}
      />
      <AdminCard 
        title="Site Editor (IDE)" 
        icon={Edit} 
        description="Live edit content across the entire Infinity X platform."
        action={() => setActiveTab("ide")}
      />
      <AdminCard 
        title="SEO Manager" 
        icon={Search} 
        description="Meta tags, schema management, and SERP tracking."
        action={() => setActiveTab("seo-management")}
      />
      <AdminCard 
        title="LLM Laboratory" 
        icon={Terminal} 
        description="Prompt engineering, model testing, and token analytics."
        action={() => setActiveTab("llm-lab")}
      />
      <AdminCard 
        title="Data Vault" 
        icon={Database} 
        description="Secure storage configuration and backup protocols."
        action={() => handleAccess("Vault")}
      />
      <AdminCard 
        title="Tech Stack" 
        icon={Server} 
        description="Overview of system architecture and module status."
        action={() => setActiveTab("technology-overview")}
      />
    </div>
  </motion.div>
);

const AdminCard = ({ title, icon: Icon, description, action }) => (
  <div className="glass-panel p-6 rounded-2xl border border-[#C0C0C0]/20 hover:border-[#39FF14] transition-all group bg-black/40">
    <div className="mb-4 p-3 bg-white/5 w-fit rounded-xl border border-[#C0C0C0]/30 group-hover:border-[#39FF14] transition-colors">
      <Icon className="text-white group-hover:text-[#39FF14]" size={24} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-white/60 mb-6 text-sm h-10">{description}</p>
    <Button 
      className="w-full border-[#C0C0C0]/20 bg-white/5 group-hover:bg-[#39FF14] group-hover:text-black hover:bg-[#39FF14] transition-all" 
      variant="outline"
      onClick={action}
    >
      Manage
    </Button>
  </div>
);

// -- MAIN PAGE COMPONENT --
const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const { logout, user } = useAuth();
  const { systemMode } = useAdmin();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleAccess = (module) => {
    toast({
      title: "Module Loading",
      description: `Accessing ${module} subsystem...`
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView handleAccess={handleAccess} setActiveTab={setActiveTab} />;
      case 'live-ops':
        return <AdminLiveData />;
      case 'users':
        return <AdminUserManagement />;
      case 'agents':
      case 'agent-creator': 
        return <AdminAgents />;
      case 'intelligence':
        return <AdminIntelligence />;
      case 'api-lab':
        return <AdminApiLab />;
      case 'llm-lab':
        return <AdminLLMLab />;
      case 'contract':
        return <AdminContractViewer />;
      case 'technology-overview': 
        return <AdminTechnologyOverview />;
      case 'seo-management': 
        return <AdminSEODashboard />;
      case 'ide': // NEW IDE TAB
        return <AdminIDE />;
      case 'settings':
        return (
          <div className="flex items-center justify-center h-full text-white/50">
            <div className="text-center">
              <Settings size={48} className="mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-bold">System Settings</h2>
              <p>Configuration panel under maintenance.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-white/40">
            <div className="p-6 rounded-full bg-white/5 mb-4">
              <Lock size={40} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Restricted Area</h3>
            <p>This module ({activeTab}) is currently locked or in development.</p>
          </div>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>AdminOS | Infinity X</title>
      </Helmet>

      <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans selection:bg-[#39FF14] selection:text-black">
        
        {/* Left Sidebar */}
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          handleLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main 
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'lg:ml-80' : 'lg:ml-20'
          }`}
        >
          {/* Top Bar */}
          <header className="h-20 border-b-2 border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors lg:hidden"
                >
                   <Menu size={24} />
                </button>
                <div className="hidden md:flex items-center text-sm text-white/40">
                   <span className="uppercase tracking-widest font-bold text-xs">Environment:</span>
                   <span className="ml-2 px-2 py-0.5 rounded bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20 text-[10px] font-bold">PRODUCTION</span>
                   <span className="mx-3">/</span>
                   <span className="uppercase tracking-widest font-bold text-xs">Mode:</span>
                   <span className="ml-2 px-2 py-0.5 rounded bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20 text-[10px] font-bold uppercase">{systemMode}</span>
                </div>
             </div>

             <div className="flex items-center gap-4">
                <button 
                  onClick={() => setRightPanelOpen(!rightPanelOpen)}
                  className="p-2 hidden lg:flex rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  title="Toggle Assistant"
                >
                   {rightPanelOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
                <div className="hidden md:block relative w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                   <Input 
                      placeholder="Global Command Search..." 
                      className="h-10 pl-9 bg-black/40 border-white/10 text-white text-xs focus:border-[#39FF14] rounded-full"
                   />
                </div>
                <button className="p-2 relative rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                   <Bell size={20} />
                   <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                   <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold text-white">{user?.name}</div>
                      <div className="text-[10px] text-white/40 uppercase">{user?.role}</div>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0066FF] to-[#39FF14] border border-white/20 shadow-lg" />
                   <button onClick={handleLogout} className="p-2 text-white/40 hover:text-red-500 transition-colors">
                      <LogOut size={16} />
                   </button>
                </div>
             </div>
          </header>

          <div className="flex-1 flex overflow-hidden relative">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative custom-scrollbar">
              <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ 
                   backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, 
                   backgroundSize: '40px 40px',
                   zIndex: -1
                 }} 
              />
              <AnimatePresence mode="wait">
                 {renderContent()}
              </AnimatePresence>
            </div>

            {/* Right Chat Panel (Half-page UI) */}
            <motion.div 
               initial={false}
               animate={{ width: rightPanelOpen ? 350 : 0, opacity: rightPanelOpen ? 1 : 0 }}
               className="hidden lg:block border-l border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden"
            >
               <div className="h-full w-[350px]">
                 <ChatWidget 
                   mode="sidebar" 
                   title="Admin Copilot" 
                   subtitle="System Access"
                   initialMessages={[
                     { id: '1', role: 'system', content: 'Admin Copilot v9.0. Ready to execute high-level system commands.' }
                   ]}
                 />
               </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminPage;
