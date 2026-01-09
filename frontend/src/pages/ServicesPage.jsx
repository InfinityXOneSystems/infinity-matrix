import React from 'react';
import { Helmet } from 'react-helmet';

const ServicesPage = () => {
  return (
    <>
      <Helmet><title>Services | Infinity X</title></Helmet>
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h1 className="text-5xl font-bold mb-8 leading-tight">
              Some people want everything. <br/>
              <span className="text-[#0066FF]">Some want precision.</span>
            </h1>
            <p className="text-xl text-gray-400">
              We offer bespoke implementation of autonomous architecture for enterprise environments that cannot fail.
            </p>
          </div>
          
          <div className="space-y-6">
            {["Custom Neural Training", "Autonomous Agent Orchestration", "Predictive Pipeline Architecture", "Legacy System Integration", "Security & Governance Audits"].map((s, i) => (
              <div key={i} className="glass-panel p-6 border-l-4 border-l-[#0066FF] hover:translate-x-2 transition-transform cursor-default">
                <h3 className="text-lg font-bold">{s}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesPage;