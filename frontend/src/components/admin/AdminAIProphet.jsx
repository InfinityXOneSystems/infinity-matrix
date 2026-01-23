
import React, { useState, useEffect } from 'react';
import TimelineVisualization from './TimelineVisualization';
import * as aiProphetService from '@/services/aiProphetService';
import { 
  Activity, TrendingUp, TrendingDown, Brain, Zap, 
  Target, DollarSign, AlertCircle, CheckCircle2, 
  Clock, BarChart3, LineChart, Sparkles, Eye,
  Play, Pause, RefreshCw, Download, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

// --- SPARKLINE CHART COMPONENT ---
const Sparkline = ({ data, color = "#39FF14", height = 40, showGradient = true }) => {
  if (!data || data.length === 0) return null;
  
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
      {showGradient && (
        <defs>
          <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {showGradient && (
        <path 
          d={`M0,100 L0,${100 - ((data[0] - min) / range) * 100} ${points.split(' ').map((p, i) => `L${p}`).join(' ')} L100,100 Z`} 
          fill={`url(#grad-${color})`} 
        />
      )}
      <polyline 
        points={points} 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        vectorEffect="non-scaling-stroke"
        className="drop-shadow-[0_0_8px_currentColor]"
      />
    </svg>
  );
};

// --- METRIC CARD COMPONENT ---
const MetricCard = ({ 
  label, 
  value, 
  subtext, 
  trend, 
  trendValue,
  chartData, 
  color = "green",
  icon: Icon,
  onClick 
}) => {
  const colorMap = {
    green: { text: "text-[#39FF14]", border: "border-[#39FF14]", bg: "bg-[#39FF14]", glow: "shadow-[0_0_20px_rgba(57,255,20,0.3)]" },
    blue: { text: "text-[#3399FF]", border: "border-[#3399FF]", bg: "bg-[#3399FF]", glow: "shadow-[0_0_20px_rgba(51,153,255,0.3)]" },
    red: { text: "text-[#FF0040]", border: "border-[#FF0040]", bg: "bg-[#FF0040]", glow: "shadow-[0_0_20px_rgba(255,0,64,0.3)]" },
    yellow: { text: "text-[#FFD700]", border: "border-[#FFD700]", bg: "bg-[#FFD700]", glow: "shadow-[0_0_20px_rgba(255,215,0,0.3)]" }
  };
  
  const theme = colorMap[color];
  const chartColor = color === 'green' ? '#39FF14' : (color === 'blue' ? '#3399FF' : (color === 'red' ? '#FF0040' : '#FFD700'));

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "p-6 rounded-2xl glass-panel relative overflow-hidden group cursor-pointer",
        "hover:border-white/20 transition-all duration-300",
        theme.glow
      )}
    >
      {/* Glow effect */}
      <div className={cn("absolute -right-10 -bottom-10 w-40 h-40 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500", theme.bg)} />
      
      {/* Icon */}
      {Icon && (
        <div className={cn("absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity", theme.text)}>
          <Icon size={48} strokeWidth={1} />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            {Icon && <Icon size={16} className={cn("opacity-60", theme.text)} />}
            <div className="text-white/50 text-[10px] uppercase font-bold tracking-[0.15em] font-mono">{label}</div>
          </div>
          {trend && (
            <div className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1", theme.border, theme.text, "bg-opacity-10")}>
              {trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {trendValue}
            </div>
          )}
        </div>
        
        <div className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</div>
        <div className="text-[11px] text-white/30 font-mono mb-4">{subtext}</div>
        
        {chartData && chartData.length > 0 && (
          <div className="h-12 w-full opacity-40 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkline data={chartData} color={chartColor} height={48} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- TIMELINE CARD COMPONENT ---
const TimelineCard = ({ timeline, onClick }) => {
  const probabilityColor = timeline.probability > 0.4 ? 'green' : (timeline.probability > 0.2 ? 'yellow' : 'blue');
  const colorMap = {
    green: { text: "text-[#39FF14]", border: "border-[#39FF14]", bg: "bg-[#39FF14]" },
    blue: { text: "text-[#3399FF]", border: "border-[#3399FF]", bg: "bg-[#3399FF]" },
    yellow: { text: "text-[#FFD700]", border: "border-[#FFD700]", bg: "bg-[#FFD700]" }
  };
  const theme = colorMap[probabilityColor];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={onClick}
      className="p-4 rounded-xl glass-panel hover:border-white/20 cursor-pointer transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-sm font-bold text-white mb-1">{timeline.name}</div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider font-mono">{timeline.timeline_type}</div>
        </div>
        <div className={cn("px-2 py-1 rounded text-[10px] font-bold border", theme.border, theme.text, "bg-opacity-10")}>
          {(timeline.probability * 100).toFixed(0)}%
        </div>
      </div>
      <div className="text-[11px] text-white/50 mb-3 line-clamp-2">{timeline.description}</div>
      <div className="flex items-center gap-2 text-[10px] text-white/30">
        <Eye size={12} />
        <span>{timeline.states?.length || 0} states</span>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
const AdminAIProphet = () => {
  const { toast } = useToast();
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pipelineData, setPipelineData] = useState(null);
  const [timelines, setTimelines] = useState([]);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);

  // Load AI Prophet data
  useEffect(() => {
    loadProphetData();
  }, []);

  const loadProphetData = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from AI Prophet API
      const [pipelineResults, timelinesData, portfolioInfo] = await Promise.all([
        aiProphetService.fetchPipelineResults(),
        aiProphetService.fetchTimelines(),
        aiProphetService.fetchPortfolio()
      ]);

      setPipelineData(pipelineResults);
      setTimelines(timelinesData);
      setPortfolioData(portfolioInfo);
      
      toast({
        title: "AI Prophet Data Loaded",
        description: "Successfully loaded pipeline and simulation data",
      });
    } catch (error) {
      console.error('Failed to load AI Prophet data:', error);
      toast({
        title: "Error Loading Data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runPipeline = async () => {
    toast({
      title: "Pipeline Starting",
      description: "Executing daily prediction pipeline...",
    });
    setIsLive(true);
    // In production, trigger the actual pipeline
    setTimeout(() => {
      loadProphetData();
      setIsLive(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white/60 text-sm font-mono">Loading AI Prophet...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Brain className="text-[#39FF14]" size={32} />
            AI Prophet
            <span className="text-sm font-normal text-white/40 ml-2">Quantum Wizard v1.0.0</span>
          </h1>
          <p className="text-white/50 text-sm font-mono">
            FAANG-Level Financial Prediction Intelligence | Multi-Timeline Simulations | Accuracy Tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={loadProphetData}
            variant="outline"
            size="sm"
            className="border-white/20 hover:border-[#3399FF] hover:bg-[#3399FF]/10 text-white"
          >
            <RefreshCw size={14} className="mr-2" />
            Refresh
          </Button>
          <Button
            onClick={runPipeline}
            disabled={isLive}
            className="bg-gradient-to-r from-[#39FF14] to-[#3399FF] hover:from-[#3399FF] hover:to-[#39FF14] text-black font-bold shadow-[0_0_20px_rgba(57,255,20,0.4)]"
          >
            {isLive ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                Running...
              </>
            ) : (
              <>
                <Play size={14} className="mr-2" />
                Run Pipeline
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <div className="p-4 rounded-xl glass-panel bg-gradient-to-r from-[#3399FF]/10 to-[#39FF14]/10 border-[#39FF14]/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#66FF33] animate-pulse shadow-[0_0_10px_rgba(102,255,51,0.8)]" />
          <div>
            <div className="text-sm font-bold text-white">System Status: OPERATIONAL</div>
            <div className="text-[10px] text-white/40 font-mono">Last pipeline: {new Date(pipelineData?.date).toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#39FF14]" />
            <span className="text-white/60">Accuracy: {((pipelineData?.stages?.learning?.accuracy || 0) * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-[#3399FF]" />
            <span className="text-white/60">{timelines.length} Timelines</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Portfolio Value"
          value={`$${(portfolioData?.total_value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          subtext={`P&L: ${portfolioData?.total_pnl_pct >= 0 ? '+' : ''}${(portfolioData?.total_pnl_pct || 0).toFixed(2)}%`}
          trend={portfolioData?.total_pnl_pct >= 0 ? 'up' : 'down'}
          trendValue={`${portfolioData?.total_pnl_pct >= 0 ? '+' : ''}${(portfolioData?.total_pnl_pct || 0).toFixed(2)}%`}
          chartData={[0.98, 0.99, 1.01, 1.00, 1.02, 1.01, 1.03, 1.02, 1.04, 1.03]}
          color={portfolioData?.total_pnl_pct >= 0 ? 'green' : 'red'}
          icon={DollarSign}
        />
        <MetricCard
          label="Predictions Made"
          value={pipelineData?.stages?.predictions?.count || 0}
          subtext="Active forecasts"
          trend="up"
          trendValue="+15"
          chartData={[5, 8, 12, 10, 15, 13, 18, 16, 20, 15]}
          color="blue"
          icon={Target}
        />
        <MetricCard
          label="Data Points"
          value={(pipelineData?.stages?.scraping?.data_points || 0).toLocaleString()}
          subtext="Scraped today"
          trend="up"
          trendValue="+247"
          chartData={[800, 850, 900, 920, 1000, 1050, 1100, 1150, 1200, 1247]}
          color="green"
          icon={Activity}
        />
        <MetricCard
          label="Trades Executed"
          value={pipelineData?.stages?.trading?.trades_executed || 0}
          subtext="Autonomous trades"
          trend="up"
          trendValue="+3"
          chartData={[0, 1, 1, 2, 2, 2, 3, 3, 3, 3]}
          color="yellow"
          icon={Zap}
        />
      </div>

      {/* Pipeline Stages */}
      <div className="p-6 rounded-2xl glass-panel">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 size={20} className="text-[#3399FF]" />
          Pipeline Stages
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(pipelineData?.stages || {}).map(([stage, data]) => (
            <div key={stage} className="p-3 rounded-lg glass-panel hover:border-[#39FF14]/30 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] text-white/40 uppercase tracking-wider font-mono">{stage}</div>
                {data.status === 'complete' ? (
                  <CheckCircle2 size={14} className="text-[#39FF14]" />
                ) : (
                  <Clock size={14} className="text-yellow-500" />
                )}
              </div>
              <div className="text-xl font-bold text-white mb-1">
                {typeof data.count !== 'undefined' ? data.count : 
                 typeof data.data_points !== 'undefined' ? data.data_points :
                 typeof data.timelines !== 'undefined' ? data.timelines :
                 typeof data.trades_executed !== 'undefined' ? data.trades_executed :
                 typeof data.evaluated !== 'undefined' ? data.evaluated :
                 typeof data.accuracy !== 'undefined' ? `${(data.accuracy * 100).toFixed(0)}%` : '✓'}
              </div>
              <div className="text-[9px] text-white/30 font-mono uppercase">{data.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Simulations */}
      <div className="p-6 rounded-2xl glass-panel">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles size={20} className="text-[#39FF14]" />
            Multi-Timeline Simulations
          </h2>
          <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
            {timelines.length} Parallel Futures
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {timelines.map((timeline) => (
            <TimelineCard
              key={timeline.timeline_id}
              timeline={timeline}
              onClick={() => setSelectedTimeline(timeline)}
            />
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 rounded-xl glass-panel flex items-center justify-between text-[10px] text-white/40 font-mono">
        <div>110% Protocol | FAANG Enterprise-Grade | Zero Human Hands</div>
        <div className="flex items-center gap-4">
          <span>Accuracy is everything.</span>
          <span className="text-[#39FF14]">ONLINE</span>
        </div>
      </div>

      {/* Timeline Visualization Modal */}
      {selectedTimeline && (
        <TimelineVisualization
          timeline={selectedTimeline}
          onClose={() => setSelectedTimeline(null)}
        />
      )}
    </motion.div>
  );
};

export default AdminAIProphet;
