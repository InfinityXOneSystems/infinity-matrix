
import React from 'react';
import { 
  LayoutDashboard, Globe, Settings, Shield, 
  Database, Server, Code2, Search, LogOut,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TriangleLogo from '@/components/ui/TriangleLogo';

const AdminSidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, handleLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Control Plane', icon: LayoutDashboard },
    { section: 'Platform' },
    { id: 'integrations', label: 'Connectors', icon: Zap },
    { id: 'contracts', label: 'API Contracts', icon: Database },
    { id: 'seo', label: 'SEO Manager', icon: Search },
    { id: 'ide', label: 'Live Editor', icon: Code2 },
    { section: 'System' },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'infrastructure', label: 'Infrastructure', icon: Server },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-40 bg-black/80 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-80" : "w-20 -translate-x-full lg:translate-x-0"
      )}
    >
      <div className="h-20 flex items-center justify-center border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
           <TriangleLogo size={32} />
           {sidebarOpen && <span className="font-bold tracking-widest text-lg text-white font-orbitron">ADMIN<span className="text-[#39FF14]">OS</span></span>}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
        {menuItems.map((item, idx) => {
          if (item.section) {
            return sidebarOpen ? (
              <div key={idx} className="mt-6 mb-2 px-4 text-xs font-bold uppercase tracking-widest text-white/30">{item.section}</div>
            ) : <div key={idx} className="my-4 h-px bg-white/10 mx-2" />;
          }

          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive ? "bg-[#39FF14]/10 text-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.2)]" : "text-white/50 hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#39FF14]" />}
              <Icon size={20} className={cn("shrink-0", isActive && "text-[#39FF14]")} />
              {sidebarOpen && <span className="text-sm font-medium tracking-wide">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 shrink-0">
         <button onClick={handleLogout} className={cn("w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all", !sidebarOpen && "justify-center px-0")}>
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-bold">Logout</span>}
         </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
