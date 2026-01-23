
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  Building2, Activity, AlertTriangle, TrendingUp, 
  Map, DollarSign, Home, Bed, Bath, List
} from 'lucide-react';
import DashboardWidget from '@/components/industry/DashboardWidget';
import RealEstateAgentChat from '@/components/industry/RealEstateAgentChat';
import { Button } from '@/components/ui/button';

// Mock Data for Real Estate
const mockProperties = [
  { id: 1, address: "1245 Maple Ave, Austin, TX", price: "$450,000", distress: "High", type: "Single Family", roi: "+15%", img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=400", status: "Pre-Foreclosure" },
  { id: 2, address: "8809 Sunset Blvd, Los Angeles, CA", price: "$2,100,000", distress: "Med", type: "Commercial", roi: "+8%", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400", status: "Short Sale" },
  { id: 3, address: "42 Wallaby Way, Sydney, AU", price: "$850,000", distress: "Low", type: "Condo", roi: "+12%", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400", status: "Active" },
  { id: 4, address: "5500 Grand St, New York, NY", price: "$1,200,000", distress: "High", type: "Multi-Family", roi: "+18%", img: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=400", status: "Auction" },
  { id: 5, address: "77 Pine Ridge, Aspen, CO", price: "$4,500,000", distress: "Med", type: "Vacation", roi: "+6%", img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=400", status: "Active" },
  { id: 6, address: "2020 Vision Ct, Miami, FL", price: "$920,000", distress: "High", type: "Single Family", roi: "+22%", img: "https://images.unsplash.com/photo-1600596542815-37a9a2286392?auto=format&fit=crop&q=80&w=400", status: "Bank Owned" },
];

const RealEstatePage = () => {
  const [viewMode, setViewMode] = useState('grid');
  
  const stats = [
    { title: "Market Temperature", icon: Activity, type: "chart", data: { points: [45, 60, 55, 70, 85, 80, 92] } },
    { title: "Distressed Volume", icon: AlertTriangle, type: "stat", data: { value: "1,240", change: "+12%", trend: "up" } },
    { title: "Avg ROI (City)", icon: TrendingUp, type: "stat", data: { value: "14.2%", change: "+2.1%", trend: "up" } },
    { title: "Median Price", icon: DollarSign, type: "stat", data: { value: "$540k", change: "-1.5%", trend: "down" } },
  ];

  return (
    <>
      <Helmet><title>Real Estate Intelligence | Infinity X</title></Helmet>
      
      <div className="min-h-screen bg-[#020410] text-white pt-20 pb-0 flex flex-col overflow-hidden">
         
         {/* 1. HERO SECTION */}
         <div className="shrink-0 px-6 py-8 md:py-10 border-b border-white/10 bg-[#020410] relative z-20">
            <div className="max-w-[1800px] mx-auto text-center">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#0066FF]"
               >
                  <Building2 size={32} />
               </motion.div>
               <motion.h1 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.1 }}
                 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-2"
               >
                  REAL ESTATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#39FF14] text-glow">INTELLIGENCE</span>
               </motion.h1>
               <motion.p 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="text-white/40 max-w-2xl mx-auto text-lg"
               >
                  Autonomous asset discovery and predictive valuation powered by Vision Cortex & Quantum X.
               </motion.p>
            </div>
         </div>

         {/* 2. SPLIT LAYOUT (Sticky Chat + Scrolling Content) */}
         <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
            
            {/* FLOATING CHAT / AGENT INTERFACE (Sticky Top/Left) */}
            {/* On Desktop: Left Side or Top Half? Prompt said "1/2 horizontal floating chat at top". 
                I will make it a split view where top 45% is Chat, Bottom 55% is Dashboard if mobile, 
                or Side-by-Side on large screens? 
                "Horizontal" implies width. "1/2 horizontal" -> 50% width?
                Let's do Top Split (Vertical split) for "at top".
            */}
            <div className="lg:h-full lg:w-[40%] xl:w-[35%] shrink-0 border-r border-white/10 relative z-30 shadow-[10px_0_50px_rgba(0,0,0,0.5)]">
               <RealEstateAgentChat />
            </div>

            {/* MAIN DASHBOARD CONTENT (Scrolling) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#020410] relative">
               <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 fixed" />
               
               <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10 relative z-10">
                  
                  {/* ANALYTICS DASHBOARD */}
                  <section>
                     <div className="flex items-center gap-4 mb-6">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#39FF14]/50" />
                        <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-[#39FF14]">FAANG-Grade Analytics</h3>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#39FF14]/50" />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                           <DashboardWidget key={i} {...stat} delay={i} />
                        ))}
                     </div>
                  </section>

                  {/* PROPERTY CARDS */}
                  <section>
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-white">Distressed Assets Feed</h3>
                        <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                           <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#0066FF] text-white' : 'text-white/40 hover:text-white'}`}><List size={16} className="rotate-90" /></button>
                           <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[#0066FF] text-white' : 'text-white/40 hover:text-white'}`}><List size={16} /></button>
                           <button onClick={() => setViewMode('map')} className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-[#0066FF] text-white' : 'text-white/40 hover:text-white'}`}><Map size={16} /></button>
                        </div>
                     </div>
                     
                     <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                        {mockProperties.map((prop, i) => (
                           <motion.div 
                              key={prop.id}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05 }}
                              className="group relative bg-[#050a14] rounded-2xl border border-white/10 overflow-hidden hover:border-[#39FF14] transition-all duration-300 hover:shadow-[0_0_30px_rgba(57,255,20,0.15)]"
                           >
                              {/* Deep Blue & Neon Green Accents */}
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0066FF] to-[#39FF14]" />
                              
                              <div className="relative h-48 overflow-hidden">
                                 <img src={prop.img} alt={prop.address} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] to-transparent" />
                                 
                                 <div className="absolute top-3 left-3 flex gap-2">
                                    <span className="px-2 py-1 bg-black/60 backdrop-blur border border-white/10 rounded text-[10px] font-bold uppercase text-white">
                                       {prop.type}
                                    </span>
                                 </div>
                                 <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                    <div className="text-2xl font-black text-white tracking-tight">{prop.price}</div>
                                    <div className={`px-2 py-1 rounded border text-[10px] font-bold uppercase backdrop-blur-md ${
                                       prop.distress === 'High' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                                    }`}>
                                       {prop.status}
                                    </div>
                                 </div>
                              </div>

                              <div className="p-5">
                                 <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-white/90 text-sm truncate pr-2">{prop.address}</h4>
                                    <div className="flex items-center gap-1 text-[#39FF14] font-mono text-xs font-bold whitespace-nowrap">
                                       <TrendingUp size={12} /> {prop.roi} ROI
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-3 gap-2 py-3 border-t border-white/5 border-b mb-4">
                                    <div className="text-center">
                                       <div className="text-[10px] text-white/40 uppercase font-bold">Beds</div>
                                       <div className="text-sm font-bold text-white flex justify-center items-center gap-1"><Bed size={12} /> 4</div>
                                    </div>
                                    <div className="text-center border-l border-white/5">
                                       <div className="text-[10px] text-white/40 uppercase font-bold">Baths</div>
                                       <div className="text-sm font-bold text-white flex justify-center items-center gap-1"><Bath size={12} /> 3</div>
                                    </div>
                                    <div className="text-center border-l border-white/5">
                                       <div className="text-[10px] text-white/40 uppercase font-bold">Sqft</div>
                                       <div className="text-sm font-bold text-white flex justify-center items-center gap-1"><Home size={12} /> 2.4k</div>
                                    </div>
                                 </div>

                                 <Button className="w-full bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/30 hover:bg-[#0066FF] hover:text-white font-bold transition-all">
                                    View Analytics
                                 </Button>
                              </div>
                           </motion.div>
                        ))}
                     </div>
                  </section>
               </div>
            </div>
         </div>
      </div>
    </>
  );
};

export default RealEstatePage;
