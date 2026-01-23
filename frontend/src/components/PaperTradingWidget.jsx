
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Coins, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PaperTradingWidget = ({ industryName }) => {
  const [data, setData] = useState([]);
  const [balance, setBalance] = useState(10000);
  const [holdings, setHoldings] = useState(0);
  const [price, setPrice] = useState(500);
  const [tradeAmount, setTradeAmount] = useState('');
  
  // Simulate live data
  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      value: 500 + Math.random() * 50 - 25
    }));
    setData(initialData);

    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const change = (Math.random() - 0.48) * 10; // Slight upward bias
        const newValue = Math.max(10, last.value + change);
        setPrice(newValue);
        return [...prev.slice(1), { time: last.time + 1, value: newValue }];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBuy = () => {
    const cost = parseFloat(tradeAmount) * price;
    if (cost <= balance) {
      setBalance(b => b - cost);
      setHoldings(h => h + parseFloat(tradeAmount));
      setTradeAmount('');
    }
  };

  const handleSell = () => {
    const amount = parseFloat(tradeAmount);
    if (amount <= holdings) {
      setBalance(b => b + (amount * price));
      setHoldings(h => h - amount);
      setTradeAmount('');
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-silver-border-color bg-black/40">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Coins className="text-[#39FF14]" size={20} />
          INFINITY COIN (INF)
        </h3>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-mono font-bold text-white">${price.toFixed(2)}</span>
          <span className="text-[10px] text-white/50 uppercase tracking-wider">Live Price</span>
        </div>
      </div>

      <div className="h-40 mb-6 bg-black/20 rounded-xl overflow-hidden border border-white/5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis domain={['auto', 'auto']} hide />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#0066FF" 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-mono">
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="text-white/40 mb-1">BALANCE (USD)</div>
          <div className="text-white font-bold">${balance.toFixed(2)}</div>
        </div>
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="text-white/40 mb-1">HOLDINGS (INF)</div>
          <div className="text-white font-bold">{holdings.toFixed(4)}</div>
        </div>
      </div>

      <div className="space-y-3">
        <Input 
          type="number" 
          placeholder="Amount" 
          value={tradeAmount}
          onChange={(e) => setTradeAmount(e.target.value)}
          className="bg-black/40 border-white/20 text-white font-mono"
        />
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={handleBuy} 
            className="bg-green-600 hover:bg-green-500 text-white font-bold"
            disabled={!tradeAmount || parseFloat(tradeAmount) * price > balance}
          >
            BUY
          </Button>
          <Button 
            onClick={handleSell} 
            className="bg-red-600 hover:bg-red-500 text-white font-bold"
            disabled={!tradeAmount || parseFloat(tradeAmount) > holdings}
          >
            SELL
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
        <AlertTriangle size={14} className="text-red-400 shrink-0" />
        <p className="text-[10px] text-red-200 leading-tight">
          Warning: This has no value and is on testnet. Paper trading environment only.
        </p>
      </div>
    </div>
  );
};

export default PaperTradingWidget;
