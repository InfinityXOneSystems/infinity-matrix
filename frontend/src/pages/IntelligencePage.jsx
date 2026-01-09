
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Lock, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import BackgroundEnergy from '@/components/BackgroundEnergy';
import { Button } from '@/components/ui/button';
import { industries } from '@/lib/intelligence-industries';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const IntelligencePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.email && loginForm.password) {
      // Mock authentication success
      setTimeout(() => setIsAuthenticated(true), 800);
    }
  };

  return (
    <>
      <Helmet>
        <title>Intelligence Hub | Infinity X One</title>
        <meta name="description" content="Secure Intelligence Interface for Industry Leaders." />
      </Helmet>

      {/* Background System */}
      <div className="fixed inset-0 z-0">
         <BackgroundEnergy />
      </div>

      <div className="relative z-10 min-h-screen pt-24 pb-12 px-4 flex flex-col items-center">
        
        {/* HERO SECTION - CONSTANT */}
        <div className="w-full max-w-7xl mx-auto mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black tracking-tighter text-white mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
             INFINITY X <span className="text-[#39FF14] text-glow-green">ONE</span>
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-2xl font-light tracking-[0.5em] text-white/60 uppercase"
          >
             INTELLIGENCE
          </motion.h2>
        </div>

        {/* CONTENT AREA */}
        <div className="w-full max-w-7xl mx-auto flex-1">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: AUTH STUB */}
            {!isAuthenticated ? (
              <motion.div
                key="auth"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                className="max-w-md mx-auto mt-12"
              >
                <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                   <div className="flex justify-center mb-8">
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-[#39FF14]/30 flex items-center justify-center animate-pulse">
                         <Lock size={32} className="text-[#39FF14]" />
                      </div>
                   </div>
                   
                   <h3 className="text-2xl font-bold text-white text-center mb-2">Restricted Access</h3>
                   <p className="text-white/40 text-center text-sm mb-8">
                     Enter your Intelligence Node credentials to access the industry matrix.
                   </p>

                   <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Input 
                          type="email" 
                          placeholder="Node ID / Email" 
                          className="bg-black/50 border-white/10 text-white focus:border-[#39FF14]"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Input 
                          type="password" 
                          placeholder="Access Key" 
                          className="bg-black/50 border-white/10 text-white focus:border-[#39FF14]"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-[#39FF14] text-black font-bold hover:bg-[#32cc12] mt-4 shadow-[0_0_20px_rgba(57,255,20,0.4)]">
                         Authenticate
                      </Button>
                   </form>
                   
                   <div className="mt-6 flex justify-between text-[10px] text-white/30 uppercase tracking-widest">
                      <span>Encryption: AES-256</span>
                      <span>Status: Secure</span>
                   </div>
                </div>
              </motion.div>
            ) : (
              /* VIEW 2: INDUSTRY MATRIX (AUTHENTICATED) */
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {industries.map((ind, i) => (
                    <motion.div
                      key={ind.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedIndustry(ind)}
                      className={cn(
                        "group relative glass-panel p-6 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden min-h-[160px] flex flex-col justify-between",
                        selectedIndustry?.id === ind.id 
                          ? "border-[#39FF14] bg-white/5 shadow-[0_0_30px_rgba(57,255,20,0.15)]" 
                          : "hover:border-white/30 hover:bg-white/5"
                      )}
                    >
                      {/* Active Indicator */}
                      {selectedIndustry?.id === ind.id && (
                         <motion.div layoutId="active-glow" className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/10 to-transparent pointer-events-none" />
                      )}

                      <div className="relative z-10 flex justify-between items-start">
                        <div 
                           className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 border border-white/10 group-hover:scale-110 transition-transform duration-300"
                           style={{ color: ind.color, borderColor: selectedIndustry?.id === ind.id ? ind.color : 'rgba(255,255,255,0.1)' }}
                        >
                           <Zap size={18} fill="currentColor" className="opacity-80" />
                        </div>
                        {selectedIndustry?.id === ind.id && <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />}
                      </div>
                      
                      <div className="relative z-10">
                         <h3 className="text-white font-bold text-sm md:text-lg leading-tight mb-1 group-hover:text-[#39FF14] transition-colors">
                           {ind.title}
                         </h3>
                         <p className="text-[10px] text-white/50 uppercase tracking-wider">{ind.subTitle}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* SELECTED INDUSTRY DETAIL VIEW */}
                <AnimatePresence mode="wait">
                  {selectedIndustry && (
                    <motion.div
                      key={selectedIndustry.id}
                      initial={{ opacity: 0, y: 40, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: 20, height: 0 }}
                      className="glass-panel rounded-3xl overflow-hidden border border-white/10 bg-black/40"
                    >
                       <div className="grid grid-cols-1 lg:grid-cols-2">
                          
                          {/* LEFT: Interactive Image */}
                          <div className="relative h-[400px] lg:h-full min-h-[400px] overflow-hidden group">
                             <div className="absolute inset-0 bg-black/20 z-10 hover:bg-transparent transition-colors duration-500" />
                             <img 
                                src={`/images/industries/${selectedIndustry.id}.jpg`} 
                                alt={`${selectedIndustry.title} futuristic concept`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              src="https://images.unsplash.com/photo-1678500877233-5526d9b29c4d" />
                             
                             {/* Overlay Content */}
                             <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black via-black/80 to-transparent">
                                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
                                  {selectedIndustry.title}
                                </h2>
                                <div className="h-1 w-24 bg-[#39FF14] mb-4" />
                                <p className="text-white/80 max-w-md text-lg font-light">
                                  Deploying autonomous neural agents to optimize {selectedIndustry.subTitle.toLowerCase()}.
                                </p>
                             </div>
                          </div>

                          {/* RIGHT: Data & Sub-industries */}
                          <div className="p-8 md:p-12 flex flex-col justify-center">
                             
                             <div className="mb-10">
                                <h4 className="text-[#39FF14] font-mono uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
                                  Intelligence Vectors
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                   {selectedIndustry.subIndustries.map((sub, i) => (
                                      <motion.div 
                                        key={sub}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#39FF14]/30 transition-colors group"
                                      >
                                         <CheckCircle2 size={16} className="text-[#39FF14] opacity-50 group-hover:opacity-100" />
                                         <span className="text-white/70 text-sm group-hover:text-white">{sub}</span>
                                      </motion.div>
                                   ))}
                                </div>
                             </div>

                             <div>
                                <h4 className="text-[#0066FF] font-mono uppercase tracking-widest text-xs mb-6">
                                  Performance Impact
                                </h4>
                                <div className="grid grid-cols-3 gap-4">
                                   {selectedIndustry.intelligenceStats.map((stat, i) => (
                                      <div key={i} className="text-center p-4 rounded-2xl bg-[#0066FF]/5 border border-[#0066FF]/20">
                                         <div className="text-xl md:text-2xl font-bold text-white mb-1">{stat.value}</div>
                                         <div className="text-[10px] uppercase tracking-wide text-[#0066FF]">{stat.label}</div>
                                      </div>
                                   ))}
                                </div>
                             </div>
                             
                             <div className="mt-10 pt-8 border-t border-white/10 flex justify-end">
                                <Button className="bg-white text-black hover:bg-[#39FF14] hover:text-black font-bold uppercase tracking-widest">
                                   Deploy Agents <ChevronRight size={16} className="ml-2" />
                                </Button>
                             </div>

                          </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default IntelligencePage;
