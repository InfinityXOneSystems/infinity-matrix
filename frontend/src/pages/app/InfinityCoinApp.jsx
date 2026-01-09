
import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import BackgroundEnergy from '@/components/BackgroundEnergy';
import { Wallet, TrendingUp, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const InfinityCoinApp = () => {
  return (
    <div className="min-h-screen bg-[#020410] text-white flex flex-col">
       <Helmet><title>Infinity Coin Wallet | Infinity X</title></Helmet>
       <BackgroundEnergy />
       
       <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
          <div className="w-24 h-24 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50 mb-8 shadow-[0_0_50px_rgba(255,215,0,0.3)]">
             <Wallet size={48} className="text-yellow-500" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4 font-orbitron">Infinity Coin <span className="text-yellow-500">Wallet</span></h1>
          <p className="text-white/60 max-w-md mb-8">
             Securely manage your INFX tokens, stake for rewards, and participate in protocol governance.
          </p>

          <div className="glass-panel p-8 rounded-2xl border border-white/10 max-w-md w-full mb-8">
             <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-white/50 uppercase font-bold">Total Balance</span>
                <span className="text-xs text-[#39FF14] flex items-center gap-1"><TrendingUp size={12} /> +12.5%</span>
             </div>
             <div className="text-5xl font-mono font-bold text-white mb-2">0.00 <span className="text-lg text-yellow-500">INFX</span></div>
             <div className="text-sm text-white/30">$0.00 USD</div>
             
             <div className="grid grid-cols-2 gap-4 mt-8">
                <Button className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold">Deposit</Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white">Withdraw</Button>
             </div>
          </div>

          <div className="flex gap-4 text-xs text-white/30">
             <span className="flex items-center gap-1"><Lock size={12} /> Hardware Wallet Compatible</span>
             <span>•</span>
             <span>Audited by CertiK</span>
          </div>
          
          <div className="mt-12">
             <Link to="/">
                <Button variant="ghost" className="text-white/50 hover:text-white">Return Home</Button>
             </Link>
          </div>
       </div>
    </div>
  );
};

export default InfinityCoinApp;
