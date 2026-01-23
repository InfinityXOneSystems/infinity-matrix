
import React from 'react';
import { Search, Filter, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const IntelligenceSearch = ({ placeholder }) => {
  return (
    <div className="w-full max-w-3xl mx-auto my-12 relative z-20">
       <div className="flex items-center bg-black/60 border-2 border-white/20 rounded-full px-6 py-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] focus-within:border-[#39FF14]/70 focus-within:shadow-[0_0_30px_rgba(57,255,20,0.2)] transition-all duration-300 backdrop-blur-xl group">
          <Search size={24} className="text-white/40 mr-4 group-focus-within:text-[#39FF14] transition-colors" />
          <input 
             type="text" 
             placeholder={placeholder || "Search intelligence database..."} 
             className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-white/30 font-light"
          />
          <div className="h-6 w-px bg-white/10 mx-4" />
          <button className="text-white/40 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
             <Filter size={20} />
          </button>
          <Button className="ml-2 rounded-full bg-[#0066FF] hover:bg-[#0052cc] text-white px-6">
             Search
          </Button>
       </div>
       
       <div className="flex justify-center gap-6 mt-4">
          {['Global', 'National', 'State', 'Local'].map((scope) => (
             <button key={scope} className="text-xs font-bold text-white/40 uppercase hover:text-[#39FF14] transition-colors flex items-center gap-1">
                <Globe size={10} /> {scope}
             </button>
          ))}
       </div>
    </div>
  );
};

export default IntelligenceSearch;
