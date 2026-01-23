
import { Plus, Trash2 } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export function ChatSidebar() {
  const { sessions, currentSessionId, createSession, deleteSession, setCurrentSession, selectedModel } =
    useChatStore();

  const handleNewChat = () => {
    createSession(`Chat ${sessions.length + 1}`, selectedModel);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(sessionId);
  };

  return (
    <div className="w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="p-4">
        <Button onClick={handleNewChat} className="w-full" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="px-2 pb-4">
        <h3 className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase">
          Chat Sessions
        </h3>
        <div className="space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setCurrentSession(session.id)}
              className={cn(
                'group flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors',
                currentSessionId === session.id
                  ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              )}
            >
              <span className="truncate flex-1">{session.title}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={(e) => handleDeleteSession(session.id, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-gray-500">
              No chat sessions yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
