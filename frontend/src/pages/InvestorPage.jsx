
import React from 'react';
import { TrendingUp, PieChart, DollarSign, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const InvestorPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Investor Relations | Infinity X</title>
      </Helmet>
      
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Investor Relations</h1>
          <p className="text-white/50 mb-12">Performance metrics and growth trajectory.</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             {[
               { label: "YoY Growth", value: "+245%", icon: TrendingUp },
               { label: "Market Share", value: "12%", icon: PieChart },
               { label: "Evaluation", value: "$4.2B", icon: DollarSign },
               { label: "Enterprise Clients", value: "150+", icon: Briefcase },
             ].map((stat, i) => (
               <div key={i} className="glass-panel p-6 rounded-xl border border-[#C0C0C0]">
                  <div className="flex justify-between items-start mb-4">
                     <span className="text-white/60 text-sm uppercase tracking-wider">{stat.label}</span>
                     <stat.icon className="text-[#39FF14]" size={20} />
                  </div>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
               </div>
             ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             <div className="glass-panel p-8 rounded-2xl border border-[#C0C0C0]">
                <h3 className="text-xl font-bold text-white mb-6">Financial Reports</h3>
                <div className="space-y-4">
                   {['Q4 2024 Earnings', 'Q3 2024 Earnings', 'Annual Report 2023'].map((report) => (
                      <div key={report} className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-[#C0C0C0]/20 hover:border-[#39FF14] cursor-pointer transition-all">
                         <span className="text-white">{report}</span>
                         <Button variant="ghost" size="sm" onClick={() => navigate('#')}>Download PDF</Button>
                      </div>
                   ))}
                </div>
             </div>

             <div className="glass-panel p-8 rounded-2xl border border-[#C0C0C0] flex flex-col justify-center text-center">
                <h3 className="text-xl font-bold text-white mb-4">Contact IR Team</h3>
                <p className="text-white/60 mb-8">
                   For inquiries regarding stock, governance, or financial data.
                </p>
                <Button className="w-full bg-white text-black hover:bg-gray-200" onClick={() => navigate('/about')}>
                   Get in Touch
                </Button>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestorPage;
