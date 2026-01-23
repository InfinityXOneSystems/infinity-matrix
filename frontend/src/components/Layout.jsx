
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, Bot, Terminal, Activity, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import BackgroundEnergy from '@/components/BackgroundEnergy';
import TriangleLogo from '@/components/ui/TriangleLogo';
import ChatWidget from '@/components/ChatWidget';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
// Removed DiagnosticsPanel import for strict observability isolation

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const hideFloatingChatRoutes = ['/app', '/admin', '/dashboard', '/auth', '/chat'];
  const shouldShowFloatingChat = !hideFloatingChatRoutes.some(route => location.pathname.startsWith(route));
  const isAuthPage = location.pathname === '/auth';

  const navLinks = [
    { path: '/agent-builder', label: 'Agent Builder', icon: <Bot size={16} /> },
    { path: '/vision-cortex', label: 'Vision Cortex' },
    { path: '/quantum-x-builder', label: 'Quantum X' },
    { path: '/predict', label: 'Predict' },
    { path: '/technology', label: 'Technology' },
    { path: '/pricing', label: 'Pricing' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-light selection:bg-[#39FF14] selection:text-black">
      <div className="fixed inset-0 z-0 pointer-events-none">
         <BackgroundEnergy />
      </div>
      
      {/* Navigation Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center px-4 pt-4 md:pt-6 pointer-events-none">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="pointer-events-auto relative backdrop-blur-xl bg-[#020410]/80 border border-white/10 rounded-full pl-4 pr-2 py-2 flex items-center gap-2 md:gap-4 max-w-7xl w-full justify-between shadow-[0_4px_30px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-[#39FF14]/30"
        >
          <Link to="/" className="flex items-center gap-2 md:gap-3 group select-none touch-target focus:outline-none shrink-0">
             <TriangleLogo size={24} className="md:w-7 md:h-7" />
             <div className="flex items-center font-bold tracking-widest text-sm md:text-base leading-none">
                <span className="text-white group-hover:text-white/90 transition-colors font-orbitron">INFINITY</span>
                <span className="text-[#39FF14] ml-1 drop-shadow-[0_0_8px_rgba(57,255,20,0.6)] font-orbitron">X</span>
                <span className="text-white ml-2 font-orbitron hidden sm:inline">AI</span>
             </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-3 xl:px-4 py-2 text-[10px] xl:text-[11px] uppercase tracking-widest transition-all duration-300 relative group overflow-hidden rounded-full whitespace-nowrap border border-transparent hover:border-white/20 flex items-center gap-2",
                  location.pathname === link.path 
                    ? "text-white" 
                    : "text-white/60 hover:text-white"
                )}
              >
                {link.icon && <span>{link.icon}</span>}
                <span className="relative z-10">{link.label}</span>
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-bg" 
                    className="absolute inset-0 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3 relative z-10 shrink-0">
             <Link to="/auth">
                <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="relative px-5 py-2 overflow-hidden group rounded-full border border-[#39FF14] bg-[#39FF14]/90 backdrop-blur-md shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:shadow-[0_0_30px_rgba(57,255,20,0.6)] transition-all"
                >
                   <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                   <span className="relative text-black text-[11px] font-black tracking-widest uppercase flex items-center gap-2">
                     Sign Up <Sparkles size={12} className="animate-pulse" />
                   </span>
                </motion.button>
             </Link>
          </div>

          <div className="lg:hidden flex items-center gap-2 pointer-events-auto">
             <Link to="/auth" className="block sm:hidden">
               <button className="px-3 py-1.5 rounded-full bg-[#39FF14] text-black text-[10px] font-bold uppercase tracking-wide">
                 Sign Up
               </button>
             </Link>

            <button 
              className="p-2 touch-target text-white hover:text-[#39FF14] border border-transparent rounded-full active:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </motion.nav>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-[#020410]/95 backdrop-blur-2xl border-l border-white/10 flex flex-col pt-24 px-6 pb-safe overflow-y-auto"
          >
            <div className="flex flex-col gap-6 relative z-10 w-full max-w-sm mx-auto">
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                 <button className="w-full py-4 bg-[#39FF14] text-black font-black uppercase tracking-widest rounded-2xl hover:bg-[#32cc12] shadow-[0_0_20px_rgba(57,255,20,0.3)] border border-white/20 touch-target flex items-center justify-center gap-3 text-sm">
                    Free Sign Up <Sparkles size={16} />
                 </button>
              </Link>
              <div className="h-px bg-white/10 my-2" />
              <div className="space-y-2">
                {navLinks.map((link, i) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "group flex items-center gap-4 text-lg font-light tracking-tight text-white hover:text-[#39FF14] transition-all p-4 rounded-xl border border-white/5 bg-white/5 hover:border-[#39FF14]/30 hover:bg-[#39FF14]/5"
                    )}
                  >
                    <span className="text-[10px] font-mono text-[#39FF14] border border-[#39FF14]/30 px-1.5 py-0.5 rounded">0{i + 1}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto pb-8 text-center">
                 <p className="text-white/30 text-xs">v4.2.0 &bull; System Online</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 relative z-10 w-full overflow-x-hidden pt-24">
        <Outlet />
      </main>

      <PWAInstallPrompt />
      {/* DiagnosticsPanel removed for observability isolation */}

      {!isAuthPage && shouldShowFloatingChat && (
        <ChatWidget 
          mode="floating" 
          title="Infinity Assistant"
          initialMessages={[
            { id: '1', role: 'system', content: 'Welcome to Infinity X. I can help you navigate the platform or answer questions about our neural architecture.' }
          ]}
        />
      )}

      {location.pathname !== '/vision-cortex' && (
        <footer className="relative z-10 py-12 md:py-16 px-6 border-t border-white/10 bg-[#020410]/80 backdrop-blur-md mt-12 transition-colors duration-300 pb-safe">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 text-sm">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl md:text-2xl font-bold tracking-widest mb-6 text-white flex items-center gap-3">
                 <TriangleLogo size={24} className="text-white" /> 
                 <div className="flex items-center">
                    <span className="font-orbitron">INFINITY</span>
                    <span className="text-[#39FF14] ml-1 font-orbitron">X</span>
                    <span className="text-white ml-2 font-orbitron">AI</span>
                 </div>
              </h3>
              <p className="text-white/40 max-w-sm leading-relaxed mb-8">
                Constructing the neural architecture for the next generation of autonomous intelligence.
              </p>
              <div className="flex gap-4">
                 <Link to="/admin" className="p-2 bg-white/5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-[#39FF14] transition-all">
                    <Terminal size={16} />
                 </Link>
                 <Link to="/predict" className="p-2 bg-white/5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-[#39FF14] transition-all">
                    <Activity size={16} />
                 </Link>
                 <Link to="/simulate" className="p-2 bg-white/5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-[#39FF14] transition-all">
                    <Zap size={16} />
                 </Link>
              </div>
            </div>
            
            <div className="col-span-1">
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Platform</h4>
              <ul className="space-y-4 text-white/40">
                <li><Link to="/vision-cortex" className="hover:text-[#39FF14] transition-colors">Vision Cortex</Link></li>
                <li><Link to="/quantum-x-builder" className="hover:text-[#39FF14] transition-colors">Quantum X</Link></li>
                <li><Link to="/predict" className="hover:text-[#39FF14] transition-colors">Predict</Link></li>
                <li><Link to="/technology" className="hover:text-[#39FF14] transition-colors">Technology</Link></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">System</h4>
              <ul className="space-y-4 text-white/40">
                <li><Link to="/auth" className="hover:text-[#39FF14] transition-colors">Login</Link></li>
                <li><Link to="/admin" className="hover:text-[#39FF14] transition-colors">Control Plane</Link></li>
                <li><span className="text-[#39FF14] px-2 py-1 border border-[#39FF14]/30 rounded text-xs bg-[#39FF14]/5">System Status: Online</span></li>
              </ul>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
