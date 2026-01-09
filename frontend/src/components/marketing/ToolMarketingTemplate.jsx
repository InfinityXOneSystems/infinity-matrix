
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BackgroundEnergy from '@/components/BackgroundEnergy';
import { Check, Star, ArrowRight, Play, Shield } from 'lucide-react';
import NeuralNetworkCanvas from '@/components/NeuralNetworkCanvas';

const ToolMarketingTemplate = ({ config }) => {
  const { 
    id, title, subtitle, description, 
    benefits = [], stats = [], testimonials = [], 
    color, icon: Icon 
  } = config;

  // Fallback for features if benefits is used in config but features expected
  const featuresList = config.features || benefits;

  return (
    <>
      <Helmet>
        <title>{title} | Infinity X AI</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://infinityx.ai/${id}`} />
      </Helmet>

      <div className="relative min-h-screen bg-[#020410] text-white selection:bg-[#39FF14] selection:text-black font-sans">
        <div className="fixed inset-0 z-0 pointer-events-none">
           <BackgroundEnergy />
        </div>

        {/* HERO */}
        <section className="relative pt-32 pb-20 px-6 z-10">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-6">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{subtitle}</span>
                 </div>
                 <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight font-orbitron">
                    {title.split(' ').map((word, i) => (
                       <span key={i} className={i === title.split(' ').length - 1 ? "text-glow" : ""} style={i === title.split(' ').length - 1 ? { color } : {}}>{word} </span>
                    ))}
                 </h1>
                 <p className="text-xl text-white/70 mb-8 font-light leading-relaxed max-w-lg">
                    {description}
                 </p>
                 <div className="flex flex-wrap gap-4">
                    <Link to="/auth">
                       <Button className="h-14 px-8 text-lg font-bold text-black hover:scale-105 transition-transform" style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}60` }}>
                          Start Free Trial <ArrowRight className="ml-2" />
                       </Button>
                    </Link>
                    <Link to={`/app/${id}`}>
                       <Button variant="outline" className="h-14 px-8 text-lg font-bold border-white/20 hover:bg-white/10 hover:text-white">
                          <Play size={18} className="mr-2" /> Live Demo
                       </Button>
                    </Link>
                 </div>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} 
                 animate={{ opacity: 1, scale: 1 }} 
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="relative"
              >
                 <div className="aspect-square rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl relative">
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <div className="absolute inset-0 z-0 opacity-60">
                       <NeuralNetworkCanvas />
                    </div>
                    {/* Mock Interface Layer */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                       <div className="w-[80%] h-[60%] bg-[#020410]/90 rounded-xl border border-white/20 shadow-2xl overflow-hidden flex flex-col">
                          <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-500/50" />
                             <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                             <div className="w-3 h-3 rounded-full bg-green-500/50" />
                          </div>
                          <div className="flex-1 p-6 relative">
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                {React.isValidElement(Icon) ? React.cloneElement(Icon, { size: 48, style: { color }, className: "mx-auto mb-4 animate-pulse" }) : null}
                                <div className="h-2 w-32 bg-white/10 rounded mb-2 mx-auto" />
                                <div className="h-2 w-24 bg-white/10 rounded mx-auto" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
           </div>
        </section>

        {/* METRICS */}
        <section className="py-20 bg-black/30 backdrop-blur-sm border-y border-white/5">
           <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                 <div key={i} className="text-center">
                    <div className="text-4xl md:text-5xl font-black mb-2 font-mono" style={{ color }}>{stat.value}</div>
                    <div className="text-xs uppercase tracking-widest text-white/50">{stat.label}</div>
                 </div>
              ))}
           </div>
        </section>

        {/* FEATURES */}
        <section className="py-24 px-6 relative z-10">
           <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-bold mb-4 font-orbitron">Enterprise Grade <span style={{ color }}>Power</span></h2>
                 <p className="text-white/60 max-w-2xl mx-auto">Built for scale, security, and autonomous execution.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {featuresList.map((feature, i) => (
                    <motion.div 
                       key={i}
                       whileHover={{ y: -10 }}
                       className="glass-panel p-8 rounded-2xl border border-white/10 bg-white/5"
                    >
                       <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${color}20` }}>
                          {React.isValidElement(feature.icon) ? React.cloneElement(feature.icon, { size: 24, style: { color } }) : <Check size={24} style={{ color }} />}
                       </div>
                       <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                       <p className="text-white/60 leading-relaxed text-sm">{feature.desc}</p>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* TESTIMONIALS */}
        {testimonials.length > 0 && (
          <section className="py-24 px-6 bg-gradient-to-b from-transparent to-black/50">
             <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {testimonials.map((t, i) => (
                      <div key={i} className="glass-panel p-8 rounded-2xl relative">
                         <div className="flex text-yellow-500 mb-4">
                            {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                         </div>
                         <p className="text-xl italic text-white/90 mb-6">"{t.quote}"</p>
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10" />
                            <div>
                               <div className="font-bold">{t.author}</div>
                               <div className="text-xs text-white/50 uppercase">{t.role}</div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </section>
        )}

        {/* ROI CALCULATOR MOCK */}
        <section className="py-24 px-6 relative z-10">
           <div className="max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-3xl border border-white/10 text-center">
              <h2 className="text-3xl font-bold mb-8 font-orbitron">Projected Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                 <div className="p-6 bg-white/5 rounded-2xl">
                    <div className="text-sm text-white/50 mb-2">Current Efficiency</div>
                    <div className="text-2xl font-bold">42%</div>
                 </div>
                 <div className="flex items-center justify-center">
                    <ArrowRight size={32} style={{ color }} className="animate-pulse" />
                 </div>
                 <div className="p-6 bg-[#39FF14]/10 rounded-2xl border border-[#39FF14]/30">
                    <div className="text-sm text-[#39FF14] mb-2 font-bold">With {title}</div>
                    <div className="text-4xl font-bold text-[#39FF14]">94%</div>
                 </div>
              </div>
              <Link to="/auth">
                 <Button className="h-12 px-8 font-bold" style={{ backgroundColor: color, color: '#000' }}>
                    Calculate Your ROI
                 </Button>
              </Link>
           </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 px-6 text-center">
           <h2 className="text-5xl md:text-7xl font-black mb-8 font-orbitron tracking-tight">READY TO <span style={{ color }}>DEPLOY?</span></h2>
           <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">Join the enterprise network running on Infinity X.</p>
           <Link to="/auth">
              <Button className="h-16 px-12 text-xl font-bold rounded-full shadow-2xl hover:scale-105 transition-all" style={{ backgroundColor: color, color: '#000', boxShadow: `0 0 40px ${color}50` }}>
                 Get Started Now
              </Button>
           </Link>
           <p className="mt-6 text-sm text-white/30 flex items-center justify-center gap-2">
              <Shield size={12} /> Enterprise Security Standard
           </p>
        </section>
      </div>
    </>
  );
};

export default ToolMarketingTemplate;
