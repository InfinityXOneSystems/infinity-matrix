
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Cpu, 
  Zap, 
  Activity, 
  Hammer,
  Sparkles,
  Rocket,
  CreditCard,
  CheckCircle2,
  Play
} from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import NeuralNetworkCanvas from '@/components/NeuralNetworkCanvas';
import ModeToggle from '@/components/ModeToggle';
import IntelligencePipeline from '@/components/IntelligencePipeline';
import WorkflowNeuralGrid from '@/components/WorkflowNeuralGrid';
import ArchitectAvatar from '@/components/ArchitectAvatar';

const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRequestAccess = (e) => {
    e.preventDefault();
    toast({
      title: "Access Requested",
      description: "Your node request has been queued. We will contact you shortly.",
      duration: 5000,
    });
  };

  const features = [
    {
      title: "Vision Cortex",
      desc: "The central cognitive engine. Processes multimodal data streams to derive actionable signal.",
      icon: <Brain size={24} />,
      color: "#3399FF",
      link: "/vision-cortex"
    },
    {
      title: "Quantum X Builder",
      desc: "Generative architectural engine capable of scaffolding complex software infrastructures.",
      icon: <Hammer size={24} />,
      color: "#33DDFF",
      link: "/quantum-x-builder"
    },
    {
      title: "Predictive Engine",
      desc: "AI-driven market forecasting and trend analysis with 94% historical accuracy.",
      icon: <Activity size={24} />,
      color: "#39FF14",
      link: "/predict"
    },
    {
      title: "Simulation Core",
      desc: "Run Monte Carlo simulations on business strategies before deploying capital.",
      icon: <Rocket size={24} />,
      color: "#D946EF",
      link: "/simulate"
    }
  ];

  const team = [
    {
      name: "Vision Cortex",
      role: "Cognitive Engine",
      bio: "The central nervous system. Processes multimodal data streams to derive actionable signal.",
      type: "vision"
    },
    {
      name: "Quantum X Builder",
      role: "Architectural Core",
      bio: "Generative construction engine. Instantly scaffolds complex software infrastructure.",
      type: "quantum"
    },
    {
      name: "Analyst",
      role: "Adaptive Intelligence",
      bio: "Self-evolving model that learns from edge cases to optimize system performance.",
      type: "analyst"
    },
    {
      name: "Strategist",
      role: "Strategic Overwatch",
      bio: "Secondary analytical layer ensuring long-term goal alignment and risk mitigation.",
      type: "strategist"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Infinity X AI | Enterprise Intelligence Orchestration</title>
        <meta name="description" content="The world's most advanced autonomous enterprise intelligence network. Deploy Vision Cortex, Quantum X, and Predictive agents." />
        <link rel="canonical" href="https://infinityx.ai/" />
      </Helmet>
      
      <div className="relative w-full overflow-hidden bg-transparent">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center relative px-4 md:px-6 pt-24 md:pt-32 pb-12">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30 pointer-events-none" />
          
          <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col items-center text-center">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6 md:mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-silver-border-color bg-black/40 backdrop-blur-md shadow-lg"
            >
              <div className="w-2 h-2 rounded-full bg-[#66FF33] animate-pulse" />
              <span className="text-white/90 text-[10px] md:text-xs tracking-widest uppercase font-bold">System Online v4.2</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-8 md:mb-10 drop-shadow-2xl font-orbitron"
            >
              INTELLIGENCE <br />
              <span className="text-[#3399FF] text-glow">REDEFINED</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 mb-10 md:mt-8 md:mb-16 w-full max-w-sm md:max-w-none flex justify-center" 
            >
              <ModeToggle />
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-2xl text-white/80 max-w-3xl font-light leading-relaxed mb-10 md:mb-16 drop-shadow-md px-4"
            >
              We are building the neural architecture for the next generation of business. 
              Real-time data. Autonomous agents. Absolute clarity.
            </motion.p>

            {/* 4-BUTTON PACK */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl px-4"
            >
              <Button 
                onClick={() => navigate('/vision-cortex')}
                className="h-14 bg-[#3399FF] hover:bg-[#2288EE] text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(51,153,255,0.4)] hover:shadow-[0_0_30px_rgba(51,153,255,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 w-full touch-target"
              >
                <Brain size={18} /> Vision Cortex
              </Button>
              
              <Button 
                onClick={() => navigate('/quantum-x-builder')}
                className="h-14 bg-[#00FFFF] hover:bg-[#00DDDD] text-black text-sm font-bold uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 w-full touch-target"
              >
                <Hammer size={18} /> Quantum X
              </Button>

              <Button 
                onClick={() => navigate('/demos')}
                className="h-14 bg-[#000] border border-white/20 hover:border-[#39FF14] text-white hover:text-[#39FF14] text-sm font-bold uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 w-full touch-target"
              >
                <Play size={18} /> Live Demo
              </Button>

              <Button 
                onClick={() => navigate('/auth')}
                className="h-14 bg-[#39FF14] hover:bg-[#32cc12] text-black text-sm font-bold uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:shadow-[0_0_30px_rgba(57,255,20,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 w-full touch-target"
              >
                <Sparkles size={18} /> Sign Up Now
              </Button>
            </motion.div>
          </div>
          
          <div className="flex justify-center mt-16 md:mt-24 mb-12 relative z-10 w-full px-4">
             <div className="max-w-4xl text-center">
               <h3 className="text-lg md:text-2xl font-medium leading-tight text-white/90 drop-shadow-lg">
                 <span className="text-glow-green">Unlock your mind & Ideas and remove the noise</span> and <span className="text-glow-green">unleash your inner genius</span>
               </h3>
             </div>
          </div>

          {/* Neural Grid Preview */}
          <div className="relative w-full max-w-5xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-t-3xl overflow-hidden glass-panel shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <div className="absolute inset-0 z-0 bg-black/20">
                <NeuralNetworkCanvas />
             </div>
             
             <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex items-center gap-3 px-3 py-1.5 rounded-full bg-black/30 border border-silver-border-color backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-[#66FF33] animate-pulse" />
                <span className="text-[#66FF33] text-[10px] font-mono tracking-widest uppercase">Neural Grid Active</span>
             </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-16 md:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-16 flex flex-col items-center px-4">
              <div className="inline-block px-8 py-4 mb-4 backdrop-blur-sm rounded-full bg-black/20 border border-silver-border-color/30">
                <h2 className="text-xl md:text-2xl font-bold tracking-widest uppercase text-white drop-shadow-lg text-center">
                  Unleash your inner genius with Clarity and Signal
                </h2>
              </div>
            </div>

            <div className="mb-16 md:mb-24">
               <IntelligencePipeline />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  className="glass-panel p-6 md:p-8 rounded-2xl transition-all duration-300 group shadow-lg cursor-pointer h-full flex flex-col"
                  style={{ '--card-color': feature.color }}
                  onClick={() => navigate(feature.link)}
                >
                  <motion.div 
                    className="mb-6 p-4 rounded-xl w-fit transition-all duration-300 ring-1 ring-white/10 bg-white/5"
                    style={{ color: feature.color }}
                    whileHover={{ backgroundColor: feature.color, color: '#ffffff', boxShadow: `0 0 20px ${feature.color}60` }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-white transition-colors duration-300 group-hover:text-[var(--card-color)]">{feature.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed group-hover:text-white transition-colors flex-grow">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-16 md:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Visualization */}
              <div className="relative order-2 lg:order-1">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="relative z-10 glass-panel rounded-3xl p-2 shadow-[0_0_50px_-10px_rgba(51,153,255,0.3)]"
                >
                   <div className="rounded-2xl overflow-hidden bg-black/20 relative aspect-square flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(51,153,255,0.1)_0%,_transparent_70%)]" />
                      <WorkflowNeuralGrid />
                   </div>
                </motion.div>
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-white drop-shadow-md text-center lg:text-left">
                  Transform Data into <span className="text-[#3399FF] text-glow">Dominance</span>
                </h2>
                <div className="space-y-6 md:space-y-8">
                  {[
                    { title: "Connect", desc: "Integrate your data streams securely via our API gateway.", icon: <Zap /> },
                    { title: "Process", desc: "Our neural Vision Cortex analyzes patterns across millions of data points.", icon: <Cpu /> },
                    { title: "Execute", desc: "Receive actionable intelligence or let agents act autonomously.", icon: <Activity /> }
                  ].map((step, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                      className="glass-panel p-6 rounded-xl flex flex-col md:flex-row gap-4 md:gap-6 hover:bg-black/30 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full border border-silver-border-color bg-[#3399FF]/10 flex items-center justify-center text-[#3399FF] font-bold shadow-[0_0_15px_rgba(51,153,255,0.2)] mx-auto md:mx-0">
                        {step.icon}
                      </div>
                      <div className="text-center md:text-left">
                        <h4 className="text-xl font-bold mb-2 text-white">{step.title}</h4>
                        <p className="text-white/70">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* ARCHITECTS / TEAM SECTION - Restored */}
        <section className="py-16 md:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-white drop-shadow-md">The Architects</h2>
              <p className="text-white/70 mt-4 px-4">Built by Vision Cortex, Quantum X Builder and human visionaries like you.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -10 }}
                  className="group relative glass-panel p-1 rounded-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-xl mb-6 relative bg-black/50">
                     <ArchitectAvatar type={member.type} />
                     <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent pt-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#66FF33] group-hover:drop-shadow-[0_0_8px_rgba(102,255,51,0.8)] transition-all duration-300">
                          {member.name}
                        </h3>
                        <p className="text-[#3399FF] text-xs uppercase tracking-widest font-mono group-hover:text-white transition-colors duration-300">
                          {member.role}
                        </p>
                     </div>
                  </div>
                  <div className="px-5 pb-6">
                    <p className="text-white/70 text-sm opacity-80 group-hover:text-white group-hover:opacity-100 transition-all duration-300 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT / CTA */}
        <section className="py-16 md:py-32 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative z-10">
            <div className="glass-panel p-8 md:p-16 rounded-3xl shadow-2xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white text-glow-cyber">Ready to Deploy?</h2>
              <p className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                Join the network today. Secure your node and begin processing real-time intelligence immediately.
              </p>
              
              <form onSubmit={handleRequestAccess} className="max-w-md mx-auto mb-12 space-y-4 text-left">
                <div>
                  <label className="text-xs uppercase font-bold text-[#3399FF] ml-1 mb-2 block tracking-wider">Work Email</label>
                  <input type="email" placeholder="name@company.com" required className="w-full px-6 py-4 rounded-xl bg-black/40 border border-silver-border-color focus:border-[#3399FF] focus:ring-1 focus:ring-[#3399FF] outline-none transition-all text-white placeholder:text-white/20 shadow-inner backdrop-blur-sm" />
                </div>
                <Button type="submit" className="w-full bg-[#3399FF] hover:bg-[#2288EE] py-6 text-lg rounded-xl shadow-[0_0_20px_rgba(51,153,255,0.4)] hover:scale-[1.02] transition-all duration-300 touch-target">
                  Request Access
                </Button>
              </form>
              
              <div className="flex items-center justify-center gap-2 text-xs text-white/50 opacity-70 font-mono">
                <CheckCircle2 size={12} className="text-[#66FF33]" />
                Encrypted transmission. By requesting access you agree to the Titan Protocol Terms.
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default HomePage;
