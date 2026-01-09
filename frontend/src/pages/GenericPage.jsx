import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

// Reusable component for the content pages
const GenericPage = ({ title, subtitle, content }) => {
  return (
    <>
      <Helmet>
        <title>{title} | Infinity X AI</title>
      </Helmet>
      <div className="min-h-screen py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight">{title}</h1>
            <p className="text-xl text-[#00f3ff] mb-12 font-light tracking-wide">{subtitle}</p>
            
            <div className="prose prose-invert prose-lg max-w-none text-white/70">
              <div className="p-8 border border-white/10 bg-white/5 rounded-xl backdrop-blur-md">
                 {content || (
                   <p>
                     System Module Loading... <br/><br/>
                     Content for this sector is currently being propagated across the global edge network. 
                     Please check back shortly as the system finishes initialization.
                   </p>
                 )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default GenericPage;