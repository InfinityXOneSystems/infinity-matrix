
import React from 'react';
import { Helmet } from 'react-helmet';
import { ChevronDown } from 'lucide-react';
import TriangleLogo from '@/components/ui/TriangleLogo';
import ModeToggle from '@/components/ModeToggle';
import VisionCortexChat from './VisionCortexChat';
import IntelligenceSearch from './IntelligenceSearch';
import DashboardWidget from './DashboardWidget';
import ScraperAnalytics from './ScraperAnalytics';

const IndustryPageTemplate = ({ 
  industryName, 
  subIndustries, 
  dashboardConfig, 
  searchPlaceholder 
}) => {
  return (
    <>
      <Helmet><title>{industryName} Intelligence | Infinity X</title></Helmet>
      
      <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-[#39FF14] selection:text-black">
         {/* Top Navigation Bar with Branding */}
         <nav className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-white/10 bg-black/80 backdrop-blur-xl flex items-center justify-between px-6 lg:px-12">
            <div className="flex items-center gap-4">
               <TriangleLogo size={32} />
               <div className="h-8 w-px bg-white/20" />
               <h1 className="font-bold text-lg tracking-widest uppercase">
                  {industryName} <span className="text-[#39FF14]">INTEL</span>
               </h1>
            </div>
            
            {/* Sub-industry Dropdown */}
            <div className="hidden md:flex relative group">
               <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-[#39FF14] hover:text-[#39FF14] transition-all text-sm uppercase tracking-wide font-medium">
                  Sector Select <ChevronDown size={14} />
               </button>
               <div className="absolute top-full right-0 mt-2 w-56 bg-black border border-white/20 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all shadow-2xl">
                  {subIndustries.map((sub, i) => (
                     <div key={i} className="px-4 py-3 hover:bg-white/10 cursor-pointer text-xs uppercase tracking-wider border-b border-white/5 last:border-0 hover:text-[#39FF14] transition-colors">
                        {sub}
                     </div>
                  ))}
               </div>
            </div>
         </nav>

         <main className="pt-32 pb-20 px-6 lg:px-12 max-w-[1600px] mx-auto space-y-20">
            {/* 1. Chat Section */}
            <section className="relative z-10">
               <div className="text-center mb-10">
                  <h2 className="text-4xl font-light mb-2">Strategic Command</h2>
                  <p className="text-white/40">Connect with the neural grid for predictive insights.</p>
               </div>
               <VisionCortexChat industry={industryName} />
            </section>

            {/* 2. Search Section */}
            <section>
               <IntelligenceSearch placeholder={searchPlaceholder} />
            </section>

            {/* 3. Dashboard Grid */}
            <section>
               <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
                  <h3 className="font-bold text-xl uppercase tracking-[0.2em] text-white/80">Live Intelligence Metrics</h3>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {dashboardConfig.map((widget, idx) => (
                     <DashboardWidget 
                        key={idx} 
                        {...widget} 
                        delay={idx} 
                     />
                  ))}
               </div>
            </section>

            {/* 4. Scraper / Crawler Section */}
            <section>
               <ScraperAnalytics />
            </section>
         </main>
      </div>
    </>
  );
};

export default IndustryPageTemplate;
