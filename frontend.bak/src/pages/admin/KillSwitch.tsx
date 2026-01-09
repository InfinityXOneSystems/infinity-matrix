
import React, { useState } from 'react';
import { Power, AlertTriangle } from 'lucide-react';

export default function KillSwitch() {
  const [enabled, setEnabled] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleKill = async () => {
    await fetch('/api/admin/builder/kill', { method: 'POST' });
    setEnabled(false);
    setShowConfirm(false);
  };

  const handleEnable = async () => {
    await fetch('/api/admin/builder/enable', { method: 'POST' });
    setEnabled(true);
  };

  return (
    <div className="min-h-screen bg-[#020410] p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-[#39FF14] mb-8 font-['Orbitron'] text-center">
          Kill Switch
        </h1>
        
        <div className="bg-[#0a1628]/60 backdrop-blur-xl border border-[#39FF14]/20 rounded-lg p-8 text-center">
          <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${enabled ? 'bg-[#39FF14]/20' : 'bg-red-500/20'}`}>
            <Power size={64} className={enabled ? 'text-[#39FF14]' : 'text-red-500'} />
          </div>
          
          <div className="text-2xl font-bold text-white mb-2">
            Builder Status: {enabled ? 'ENABLED' : 'DISABLED'}
          </div>
          
          <p className="text-gray-400 mb-8">
            {enabled 
              ? 'The autonomous builder is currently active and processing tasks.'
              : 'The builder has been shut down. No new tasks will be processed.'}
          </p>
          
          {enabled ? (
            showConfirm ? (
              <div>
                <div className="bg-red-500/20 border border-red-500 rounded p-4 mb-4">
                  <AlertTriangle className="text-red-500 mx-auto mb-2" size={32} />
                  <p className="text-white">Are you sure? This will immediately disable all autonomous operations.</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleKill}
                    className="flex-1 bg-red-500 text-white font-bold py-3 rounded"
                  >
                    Confirm Shutdown
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 bg-gray-600 text-white font-bold py-3 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full bg-red-500 text-white font-bold py-3 rounded hover:bg-red-600"
              >
                Emergency Shutdown
              </button>
            )
          ) : (
            <button
              onClick={handleEnable}
              className="w-full bg-[#39FF14] text-[#020410] font-bold py-3 rounded hover:bg-[#2dd60f]"
            >
              Re-enable Builder
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
