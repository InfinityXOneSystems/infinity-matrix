
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Check, Sparkles, User, 
  Briefcase, Globe, Cpu, ChevronRight, 
  Shield, Zap, Terminal, Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BackgroundEnergy from '@/components/BackgroundEnergy';
import TriangleLogo from '@/components/ui/TriangleLogo';
import { cn } from '@/lib/utils';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    industry: '',
    interests: []
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const updateData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const completeOnboarding = () => {
    // Simulate saving data
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const steps = [
    { id: 1, title: "Identity", icon: User },
    { id: 2, title: "Domain", icon: Globe },
    { id: 3, title: "Neural Sync", icon: Cpu },
  ];

  return (
    <>
      <Helmet>
        <title>Initialize | Infinity X</title>
      </Helmet>

      <div className="relative min-h-[100dvh] w-full flex flex-col bg-[#02040a] overflow-hidden text-white font-sans selection:bg-[#39FF14] selection:text-black">
        <BackgroundEnergy />
        
        {/* Header */}
        <div className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12">
           <Link to="/" className="flex items-center gap-2 group">
              <TriangleLogo className="text-white group-hover:text-[#39FF14] transition-colors" size={24} />
              <span className="font-bold tracking-widest text-sm md:text-base">INFINITY X</span>
           </Link>
           <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-[#39FF14] animate-pulse" />
              <span className="text-xs font-mono text-[#39FF14] tracking-wider">SYSTEM ONLINE</span>
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 relative z-20 flex items-center justify-center p-4">
           <div className="w-full max-w-2xl">
              
              {/* Progress Bar */}
              <div className="mb-12 flex justify-between items-center relative">
                 <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -z-10" />
                 {steps.map((s) => (
                    <div key={s.id} className="flex flex-col items-center gap-2 bg-[#02040a] px-2">
                       <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500",
                          step >= s.id 
                             ? "border-[#39FF14] bg-[#39FF14]/10 text-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.3)]" 
                             : "border-white/10 bg-white/5 text-white/30"
                       )}>
                          {step > s.id ? <Check size={18} /> : <s.icon size={18} />}
                       </div>
                       <span className={cn(
                          "text-[10px] uppercase tracking-widest font-bold transition-colors duration-300",
                          step >= s.id ? "text-white" : "text-white/30"
                       )}>{s.title}</span>
                    </div>
                 ))}
              </div>

              {/* Form Container */}
              <div className="glass-panel border border-[#C0C0C0]/20 rounded-2xl p-6 md:p-10 backdrop-blur-xl relative overflow-hidden">
                 
                 {/* Decorative Corner */}
                 <div className="absolute top-0 right-0 p-12 bg-gradient-to-bl from-[#39FF14]/5 to-transparent rounded-bl-full pointer-events-none" />

                 <AnimatePresence mode="wait">
                    
                    {/* Step 1: Identity */}
                    {step === 1 && (
                       <motion.div 
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                       >
                          <div className="text-center mb-8">
                             <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome, Architect.</h1>
                             <p className="text-white/50">Establish your digital presence within the network.</p>
                          </div>

                          <div className="space-y-4">
                             <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-white/60">Full Name</label>
                                <Input 
                                   value={formData.name} 
                                   onChange={(e) => updateData('name', e.target.value)}
                                   placeholder="e.g. Alex Chen"
                                   className="bg-black/40 border-white/10 h-12 text-lg focus:border-[#39FF14] transition-all"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-white/60">Email Access</label>
                                <Input 
                                   value={formData.email} 
                                   onChange={(e) => updateData('email', e.target.value)}
                                   placeholder="name@domain.com"
                                   className="bg-black/40 border-white/10 h-12 text-lg focus:border-[#39FF14] transition-all"
                                />
                             </div>
                          </div>

                          <div className="pt-4 flex justify-end">
                             <Button 
                                onClick={nextStep} 
                                disabled={!formData.name || !formData.email}
                                className="bg-[#39FF14] text-black hover:bg-[#32cc12] font-bold h-12 px-8 rounded-xl"
                             >
                                Initialize <ArrowRight size={18} className="ml-2" />
                             </Button>
                          </div>
                       </motion.div>
                    )}

                    {/* Step 2: Domain */}
                    {step === 2 && (
                       <motion.div 
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                       >
                          <div className="text-center mb-8">
                             <h1 className="text-2xl md:text-3xl font-bold mb-2">Define Operations</h1>
                             <p className="text-white/50">Select your primary sector for AI optimization.</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                             {['Technology', 'Finance', 'Healthcare', 'Real Estate', 'Legal', 'Creative'].map((ind) => (
                                <button
                                   key={ind}
                                   onClick={() => updateData('industry', ind)}
                                   className={cn(
                                      "p-4 rounded-xl border text-left transition-all duration-300 flex flex-col gap-2 relative overflow-hidden group",
                                      formData.industry === ind 
                                         ? "border-[#39FF14] bg-[#39FF14]/10 text-white" 
                                         : "border-white/10 bg-black/20 text-white/60 hover:border-white/30 hover:bg-white/5"
                                   )}
                                >
                                   <div className="relative z-10 font-bold">{ind}</div>
                                   {formData.industry === ind && <Check size={16} className="absolute top-4 right-4 text-[#39FF14]" />}
                                </button>
                             ))}
                          </div>

                          <div className="pt-6 flex justify-between items-center">
                             <button onClick={prevStep} className="text-white/40 hover:text-white text-sm font-bold uppercase tracking-wider">Back</button>
                             <Button 
                                onClick={nextStep} 
                                disabled={!formData.industry}
                                className="bg-white text-black hover:bg-white/90 font-bold h-12 px-8 rounded-xl"
                             >
                                Continue <ChevronRight size={18} className="ml-2" />
                             </Button>
                          </div>
                       </motion.div>
                    )}

                    {/* Step 3: Neural Sync */}
                    {step === 3 && (
                       <motion.div 
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-8"
                       >
                          <div className="text-center mb-6">
                             <h1 className="text-2xl md:text-3xl font-bold mb-2">Neural Synchronization</h1>
                             <p className="text-white/50">Configure your initial AI capabilities.</p>
                          </div>

                          <div className="space-y-3">
                             {[
                                { id: 'predict', label: 'Market Prediction', desc: 'Forecast trends and asset values', icon: Zap },
                                { id: 'simulate', label: 'Scenario Simulation', desc: 'Run Monte Carlo simulations', icon: Terminal },
                                { id: 'auto', label: 'Auto-GPT Agents', desc: 'Autonomous task execution', icon: Sparkles }
                             ].map((opt) => (
                                <button
                                   key={opt.id}
                                   onClick={() => toggleInterest(opt.id)}
                                   className={cn(
                                      "w-full p-4 rounded-xl border flex items-center gap-4 transition-all duration-300",
                                      formData.interests.includes(opt.id)
                                         ? "border-[#39FF14] bg-[#39FF14]/5" 
                                         : "border-white/10 bg-black/20 hover:bg-white/5"
                                   )}
                                >
                                   <div className={cn(
                                      "w-10 h-10 rounded-full flex items-center justify-center border",
                                      formData.interests.includes(opt.id) ? "bg-[#39FF14] text-black border-[#39FF14]" : "bg-black border-white/20 text-white/40"
                                   )}>
                                      <opt.icon size={18} />
                                   </div>
                                   <div className="text-left flex-1">
                                      <div className={cn("font-bold", formData.interests.includes(opt.id) ? "text-white" : "text-white/70")}>{opt.label}</div>
                                      <div className="text-xs text-white/40">{opt.desc}</div>
                                   </div>
                                   {formData.interests.includes(opt.id) && <Check size={18} className="text-[#39FF14]" />}
                                </button>
                             ))}
                          </div>

                          <div className="pt-6 flex justify-between items-center">
                             <button onClick={prevStep} className="text-white/40 hover:text-white text-sm font-bold uppercase tracking-wider">Back</button>
                             <Button 
                                onClick={completeOnboarding}
                                className="bg-[#39FF14] text-black hover:bg-[#32cc12] font-bold h-12 px-8 rounded-xl w-full md:w-auto shadow-[0_0_20px_rgba(57,255,20,0.4)]"
                             >
                                <Play size={18} className="mr-2" /> Launch Interface
                             </Button>
                          </div>
                       </motion.div>
                    )}

                 </AnimatePresence>
              </div>

              {/* Footer Links */}
              <div className="mt-8 flex justify-center gap-6 text-xs text-white/30 uppercase tracking-widest font-bold">
                 <Link to="/vision-cortex" className="hover:text-[#39FF14] transition-colors">Vision Cortex</Link>
                 <span>•</span>
                 <Link to="/predict" className="hover:text-[#39FF14] transition-colors">Predict</Link>
                 <span>•</span>
                 <Link to="/simulate" className="hover:text-[#39FF14] transition-colors">Simulate</Link>
              </div>

           </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingPage;
