
import React from 'react';
import { Helmet } from 'react-helmet';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const PricingPage = () => {
  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "/3 days",
      desc: "Full system access for 72 hours. No credit card required.",
      features: ["3-Day Validity", "Basic Analytics", "1 Project", "Community Support"]
    },
    {
      name: "Starter",
      price: "$49",
      period: "/mo",
      desc: "Essential tools for individual developers.",
      features: ["10k API Calls", "Standard Support", "3 Projects", "Public Datasets"]
    },
    {
      name: "Plus",
      price: "$99",
      period: "/mo",
      desc: "Enhanced power for growing teams.",
      features: ["50k API Calls", "Priority Support", "10 Projects", "Advanced Analytics"]
    },
    {
      name: "Pro",
      price: "$299",
      period: "/mo",
      desc: "Professional grade neural processing.",
      features: ["Unlimited API Calls", "24/7 Support", "Unlimited Projects", "Custom Models"]
    },
    {
      name: "Elite",
      price: "$999",
      period: "/mo",
      desc: "Maximum velocity for scale-ups.",
      features: ["Dedicated GPU Cluster", "Account Manager", "SLA Guarantee", "Audit Logs"]
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "Sovereign infrastructure for global orgs.",
      features: ["On-Premise Deployment", "Air-Gapped Security", "Custom Training", "White Label"]
    },
  ];

  return (
    <>
      <Helmet>
        <title>Pricing Plans | Infinity X</title>
      </Helmet>

      <div className="min-h-screen pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Removed local background to allow global one to show */}
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
             >
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tighter">
                  Select <span className="text-[#39FF14] text-glow-green">Protocol</span>
                </h1>
                <p className="text-xl text-white/60 font-light leading-relaxed">
                  Transparent pricing for infinite scale. Upgrade or downgrade at any time.
                </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 rounded-2xl flex flex-col h-full hover:shadow-[0_0_30px_rgba(57,255,20,0.15)] transition-all group border border-white/10 bg-black/20 backdrop-blur-xl"
              >
                <div className="mb-6 border-b border-white/10 pb-6">
                  <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest group-hover:text-[#39FF14] transition-colors">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-black text-white tracking-tighter">{plan.price}</span>
                    <span className="text-white/40 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed min-h-[40px]">{plan.desc}</p>
                </div>

                <div className="flex-1 mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feat, k) => (
                      <li key={k} className="flex items-start gap-3 text-sm text-white/60">
                        <div className="p-0.5 rounded-full bg-[#39FF14]/20 text-[#39FF14] mt-0.5">
                           <Check className="w-3 h-3" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full bg-white/5 hover:bg-[#39FF14] hover:text-black border border-white/10 text-white font-bold tracking-widest uppercase text-xs h-12 transition-all">
                   Choose {plan.name}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
