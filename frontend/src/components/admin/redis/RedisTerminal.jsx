
import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/lib/AdminProvider';

const RedisTerminal = () => {
  const { redis, redisActions } = useAdmin();
  const [history, setHistory] = useState([
     { type: 'info', text: 'Redis Console v7.0.0' },
     { type: 'info', text: 'Connected to 127.0.0.1:6379' },
     { type: 'success', text: 'Ready to accept commands' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = () => {
     if (!input.trim()) return;
     
     const cmd = input.trim();
     setHistory(prev => [...prev, { type: 'command', text: `> ${cmd}` }]);
     
     const parts = cmd.split(' ');
     const op = parts[0].toUpperCase();
     const args = parts.slice(1);

     // Simple Mock Interpreter
     setTimeout(() => {
        let response = { type: 'result', text: '(nil)' };
        
        try {
           if (op === 'PING') response.text = 'PONG';
           else if (op === 'SET') {
              if (args.length < 2) throw new Error("ERR wrong number of arguments for 'set' command");
              redisActions.setKey(args[0], args.slice(1).join(' '));
              response.text = 'OK';
           } 
           else if (op === 'GET') {
              const key = redis.keys.find(k => k.key === args[0]);
              response.text = key ? `"${key.value}"` : '(nil)';
           }
           else if (op === 'DEL') {
              redisActions.deleteKey(args[0]);
              response.text = '(integer) 1';
           }
           else if (op === 'KEYS') {
              response.text = redis.keys.map(k => k.key).join('\n');
           }
           else if (op === 'FLUSHDB') {
              redisActions.flushDb();
              response.text = 'OK';
           }
           else {
              throw new Error(`ERR unknown command '${op}'`);
           }
        } catch (e) {
           response = { type: 'error', text: e.message };
        }

        setHistory(prev => [...prev, response]);
     }, 100);

     setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] rounded-xl border border-white/10 overflow-hidden font-mono">
       <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-white/5">
          <div className="flex items-center gap-2 text-white text-xs uppercase font-bold">
             <Terminal size={14} className="text-green-400" /> Redis CLI
          </div>
          <Button onClick={() => setHistory([])} variant="ghost" size="sm" className="h-6 text-xs text-gray-500 hover:text-white">Clear</Button>
       </div>
       
       <div className="flex-1 p-4 overflow-y-auto space-y-1">
          {history.map((line, i) => (
             <div key={i} className={`text-sm break-all ${
                line.type === 'command' ? 'text-white font-bold mt-3' :
                line.type === 'error' ? 'text-red-400' :
                line.type === 'success' ? 'text-green-400' :
                'text-white/70'
             }`}>
                {line.text}
             </div>
          ))}
          <div ref={bottomRef} />
       </div>

       <div className="p-3 border-t border-white/10 bg-[#1e1e1e]">
          <div className="flex gap-2">
             <span className="text-green-400 font-bold select-none">{`127.0.0.1:6379>`}</span>
             <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                className="flex-1 bg-transparent border-none outline-none text-white text-sm"
                autoFocus
             />
          </div>
       </div>
    </div>
  );
};

export default RedisTerminal;
