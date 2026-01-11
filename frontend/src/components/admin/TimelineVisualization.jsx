
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, TrendingUp, TrendingDown, Activity, DollarSign,
  BarChart3, LineChart as LineChartIcon, Zap, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Timeline Visualization Modal
 * Displays detailed timeline simulation data with interactive charts
 */
const TimelineVisualization = ({ timeline, onClose }) => {
  const [viewMode, setViewMode] = useState('price'); // price, volume, sentiment, volatility

  if (!timeline) return null;

  // Calculate statistics
  const stats = useMemo(() => {
    if (!timeline.states || timeline.states.length === 0) return null;

    const prices = timeline.states.map(s => s.price);
    const volumes = timeline.states.map(s => s.volume);
    const sentiments = timeline.states.map(s => s.sentiment);
    
    const startPrice = prices[0];
    const endPrice = prices[prices.length - 1];
    const priceChange = ((endPrice - startPrice) / startPrice) * 100;
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;

    return {
      startPrice,
      endPrice,
      priceChange,
      maxPrice,
      minPrice,
      avgVolume,
      avgSentiment,
      volatility: ((maxPrice - minPrice) / startPrice) * 100
    };
  }, [timeline]);

  // Prepare chart data based on view mode
  const chartData = useMemo(() => {
    if (!timeline.states) return [];
    
    switch (viewMode) {
      case 'price':
        return timeline.states.map(s => s.price);
      case 'volume':
        return timeline.states.map(s => s.volume);
      case 'sentiment':
        return timeline.states.map(s => s.sentiment);
      case 'volatility':
        return timeline.states.map(s => s.volatility);
      default:
        return timeline.states.map(s => s.price);
    }
  }, [timeline, viewMode]);

  const colorMap = {
    green: { text: "text-[#39FF14]", border: "border-[#39FF14]", bg: "bg-[#39FF14]", hex: "#39FF14" },
    blue: { text: "text-[#0066FF]", border: "border-[#0066FF]", bg: "bg-[#0066FF]", hex: "#0066FF" },
    red: { text: "text-[#FF0040]", border: "border-[#FF0040]", bg: "bg-[#FF0040]", hex: "#FF0040" },
    yellow: { text: "text-[#FFD700]", border: "border-[#FFD700]", bg: "bg-[#FFD700]", hex: "#FFD700" }
  };

  const probabilityColor = timeline.probability > 0.4 ? 'green' : (timeline.probability > 0.2 ? 'yellow' : 'blue');
  const priceColor = stats && stats.priceChange >= 0 ? 'green' : 'red';
  const theme = colorMap[probabilityColor];
  const priceTheme = colorMap[priceColor];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-[#0A0A0A] border border-white/20 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#0A0A0A] border-b border-white/10 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">{timeline.name}</h2>
                  <div className={cn("px-3 py-1 rounded-lg text-xs font-bold border", theme.border, theme.text, "bg-opacity-10")}>
                    {(timeline.probability * 100).toFixed(0)}% Probability
                  </div>
                </div>
                <p className="text-sm text-white/60 mb-2">{timeline.description}</p>
                <div className="flex items-center gap-4 text-xs text-white/40 font-mono">
                  <span>ID: {timeline.timeline_id}</span>
                  <span>•</span>
                  <span>Type: {timeline.timeline_type}</span>
                  <span>•</span>
                  <span>Asset: {timeline.target_asset}</span>
                  <span>•</span>
                  <span>Theory: {timeline.theory_basis}</span>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-[#111] border border-white/10">
                <div className="text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Price Change</div>
                <div className={cn("text-2xl font-bold flex items-center gap-2", priceTheme.text)}>
                  {stats.priceChange >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  {stats.priceChange >= 0 ? '+' : ''}{stats.priceChange.toFixed(2)}%
                </div>
                <div className="text-[10px] text-white/30 font-mono mt-1">
                  ${stats.startPrice.toLocaleString()} → ${stats.endPrice.toLocaleString()}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#111] border border-white/10">
                <div className="text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Price Range</div>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  <Activity size={20} className="text-[#0066FF]" />
                  {stats.volatility.toFixed(2)}%
                </div>
                <div className="text-[10px] text-white/30 font-mono mt-1">
                  ${stats.minPrice.toLocaleString()} - ${stats.maxPrice.toLocaleString()}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#111] border border-white/10">
                <div className="text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Avg Volume</div>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  <BarChart3 size={20} className="text-[#39FF14]" />
                  ${(stats.avgVolume / 1000000).toFixed(0)}M
                </div>
                <div className="text-[10px] text-white/30 font-mono mt-1">
                  Daily trading volume
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#111] border border-white/10">
                <div className="text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Sentiment</div>
                <div className={cn("text-2xl font-bold flex items-center gap-2", stats.avgSentiment >= 0 ? "text-[#39FF14]" : "text-[#FF0040]")}>
                  <Zap size={20} />
                  {stats.avgSentiment >= 0 ? '+' : ''}{stats.avgSentiment.toFixed(2)}
                </div>
                <div className="text-[10px] text-white/30 font-mono mt-1">
                  Market sentiment score
                </div>
              </div>
            </div>
          )}

          {/* View Mode Selector */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 p-1 bg-[#111] rounded-lg border border-white/10 w-fit">
              {[
                { id: 'price', label: 'Price', icon: DollarSign },
                { id: 'volume', label: 'Volume', icon: BarChart3 },
                { id: 'sentiment', label: 'Sentiment', icon: Zap },
                { id: 'volatility', label: 'Volatility', icon: Activity }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id)}
                  className={cn(
                    "px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2",
                    viewMode === id 
                      ? "bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="px-6 pb-6">
            <div className="p-6 rounded-xl bg-[#111] border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/5 to-[#39FF14]/5" />
              <div className="relative z-10">
                <TimelineChart 
                  data={chartData} 
                  color={viewMode === 'price' ? priceTheme.hex : colorMap.blue.hex}
                  label={viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
                />
              </div>
            </div>
          </div>

          {/* States Table */}
          <div className="px-6 pb-6">
            <div className="p-6 rounded-xl bg-[#111] border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Eye size={16} className="text-[#0066FF]" />
                Timeline States ({timeline.states?.length || 0} days)
              </h3>
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-[#111] border-b border-white/10">
                    <tr className="text-white/40 font-mono uppercase tracking-wider">
                      <th className="text-left py-2 px-3">Day</th>
                      <th className="text-right py-2 px-3">Price</th>
                      <th className="text-right py-2 px-3">Change</th>
                      <th className="text-right py-2 px-3">Volume</th>
                      <th className="text-right py-2 px-3">Sentiment</th>
                      <th className="text-right py-2 px-3">Volatility</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {timeline.states?.map((state, idx) => {
                      const prevPrice = idx > 0 ? timeline.states[idx - 1].price : state.price;
                      const change = ((state.price - prevPrice) / prevPrice) * 100;
                      
                      return (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-2 px-3 text-white/60">{idx + 1}</td>
                          <td className="py-2 px-3 text-right text-white font-bold">
                            ${state.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                          </td>
                          <td className={cn("py-2 px-3 text-right font-bold", change >= 0 ? "text-[#39FF14]" : "text-[#FF0040]")}>
                            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                          </td>
                          <td className="py-2 px-3 text-right text-white/60">
                            ${(state.volume / 1000000).toFixed(0)}M
                          </td>
                          <td className={cn("py-2 px-3 text-right", state.sentiment >= 0 ? "text-[#39FF14]" : "text-[#FF0040]")}>
                            {state.sentiment >= 0 ? '+' : ''}{state.sentiment.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-right text-white/60">
                            {(state.volatility * 100).toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Timeline Chart Component
 */
const TimelineChart = ({ data, color, label }) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return { x, y, val };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaData = `M0,100 L${points.map(p => `${p.x},${p.y}`).join(' L')} L100,100 Z`;

  return (
    <div className="relative">
      <div className="text-xs text-white/40 font-mono uppercase tracking-wider mb-2">{label}</div>
      <svg 
        width="100%" 
        height="300" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        className="rounded-lg"
      >
        <defs>
          <linearGradient id={`chart-gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line 
            key={y}
            x1="0" 
            y1={y} 
            x2="100" 
            y2={y} 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth="0.2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        
        {/* Area fill */}
        <path 
          d={areaData} 
          fill={`url(#chart-gradient-${color})`}
        />
        
        {/* Line */}
        <path 
          d={pathData} 
          fill="none" 
          stroke={color} 
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          className="drop-shadow-[0_0_8px_currentColor]"
        />
        
        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="0.5"
            fill={color}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <title>{p.val.toLocaleString()}</title>
          </circle>
        ))}
      </svg>
      
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-white/30 font-mono pr-2">
        <span>${max.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        <span>${((max + min) / 2).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        <span>${min.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
      </div>
    </div>
  );
};

export default TimelineVisualization;
