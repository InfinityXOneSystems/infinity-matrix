
import React, { useState } from 'react';
import { Play, Mic, AlertCircle } from 'lucide-react';

export default function TaskInvoke() {
  const [goal, setGoal] = useState('');
  const [priority, setPriority] = useState('normal');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleInvoke = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/builder/invoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, priority, auto_approve: false })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020410] p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-[#39FF14] mb-8 font-['Orbitron']">
          Task Invocation
        </h1>
        
        <div className="bg-[#0a1628]/60 backdrop-blur-xl border border-[#39FF14]/20 rounded-lg p-6">
          <label className="block text-white mb-2">Goal</label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-[#020410] border border-[#39FF14]/30 rounded p-3 text-white"
            rows={4}
            placeholder="Describe what you want the builder to do..."
          />
          
          <label className="block text-white mt-4 mb-2">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full bg-[#020410] border border-[#39FF14]/30 rounded p-3 text-white"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          
          <button
            onClick={handleInvoke}
            disabled={loading || !goal}
            className="mt-6 w-full bg-[#39FF14] text-[#020410] font-bold py-3 rounded hover:bg-[#2dd60f] disabled:opacity-50"
          >
            {loading ? 'Invoking...' : 'Invoke Builder'}
          </button>
        </div>
        
        {result && (
          <div className="mt-6 bg-[#0a1628]/60 backdrop-blur-xl border border-[#0066FF]/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#0066FF] mb-4">Result</h2>
            <pre className="text-white text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
