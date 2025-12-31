import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChatStore } from '../store/chatStore';

describe('ChatStore', () => {
  beforeEach(() => {
    // Clear store before each test
    useChatStore.setState({
      sessions: [],
      currentSessionId: null,
      selectedModel: 'gpt-4',
      isProcessing: false,
    });
  });

  it('creates a new session', () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.createSession('Test Chat', 'gpt-4');
    });

    expect(result.current.sessions).toHaveLength(1);
    expect(result.current.sessions[0].title).toBe('Test Chat');
    expect(result.current.sessions[0].model).toBe('gpt-4');
  });

  it('sets current session', () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.createSession('Test Chat', 'gpt-4');
    });

    const sessionId = result.current.sessions[0].id;

    act(() => {
      result.current.setCurrentSession(sessionId);
    });

    expect(result.current.currentSessionId).toBe(sessionId);
  });

  it('adds messages to session', () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.createSession('Test Chat', 'gpt-4');
    });

    const sessionId = result.current.sessions[0].id;
    const message = {
      id: 'msg-1',
      role: 'user' as const,
      content: 'Hello',
      timestamp: new Date().toISOString(),
    };

    act(() => {
      result.current.addMessage(sessionId, message);
    });

    expect(result.current.sessions[0].messages).toHaveLength(1);
    expect(result.current.sessions[0].messages[0].content).toBe('Hello');
  });

  it('deletes a session', () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.createSession('Test Chat', 'gpt-4');
    });

    const sessionId = result.current.sessions[0].id;

    act(() => {
      result.current.deleteSession(sessionId);
    });

    expect(result.current.sessions).toHaveLength(0);
  });

  it('changes selected model', () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.setSelectedModel('claude-3-opus-20240229');
    });

    expect(result.current.selectedModel).toBe('claude-3-opus-20240229');
  });
});
