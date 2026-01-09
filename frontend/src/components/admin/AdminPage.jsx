
// Updating AdminPage to include new robust features
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
  ChevronRight, ChevronLeft, GitMerge, FileText
} from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ChatWidget from '@/components/ChatWidget';

// New Modules
import AdminIntegrationHub from '@/components/admin/integrations/AdminIntegrationHub';
import AdminContractViewer from '@/components/admin/contract/AdminContractViewer';
import AdminSEODashboard from '@/components/admin/seo/AdminSEODashboard';
import AdminLiveData from '@/components/admin/AdminLiveData';
import AdminIDE from '@/components/admin/AdminIDE';

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout, user } = useAuth();
  const { systemMode } = useAdmin();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminLiveData />; // Live operations as dashboard
      case 'integrations': return <AdminIntegrationHub />;
      case 'contracts': return <AdminContractViewer />;
      case 'seo': return <AdminSEODashboard />;
      case 'ide': return <AdminIDE />;
      default: return <div className="p-8 text-center text-white/40">Module {activeTab} coming soon.</div>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Control Plane | Infinity X</title>
      </Helmet>

      <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans selection:bg-[#39FF14] selection:text-black">
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          handleLogout={handleLogout}
        />

        <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-80' : 'lg:ml-20'}`}>
          <header className="h-20 border-b-2 border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors lg:hidden">
                   <Menu size={24} />
                </button>
                <div className="hidden md:flex items-center text-sm text-white/40">
                   <span className="uppercase tracking-widest font-bold text-xs">System:</span>
                   <span className="ml-2 px-2 py-0.5 rounded bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20 text-[10px] font-bold">ONLINE</span>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                   <div className="text-xs font-bold text-white">{user?.name || 'Admin'}</div>
                   <div className="text-[10px] text-white/40 uppercase">Root Access</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0066FF] to-[#39FF14] border border-white/20 shadow-lg" />
             </div>
          </header>

          <div className="flex-1 flex overflow-hidden relative">
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative custom-scrollbar">
              <AnimatePresence mode="wait">
                 {renderContent()}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminPage;
