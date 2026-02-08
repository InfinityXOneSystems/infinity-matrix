import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Bot, User, Play, Save, FolderOpen, File, Sparkles,
  Terminal, Settings, ChevronRight, ChevronLeft, Code2,
  FileText, PanelLeftClose, PanelRightClose, Zap, Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import MonacoIDEService from '@/services/monacoIDEService';

const MonacoIDEPage = () => {
  // Editor state
  const [code, setCode] = useState(`// Welcome to Infinity Matrix Monaco IDE
// AI-powered code editor with autonomous orchestration

function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
`);
  const [language, setLanguage] = useState('javascript');
  const [fileName, setFileName] = useState('main.js');
  const [theme, setTheme] = useState('vs-dark');

  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'system',
      content: 'Welcome to the Infinity Matrix Monaco IDE. I can help you write, edit, and debug code autonomously. Ask me to make changes, and I\'ll apply them directly to your code.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // UI state
  const [chatPanelOpen, setChatPanelOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState(['> Ready']);

  const editorRef = useRef(null);
  const chatScrollRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure Monaco theme for v0 dev style
    monaco.editor.defineTheme('infinity-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
      ],
      colors: {
        'editor.background': '#000000',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#1a1a1a',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorCursor.foreground': '#39FF14',
        'editor.findMatchBackground': '#515C6A',
        'editor.findMatchHighlightBackground': '#EA5C0055',
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
        'editorWhitespace.foreground': '#404040',
      }
    });

    monaco.editor.setTheme('infinity-dark');
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const userInput = input;
    setInput('');
    setIsProcessing(true);

    try {
      // Call real API
      const response = await MonacoIDEService.sendChatMessage(
        userInput,
        code,
        language
      );

      let aiResponse = response.message;
      let codeUpdate = response.code_edit;

      // Apply code changes if provided
      if (codeUpdate) {
        setCode(codeUpdate);
        toast({ description: "Code updated by AI", duration: 2000 });
      }

      // Handle different action types
      if (response.action === 'run') {
        setTerminalOpen(true);
        setTerminalOutput(prev => [...prev, '> Executing code...', '(Connected to orchestration engine)', '> Process initiated']);
      }

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // If it's an edit action, also call orchestration
      if (response.action === 'edit' && userInput) {
        try {
          const orchestrationResponse = await MonacoIDEService.orchestrateTask(
            userInput,
            { fileName, language, codeLength: code.length }
          );
          
          const orchestrationMsg = {
            id: Date.now() + 2,
            role: 'system',
            content: `🤖 Orchestration task created: ${orchestrationResponse.task_id}\nAssigned to: ${orchestrationResponse.assigned_agent}\nStatus: ${orchestrationResponse.status}`
          };
          setMessages(prev => [...prev, orchestrationMsg]);
        } catch (error) {
          console.error('Orchestration error:', error);
        }
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Using fallback mode. Try: "add a function", "comment code", "refactor", or "run code".'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunCode = () => {
    setTerminalOpen(true);
    setTerminalOutput(prev => [...prev, `> Running ${fileName}...`, '(Output would appear here)', '> Process completed']);
    toast({ description: "Code execution started" });
  };

  const handleSaveFile = () => {
    // In a real implementation, this would save to backend
    toast({ description: `Saved ${fileName}`, duration: 2000 });
  };

  return (
    <>
      <Helmet>
        <title>Monaco IDE | Infinity Matrix</title>
      </Helmet>

      <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
        {/* Top Toolbar */}
        <div className="h-12 bg-[#1e1e1e] border-b border-[#2d2d2d] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="text-[#39FF14]" size={20} />
              <span className="text-sm font-semibold">Infinity Matrix IDE</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/60">
              <ChevronRight size={14} />
              <span>{fileName}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-2 text-white/70 hover:text-white hover:bg-white/10"
              onClick={handleSaveFile}
            >
              <Save size={14} />
              <span className="text-xs">Save</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-2 text-white/70 hover:text-white hover:bg-white/10"
              onClick={handleRunCode}
            >
              <Play size={14} />
              <span className="text-xs">Run</span>
            </Button>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-2 text-white/70 hover:text-white hover:bg-white/10"
            >
              <Settings size={14} />
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Panel */}
          <div className={cn(
            "flex flex-col transition-all duration-300",
            chatPanelOpen ? "flex-[1.2]" : "flex-1"
          )}>
            <div className="h-10 bg-[#1e1e1e] border-b border-[#2d2d2d] flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-2">
                <File size={14} className="text-[#39FF14]" />
                <span className="text-xs text-white/80">{fileName}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-white/60 hover:text-white"
                onClick={() => setChatPanelOpen(!chatPanelOpen)}
              >
                {chatPanelOpen ? <PanelRightClose size={14} /> : <PanelLeftClose size={14} />}
              </Button>
            </div>
            
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                theme="infinity-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "'Fira Code', 'Monaco', 'Menlo', monospace",
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  lineNumbers: 'on',
                  renderWhitespace: 'selection',
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: true,
                  smoothScrolling: true,
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>
          </div>

          {/* Chat Panel */}
          <AnimatePresence>
            {chatPanelOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '400px', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#1e1e1e] border-l border-[#2d2d2d] flex flex-col overflow-hidden"
              >
                {/* Chat Header */}
                <div className="h-10 bg-[#252526] border-b border-[#2d2d2d] flex items-center justify-between px-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                    <span className="text-xs font-semibold text-white/90">AI Assistant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Cpu size={14} className="text-[#39FF14]" />
                    <span className="text-[10px] text-white/50">Orchestrator Active</span>
                  </div>
                </div>

                {/* Chat Messages */}
                <div
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#39FF14 #1e1e1e' }}
                >
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-2",
                        msg.role === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.role !== 'user' && (
                        <div className="w-6 h-6 rounded-md bg-[#39FF14]/10 border border-[#39FF14]/30 flex items-center justify-center shrink-0">
                          <Bot size={12} className="text-[#39FF14]" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "max-w-[80%] p-3 rounded-lg text-xs leading-relaxed",
                          msg.role === 'user'
                            ? "bg-[#0066FF] text-white"
                            : msg.role === 'system'
                            ? "bg-[#2d2d2d] text-white/70 border border-white/10"
                            : "bg-[#2d2d2d] text-white/90"
                        )}
                      >
                        {msg.content}
                      </div>

                      {msg.role === 'user' && (
                        <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                          <User size={12} className="text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2"
                    >
                      <div className="w-6 h-6 rounded-md bg-[#39FF14]/10 border border-[#39FF14]/30 flex items-center justify-center shrink-0">
                        <Bot size={12} className="text-[#39FF14] animate-pulse" />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/40 mt-1">
                        Processing<span className="animate-pulse">...</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-3 bg-[#252526] border-t border-[#2d2d2d] shrink-0">
                  <div className="relative bg-[#3c3c3c] rounded-lg border border-[#2d2d2d] focus-within:border-[#39FF14] transition-colors">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Ask AI to edit code..."
                      rows={2}
                      className="w-full bg-transparent border-none focus:ring-0 text-white text-xs placeholder:text-white/40 resize-none py-2 pl-3 pr-10 custom-scrollbar"
                      style={{ scrollbarWidth: 'thin' }}
                    />
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!input.trim()}
                      className="absolute bottom-1.5 right-1.5 h-7 w-7 bg-[#39FF14] text-black hover:bg-[#32cc12] disabled:bg-white/10 disabled:text-white/20"
                    >
                      <Send size={12} />
                    </Button>
                  </div>
                  <div className="text-[9px] text-white/30 mt-1 px-1">
                    AI can modify your code directly • Powered by orchestration engine
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Terminal Panel */}
        <AnimatePresence>
          {terminalOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '200px', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1e1e1e] border-t border-[#2d2d2d] flex flex-col overflow-hidden"
            >
              <div className="h-10 bg-[#252526] border-b border-[#2d2d2d] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-[#39FF14]" />
                  <span className="text-xs font-semibold text-white/90">Terminal</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-white/60 hover:text-white"
                  onClick={() => setTerminalOpen(false)}
                >
                  <ChevronLeft size={14} />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-[#39FF14] custom-scrollbar">
                {terminalOutput.map((line, idx) => (
                  <div key={idx} className="mb-1">
                    {line}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e1e1e;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #39FF14;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #32cc12;
        }
      `}</style>
    </>
  );
};

export default MonacoIDEPage;
