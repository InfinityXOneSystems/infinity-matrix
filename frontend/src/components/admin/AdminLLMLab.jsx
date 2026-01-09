
import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Sparkles, Activity, Clock, 
  Settings, Save, Trash2, Copy, FileText, 
  RefreshCw, BarChart2, DollarSign, Database,
  Terminal, Play, Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/lib/AdminProvider';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLLMLab = () => {
  const { llmHistory, llmTemplates, llmActions } = useAdmin();
  const { toast } = useToast();
  
  // -- State --
  const [activeTab, setActiveTab] = useState('playground'); // playground, batch, webhooks, analytics
  const [prompt, setPrompt] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are Infinity X, an advanced AI assistant.');
  const [model, setModel] = useState('gpt-4');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [output, setOutput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [metrics, setMetrics] = useState({ tokens: 0, cost: 0, latency: 0 });
  const [batchData, setBatchData] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('https://your-api.com/webhook');

  const models = [
    { id: 'gpt-4', name: 'GPT-4 Turbo', provider: 'OpenAI' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
    { id: 'gemini-pro', name: 'Gemini Pro 1.5', provider: 'Google' },
    { id: 'llama-3-70b', name: 'Llama 3 70B', provider: 'Meta' }
  ];

  // -- Streaming Simulation --
  const simulateStream = async (fullResponse) => {
    setOutput('');
    setIsStreaming(true);
    const startTime = Date.now();
    let currentText = '';
    const chunks = fullResponse.split(/(?=\s)/); // Split by words/spaces roughly
    
    for (let i = 0; i < chunks.length; i++) {
      await new Promise(r => setTimeout(r, Math.random() * 30 + 10)); // 10-40ms delay per chunk
      currentText += chunks[i];
      setOutput(currentText);
    }
    
    const endTime = Date.now();
    const completionTokens = Math.ceil(fullResponse.length / 4);
    const promptTokens = Math.ceil(prompt.length / 4);
    const cost = llmActions?.calculateCost ? llmActions.calculateCost(model, promptTokens, completionTokens) : 0.002;
    
    setMetrics({
      tokens: promptTokens + completionTokens,
      cost,
      latency: endTime - startTime
    });
    
    if (llmActions?.addToHistory) {
      llmActions.addToHistory({
        id: Date.now(),
        prompt,
        model,
        response: fullResponse,
        metrics: { cost, tokens: promptTokens + completionTokens, latency: endTime - startTime },
        timestamp: new Date().toISOString()
      });
    }
    
    setIsStreaming(false);
  };

  const handleRun = () => {
    if (!prompt.trim()) return;
    
    // Mock response generation based on prompt
    const mockResponses = [
      "Based on your request, I've analyzed the data structure. The market sentiment appears bullish with a 85% confidence interval.",
      "Here is the Python code you requested:\n\ndef optimize_neural_net(layers):\n    return [l * 0.5 for l in layers]",
      "I've successfully processed the batch request. 142 records were updated in the vector database.",
      "The quantum simulation results indicate a coherence time of 450 microseconds, which is a 15% improvement over the previous iteration."
    ];
    
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    simulateStream(randomResponse);
  };

  const handleSaveTemplate = () => {
    toast({
      title: "Template Saved",
      description: "Your prompt template has been saved to the library.",
    });
  };

  return (
    <div className="h-full flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-white/5">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <h2 className="font-semibold text-white">LLM Laboratory</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
            {['playground', 'batch', 'webhooks', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all",
                  activeTab === tab 
                    ? "bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Configuration */}
        <div className="w-80 border-r border-white/10 bg-black/20 flex flex-col overflow-y-auto p-4 gap-6">
          
          {/* Model Selection */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Model</label>
            <div className="grid gap-2">
              {models.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg border text-left transition-all",
                    model === m.id
                      ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-100"
                      : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10"
                  )}
                >
                  <span className="text-sm font-medium">{m.name}</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">{m.provider}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="space-y-4">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Parameters</label>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Temperature</span>
                <span className="text-cyan-400">{temperature}</span>
              </div>
              <input 
                type="range" 
                min="0" max="1" step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Max Tokens</span>
                <span className="text-cyan-400">{maxTokens}</span>
              </div>
              <input 
                type="range" 
                min="256" max="4096" step="256"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          {/* System Prompt */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">System Prompt</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full h-32 bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-gray-300 focus:outline-none focus:border-cyan-500/50 resize-none font-mono"
              placeholder="Define the AI persona..."
            />
          </div>

          <Button 
            variant="outline" 
            className="w-full border-white/10 hover:bg-white/5 text-gray-300"
            onClick={handleSaveTemplate}
          >
            <Save className="w-4 h-4 mr-2" />
            Save as Template
          </Button>

        </div>

        {/* Center - Playground */}
        <div className="flex-1 flex flex-col bg-black/40 relative">
          
          {/* Output Area */}
          <div className="flex-1 p-6 overflow-y-auto font-mono text-sm">
            {output ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-xs text-cyan-400 font-medium mb-1">Infinity X ({model})</div>
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {output}
                      {isStreaming && <span className="inline-block w-2 h-4 bg-cyan-500 ml-1 animate-pulse"/>}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                <Bot className="w-12 h-12 opacity-20" />
                <p>Enter a prompt to start experimenting</p>
              </div>
            )}
          </div>

          {/* Metrics Bar */}
          {output && (
            <div className="h-10 border-t border-white/10 bg-black/20 flex items-center px-6 gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-green-400" />
                <span>{metrics.tokens} tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-blue-400" />
                <span>{metrics.latency}ms</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-3 h-3 text-yellow-400" />
                <span>${metrics.cost.toFixed(5)}</span>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-white/5">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleRun();
                  }
                }}
                placeholder="Enter your prompt here... (Cmd+Enter to run)"
                className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-4 pr-24 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none font-mono"
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-cyan-600 hover:bg-cyan-500 text-white"
                  onClick={handleRun}
                  disabled={isStreaming || !prompt.trim()}
                >
                  {isStreaming ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Run
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLLMLab;
