
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Sun, Moon, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import BackgroundEnergy from '@/components/BackgroundEnergy';
import TriangleLogo from '@/components/ui/TriangleLogo';
import { useTheme } from '@/components/ThemeProvider';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { theme, setTheme } = useTheme();
  
  const location = useLocation();

  useEffect(() => {
    const auth = localStorage.getItem('infinity_auth');
    setIsAuthenticated(!!auth);
  }, [location]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { path: '/vision-cortex', label: 'Vision Cortex' },
    { path: '/quantum-x-builder', label: 'Quantum X Builder' },
    { path: '/intelligence', label: 'Intelligence' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/technology', label: 'Technology' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-light selection:bg-[#39FF14] selection:text-black">
      {/* Backgrounds - Simplified to allow BackgroundEnergy to shine through */}
      <AnimatePresence mode="popLayout">
        <motion.div
            key="bg-energy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-0"
        >
            <BackgroundEnergy />
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-6">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="relative backdrop-blur-xl bg-black/40 border border-[#C0C0C0] rounded-full pl-6 pr-3 py-2 flex items-center gap-4 max-w-6xl w-full justify-between shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-[#39FF14] hover:shadow-[0_0_20px_rgba(57,255,20,0.15)]"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center group relative z-10 gap-3 mr-4">
             <TriangleLogo size={28} className="text-white group-hover:text-[#39FF14] transition-colors" />
             <span className="hidden md:block font-bold tracking-widest text-sm text-white group-hover:text-[#39FF14] transition-colors">INFINITY</span>
          </Link>

          {/* Links */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 xl:px-5 py-2 text-[11px] xl:text-xs uppercase tracking-widest transition-all duration-300 relative group overflow-hidden rounded-full whitespace-nowrap border border-transparent hover:border-[#39FF14]",
                  location.pathname === link.path 
                    ? "text-white" 
                    : "text-white/60 hover:text-[#39FF14]"
                )}
              >
                <span className="relative z-10">{link.label}</span>
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-bg" 
                    className="absolute inset-0 bg-[#39FF14]/10 border border-[#39FF14] rounded-full shadow-[0_0_10px_rgba(57,255,20,0.2)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="absolute inset-0 bg-[#39FF14]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3 relative z-10">
             <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full hover:bg-white/10 text-white/60 hover:text-[#39FF14] transition-colors border border-transparent hover:border-[#39FF14]"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
             >
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                     <motion.div key="sun" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Sun size={16} />
                     </motion.div>
                  ) : (
                     <motion.div key="moon" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Moon size={16} />
                     </motion.div>
                  )}
                </AnimatePresence>
             </button>

             <Link to="/auth">
                <button className="relative px-5 py-2.5 overflow-hidden group rounded-full border border-[#C0C0C0] hover:border-[#39FF14] transition-all bg-white/5 hover:bg-[#39FF14]/10">
                   <span className="relative text-white group-hover:text-[#39FF14] text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-colors">
                     Sign In / Sign Up <LogIn size={14} />
                   </span>
                </button>
             </Link>
          </div>

          <div className="lg:hidden flex items-center gap-4">
            <button 
              className="p-2 text-white hover:text-[#39FF14] border border-transparent hover:border-[#39FF14] rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl border-l border-[#C0C0C0] flex flex-col pt-32 px-10"
          >
            <div className="flex flex-col gap-8 relative z-10">
              {navLinks.map((link, i) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center gap-4 text-2xl font-light tracking-tight text-white hover:text-[#39FF14] transition-all p-2 rounded-lg hover:border border-[#C0C0C0]/50"
                >
                  <span className="text-xs font-mono text-[#39FF14]/50 border border-[#C0C0C0] px-2 py-1 rounded">0{i + 1}</span>
                  {link.label}
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-[#39FF14]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
              <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="mt-8">
                 <button className="w-full py-4 bg-[#39FF14] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-[#32cc12] shadow-lg shadow-[#39FF14]/20 border border-[#C0C0C0]">
                    Sign In / Sign Up
                 </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 relative z-10 pt-32">
        <Outlet />
      </main>

      <footer className="relative z-10 py-16 px-6 border-t border-[#C0C0C0] bg-black/80 backdrop-blur-md mt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-sm">
          <div className="col-span-2">
            <h3 className="text-2xl font-bold tracking-widest mb-6 text-white flex items-center gap-3">
               <TriangleLogo size={24} className="text-white group-hover:text-[#39FF14]" /> INFINITY X
            </h3>
            <p className="text-white/40 max-w-sm leading-relaxed mb-8">
              Constructing the neural architecture for the next generation of autonomous intelligence.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Platform</h4>
            <ul className="space-y-4 text-white/40">
              <li><Link to="/vision-cortex" className="hover:text-[#39FF14] transition-colors border-b border-transparent hover:border-[#39FF14]">Vision Cortex</Link></li>
              <li><Link to="/pricing" className="hover:text-[#39FF14] transition-colors border-b border-transparent hover:border-[#39FF14]">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">System</h4>
            <ul className="space-y-4 text-white/40">
              <li><Link to="/auth" className="hover:text-[#39FF14] transition-colors border-b border-transparent hover:border-[#39FF14]">Login</Link></li>
              <li><span className="text-[#39FF14] px-2 py-1 border border-[#39FF14]/30 rounded">System Status: Online</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
