import { create } from 'zustand';
import type { ChatSession, ChatMessage } from '../types';

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  selectedModel: string;
  isProcessing: boolean;
  
  // Actions
  createSession: (title: string, model: string) => void;
  deleteSession: (sessionId: string) => void;
  setCurrentSession: (sessionId: string) => void;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  updateMessage: (sessionId: string, messageId: string, content: string) => void;
  setSelectedModel: (model: string) => void;
  setProcessing: (isProcessing: boolean) => void;
  clearAllSessions: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  sessions: [],
  currentSessionId: null,
  selectedModel: 'gpt-4',
  isProcessing: false,

  createSession: (title, model) => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title,
      messages: [],
      model,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      sessions: [...state.sessions, newSession],
      currentSessionId: newSession.id,
    }));
  },

  deleteSession: (sessionId) => {
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== sessionId),
      currentSessionId:
        state.currentSessionId === sessionId ? null : state.currentSessionId,
    }));
  },

  setCurrentSession: (sessionId) => {
    set({ currentSessionId: sessionId });
  },

  addMessage: (sessionId, message) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: [...session.messages, message],
              updatedAt: new Date().toISOString(),
            }
          : session
      ),
    }));
  },

  updateMessage: (sessionId, messageId, content) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: session.messages.map((msg) =>
                msg.id === messageId ? { ...msg, content } : msg
              ),
              updatedAt: new Date().toISOString(),
            }
          : session
      ),
    }));
  },

  setSelectedModel: (model) => {
    set({ selectedModel: model });
  },

  setProcessing: (isProcessing) => {
    set({ isProcessing });
  },

  clearAllSessions: () => {
    set({ sessions: [], currentSessionId: null });
  },
}));
