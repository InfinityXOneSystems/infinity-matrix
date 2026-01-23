
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import VisionSidebar from '@/components/vision/VisionSidebar';
import VisionChatInterface from '@/components/vision/VisionChatInterface';
import { useToast } from '@/components/ui/use-toast';
import BackgroundEnergy from '@/components/BackgroundEnergy';
import TriangleLogo from '@/components/ui/TriangleLogo';
import { Home } from 'lucide-react';

const VisionCortexPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSystem, setActiveSystem] = useState('prediction');
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-collapse sidebar on mobile, keep open on desktop
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    
    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    // Mock AI Response
    setTimeout(() => {
      let response = "I've processed your request. ";
      
      if (activeSystem === 'prediction') {
        response += "Based on current market volatility indicators, I project a 14% upside in the tech sector over the next 48 hours. Confidence: 89%.";
      } else if (activeSystem === 'simulation') {
        response += "Running Monte Carlo simulation (n=10,000)... Result: 94% probability of success for the outlined strategy.";
      } else {
        response += "I've analyzed the problem constraints. The optimal solution path involves restructuring the data pipeline to reduce latency by 40%.";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: response
      }]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleNewChat = () => {
    setMessages([]);
    toast({
      description: "Started a new session context.",
      className: "bg-[#39FF14] text-black border-none font-bold"
    });
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Vision Cortex | Infinity X</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Helmet>

      {/* Global Background (Re-added since we removed Layout) */}
      <div className="fixed inset-0 z-0 bg-[#02040a]">
         <BackgroundEnergy />
      </div>

      {/* 
        Full Screen Container
        - h-[100dvh] ensures it takes full dynamic viewport height on mobile browsers (addressing address bar issues)
        - No padding, no margin
      */}
      <div className="relative z-10 w-full h-[100dvh] flex flex-col overflow-hidden">
         {/* Main Workspace Area */}
         <div className="flex-1 flex overflow-hidden relative w-full">
            
            <VisionSidebar 
              isOpen={sidebarOpen} 
              setIsOpen={setSidebarOpen}
              activeSystem={activeSystem}
              setActiveSystem={setActiveSystem}
              onNewChat={handleNewChat}
              isMobile={isMobile}
            />
            
            {/* Chat Container - Flex Grow to take remaining space */}
            <div className="flex-1 min-w-0 relative z-10 flex flex-col h-full bg-transparent">
               <VisionChatInterface 
                  messages={messages}
                  isProcessing={isProcessing}
                  onSendMessage={handleSendMessage}
                  input={input}
                  setInput={setInput}
                  activeSystem={activeSystem}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
               />
            </div>
         </div>
      </div>
    </>
  );
};

export default VisionCortexPage;
