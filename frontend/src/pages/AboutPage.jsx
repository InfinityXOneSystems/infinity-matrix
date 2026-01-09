
import React from 'react';
import { Users, Globe, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>About Us | Infinity X</title>
      </Helmet>
      
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
           <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">We are the <br/><span className="text-[#39FF14] text-glow-green">Architects</span></h1>
           <p className="text-xl text-white/70 mb-16 leading-relaxed">
              Infinity X was founded on a simple premise: Human intelligence is limited by bandwidth. 
              Artificial intelligence is limited by context. We bridge the gap.
           </p>

           <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                { icon: Users, title: "Global Team", desc: "Engineers from 12 countries working in sync." },
                { icon: Globe, title: "Distributed", desc: "Decentralized infrastructure with zero downtime." },
                { icon: Award, title: "Award Winning", desc: "Recognized as the #1 AI Innovation of 2025." },
              ].map((item, i) => (
                 <div key={i} className="glass-panel p-8 rounded-2xl border border-[#C0C0C0]">
                    <item.icon className="mx-auto text-[#39FF14] mb-4" size={32} />
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/50 text-sm">{item.desc}</p>
                 </div>
              ))}
           </div>

           <div className="glass-panel p-12 rounded-3xl border border-[#C0C0C0]">
              <h2 className="text-3xl font-bold text-white mb-6">Join the Revolution</h2>
              <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                 We are always looking for visionaries, engineers, and strategists to join our ranks.
              </p>
              <div className="flex gap-4 justify-center">
                 <Button className="bg-[#39FF14] text-black hover:bg-[#32cc12]" onClick={() => navigate('/auth')}>
                    View Careers
                 </Button>
                 <Button variant="outline" onClick={() => navigate('/contact')}>
                    Contact Us
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
