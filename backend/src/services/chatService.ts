import type { ChatSession, ChatMessage } from '../types';

class ChatStore {
  private sessions: Map<string, ChatSession> = new Map();
  private messages: Map<string, ChatMessage[]> = new Map();
  private nextSessionId = 1;
  private nextMessageId = 1;

  createSession(title: string, model: string, userId?: string): ChatSession {
    const session: ChatSession = {
      id: `session-${this.nextSessionId++}`,
      userId,
      title,
      model,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessions.set(session.id, session);
    this.messages.set(session.id, []);
    return session;
  }

  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(userId?: string): ChatSession[] {
    const sessions = Array.from(this.sessions.values());
    if (userId) {
      return sessions.filter((s) => s.userId === userId);
    }
    return sessions;
  }

  addMessage(sessionId: string, role: 'user' | 'assistant' | 'system', content: string, model?: string): ChatMessage {
    const message: ChatMessage = {
      id: `msg-${this.nextMessageId++}`,
      sessionId,
      role,
      content,
      timestamp: new Date(),
      model,
    };

    const messages = this.messages.get(sessionId) || [];
    messages.push(message);
    this.messages.set(sessionId, messages);

    // Update session timestamp
    const session = this.sessions.get(sessionId);
    if (session) {
      session.updatedAt = new Date();
    }

    return message;
  }

  getMessages(sessionId: string): ChatMessage[] {
    return this.messages.get(sessionId) || [];
  }

  deleteSession(sessionId: string): boolean {
    this.messages.delete(sessionId);
    return this.sessions.delete(sessionId);
  }
}

export const chatStore = new ChatStore();
