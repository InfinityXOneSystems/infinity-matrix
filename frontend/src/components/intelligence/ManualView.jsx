
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, ShieldAlert, Power, Save, RefreshCw } from 'lucide-react';
import { getManualControls, safeMap } from '@/lib/intelligence-data';
import { cn } from '@/lib/utils';

const ManualView = () => {
  const [controls, setControls] = useState(getManualControls());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Main Control Panel */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="lg:col-span-2 glass-panel rounded-2xl p-8 relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-white tracking-widest uppercase flex items-center gap-3">
            <Sliders className="text-[#FF3333]" /> Manual Override
          </h3>
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#FF3333]/10 border border-[#FF3333]/30 text-[#FF3333] text-xs font-bold uppercase tracking-wider">
            <ShieldAlert size={14} /> Safety Protocols Active
          </div>
        </div>

        <div className="grid gap-8">
          {safeMap(controls, (control) => (
            <div key={control.id} className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-white/80 uppercase tracking-wide">{control.label}</label>
                <span className="text-2xl font-mono font-bold text-[#FF3333] text-glow">
                  {control.value}<span className="text-sm text-white/40 ml-1">{control.unit}</span>
                </span>
              </div>
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#FF3333] shadow-[0_0_10px_#FF3333]" 
                  style={{ width: `${(control.value / control.max) * 100}%` }}
                />
                <input 
                  type="range" 
                  min={control.min} 
                  max={control.max} 
                  value={control.value}
                  onChange={(e) => {
                    const newControls = controls.map(c => c.id === control.id ? {...c, value: parseInt(e.target.value)} : c);
                    setControls(newControls);
                  }}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/30 font-mono uppercase">
                <span>Min: {control.min}</span>
                <span>Max: {control.max}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-end gap-4">
          <button 
            onClick={() => setControls(getManualControls())}
            className="px-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <RefreshCw size={14} /> Reset
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-3 rounded-xl bg-[#FF3333] text-white hover:bg-[#CC0000] shadow-[0_0_20px_rgba(255,51,51,0.4)] transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2"
          >
            {isSaving ? <span className="animate-pulse">Syncing...</span> : <><Save size={14} /> Apply Config</>}
          </button>
        </div>
      </motion.div>

      {/* Side Status */}
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-6 h-full flex flex-col justify-center items-center text-center"
        >
          <div className="w-20 h-20 rounded-full border-4 border-[#FF3333]/30 flex items-center justify-center mb-6 relative">
            <Power size={32} className="text-[#FF3333]" />
            <div className="absolute inset-0 rounded-full border-t-4 border-[#FF3333] animate-spin duration-[3s]" />
          </div>
          <h4 className="text-white font-bold text-lg mb-2">Manual Control</h4>
          <p className="text-white/50 text-sm leading-relaxed">
            AI automation is suspended. Execution logic is strictly adhering to your defined parameters.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ManualView;
