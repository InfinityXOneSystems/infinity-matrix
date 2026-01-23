
import React from 'react';
import { 
  Search, Globe, Activity, BarChart2, 
  FileText, Link as LinkIcon, AlertCircle, CheckCircle,
  TrendingUp, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminSEODashboard = () => {
  return (
    <div className="space-y-8">
      {/* SEO Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Indexing Status", value: "98%", status: "Healthy", color: "text-[#39FF14]" },
          { label: "Avg. Rank Position", value: "4.2", status: "+0.5 this week", color: "text-[#39FF14]" },
          { label: "Crawl Errors", value: "0", status: "Clean", color: "text-[#0066FF]" },
          { label: "Structured Data", value: "Valid", status: "Schema.org", color: "text-[#D946EF]" }
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-xl border border-white/10">
            <div className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">{stat.label}</div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className={`text-xs font-mono ${stat.color}`}>{stat.status}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Console */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="text-[#39FF14]" size={20} /> Search Console
              </h3>
              <Button size="sm" variant="outline" className="border-white/10 text-xs">
                <RefreshCw size={12} className="mr-2" /> Sync Google
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14]">
                    <Search size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-white">sitemap.xml</div>
                    <div className="text-xs text-white/40">Last crawl: 14 mins ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#39FF14] text-xs font-bold uppercase">
                  <CheckCircle size={14} /> Submitted
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF]">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-white">robots.txt</div>
                    <div className="text-xs text-white/40">Allow: / (All Agents)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#39FF14] text-xs font-bold uppercase">
                  <CheckCircle size={14} /> Valid
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D946EF]/10 flex items-center justify-center text-[#D946EF]">
                    <Activity size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-white">Core Web Vitals</div>
                    <div className="text-xs text-white/40">LCP: 1.2s | CLS: 0.01</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#39FF14] text-xs font-bold uppercase">
                  <CheckCircle size={14} /> Passing
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10">
             <h3 className="text-lg font-bold text-white mb-4">Keyword Performance</h3>
             <div className="space-y-2">
                {[
                  { k: "autonomous business ai", p: 1, v: "14.2k" },
                  { k: "predictive enterprise analytics", p: 3, v: "8.1k" },
                  { k: "automated supply chain ai", p: 2, v: "5.5k" },
                  { k: "ai investment simulator", p: 1, v: "22.4k" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors">
                     <span className="text-white text-sm">{item.k}</span>
                     <div className="flex items-center gap-8">
                        <span className="text-white/40 text-xs w-16 text-right">{item.v} Vol</span>
                        <div className="flex items-center gap-2 w-16 justify-end">
                           <span className="text-[#39FF14] font-bold">#{item.p}</span>
                           <TrendingUp size={12} className="text-[#39FF14]" />
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar Tools */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Meta Tag Manager</h3>
            <div className="space-y-4">
               <div>
                  <label className="text-xs uppercase font-bold text-white/40 mb-1 block">Global Title Suffix</label>
                  <Input placeholder="| Infinity X AI" defaultValue="| Infinity X AI" className="bg-black/40 border-white/10" />
               </div>
               <div>
                  <label className="text-xs uppercase font-bold text-white/40 mb-1 block">Default Description</label>
                  <textarea className="w-full h-24 bg-black/40 border border-white/10 rounded-md p-2 text-white text-sm focus:border-[#39FF14] outline-none" 
                    defaultValue="The world's first autonomous business operating system. Scale operations, automate workflows, and predict market trends."
                  />
               </div>
               <Button className="w-full bg-[#39FF14] text-black font-bold">Update Global Tags</Button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10">
             <h3 className="text-lg font-bold text-white mb-4">Structured Data (JSON-LD)</h3>
             <div className="p-3 bg-black/40 rounded border border-white/10 font-mono text-[10px] text-white/60 mb-4 overflow-x-auto">
                {`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Infinity X",
  "url": "https://infinityxai.com"
}`}
             </div>
             <Button variant="outline" className="w-full border-white/10 text-white">Edit Schema Template</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSEODashboard;
