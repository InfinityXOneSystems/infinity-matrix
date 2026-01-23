
import React from 'react';
import { Globe, Database, Server, ShieldCheck } from 'lucide-react';

const ScraperAnalytics = () => {
  return (
    <div className="glass-panel rounded-3xl border border-white/10 bg-black/40 p-8 relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF]/10 blur-[100px] pointer-events-none" />
       
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10">
          <div>
             <h2 className="text-2xl font-light text-white mb-2">Crawler Analytics</h2>
             <p className="text-white/40 text-sm">Real-time ingestion from 450+ data sources.</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
             <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 flex items-center gap-2 text-xs text-white">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>System Operational</span>
             </div>
             <div className="px-4 py-2 rounded-full border border-[#0066FF]/30 bg-[#0066FF]/10 text-xs text-[#0066FF]">
                14.2M Records Processed
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Map Visualization Placeholder */}
          <div className="lg:col-span-2 h-80 rounded-2xl border border-white/10 bg-black/50 relative overflow-hidden group">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
             {/* Simple SVG Map Representation */}
             <svg className="w-full h-full opacity-30" viewBox="0 0 800 400">
                <path d="M150,150 Q200,100 250,150 T350,150 T450,150" fill="none" stroke="#39FF14" strokeWidth="2" />
                <circle cx="200" cy="120" r="4" fill="#0066FF" className="animate-pulse" />
                <circle cx="350" cy="150" r="4" fill="#0066FF" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <circle cx="550" cy="180" r="4" fill="#0066FF" className="animate-pulse" style={{ animationDelay: '1s' }} />
                {/* Grid lines */}
                <path d="M0,50 H800 M0,150 H800 M0,250 H800 M0,350 H800" stroke="white" strokeOpacity="0.1" />
                <path d="M100,0 V400 M300,0 V400 M500,0 V400 M700,0 V400" stroke="white" strokeOpacity="0.1" />
             </svg>
             <div className="absolute bottom-4 left-4">
                <div className="text-xs font-mono text-[#39FF14]">SCANNING REGION: NA-EAST-1</div>
             </div>
          </div>

          {/* Stats Column */}
          <div className="space-y-4">
             {[
                { label: "Active Scrapers", value: "42", icon: Globe, color: "text-blue-400" },
                { label: "Data Points/Sec", value: "840", icon: Database, color: "text-purple-400" },
                { label: "Proxy Health", value: "99.9%", icon: ShieldCheck, color: "text-green-400" },
                { label: "Server Load", value: "34%", icon: Server, color: "text-yellow-400" },
             ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
                   <div className="flex items-center gap-3">
                      <stat.icon size={18} className={stat.color} />
                      <span className="text-sm text-white/70">{stat.label}</span>
                   </div>
                   <span className="font-mono font-bold text-white">{stat.value}</span>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default ScraperAnalytics;
