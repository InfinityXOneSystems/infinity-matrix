import { useEffect } from 'react';
import { ChatSidebar } from '../components/ai-chat/ChatSidebar';
import { ChatInterface } from '../components/ai-chat/ChatInterface';
import { ModelSelector } from '../components/ai-chat/ModelSelector';
import { useChatStore } from '../store/chatStore';

export function ChatPage() {
  const { sessions, createSession, selectedModel } = useChatStore();

  useEffect(() => {
    // Create initial session if none exists
    if (sessions.length === 0) {
      createSession('New Chat', selectedModel);
    }
  }, []);

  return (
    <div className="flex h-full -m-6">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Vision Cortex AI</h1>
            <ModelSelector />
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
