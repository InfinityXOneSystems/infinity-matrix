
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket } from 'lucide-react';

const FuturePage = () => {
  const teasers = [
    { title: "Autonomous Markets", desc: "Decentralized exchanges that optimize liquidity without human intervention." },
    { title: "Self-Operating Corps", desc: "Legal entities managed entirely by verified smart contracts and AI agents." },
    { title: "Trustless Verification", desc: "Identity and reputation systems built on mathematical proof, not bureaucracy." },
    { title: "AI Governance", desc: "Policy making simulation engines that predict societal outcomes with 99% accuracy." },
    { title: "Predictive Logistics", desc: "Global supply chains that route goods before the order is even placed." }
  ];

  return (
    <>
      <Helmet><title>The Future | Infinity X</title></Helmet>
      <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden flex flex-col items-center justify-center">
        
        {/* Background Animation - consistent with theme */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-[#0066FF]/30 to-transparent" />
           <div className="absolute inset-0 bg-[#0066FF]/5 mix-blend-screen" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center max-w-5xl mx-auto relative z-10"
        >
           <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0066FF]/30 bg-[#0066FF]/5 backdrop-blur-sm">
              <Rocket size={12} className="text-[#0066FF]" />
              <span className="text-[#0066FF] text-[10px] tracking-widest uppercase font-bold">Horizon 2030</span>
           </div>

           <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none text-[rgb(var(--foreground))]">
             THE FUTURE IS <br />
             <span className="text-[#0066FF] text-glow">ALREADY MOVING</span>
           </h1>
           
           <p className="text-xl md:text-2xl text-[rgb(var(--light-gray-text))] font-light mb-20 max-w-3xl mx-auto leading-relaxed">
             We aren't just building software. We're creating the foundation for a world where technology handles the complexity, so you can focus on the vision.
           </p>

           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-24 text-left">
              {teasers.map((item, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="glass-panel p-8 rounded-2xl border-t border-t-white/10 hover:border-t-[#0066FF] transition-all duration-300 group"
                 >
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#0066FF] transition-colors">{item.title}</h3>
                    <p className="text-sm text-[rgb(var(--light-gray-text))] leading-relaxed">{item.desc}</p>
                 </motion.div>
              ))}
           </div>

           <button className="group relative px-12 py-5 bg-[#0066FF] text-white text-sm font-bold tracking-[0.2em] uppercase overflow-hidden rounded-full shadow-[0_0_40px_rgba(0,102,255,0.4)] transition-all hover:scale-105">
              <span className="relative z-10 flex items-center gap-3">
                Join Early Access <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
           </button>
        </motion.div>
      </div>
    </>
  );
};

export default FuturePage;
