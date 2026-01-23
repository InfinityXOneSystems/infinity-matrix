import React, { useState, useEffect, useRef } from 'react';
import { visionCortexService } from '../services/api';
import './VisionCortex.css';

interface Message {
  role: string;
  content: string;
  timestamp?: string;
}

const VisionCortex: React.FC = () => {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = async () => {
    try {
      setLoading(true);
      const response = await visionCortexService.createSession(undefined, 'client');
      setSessionToken(response.session_token);
      
      // Add welcome message
      setMessages([
        {
          role: 'assistant',
          content: `Welcome to Vision Cortex! 🔮

I'm your intelligent assistant for exploring business intelligence, competitive analysis, and strategic insights.

I can help you:
• Understand discovery findings and intelligence reports
• Explore opportunities and strategic recommendations
• Answer questions about market analysis and competitive landscape
• Provide insights on simulations and projections
• Discuss strategic options and next steps

How can I assist you today?`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError('Failed to initialize Vision Cortex session');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !sessionToken) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setError('');

    try {
      const response = await visionCortexService.sendMessage(sessionToken, inputMessage);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      console.error(err);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error processing your message. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "What opportunities have been identified?",
    "What are the key competitive advantages?",
    "Explain the investment simulations",
    "What are the main risks and challenges?",
    "What's the recommended timeline?",
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="vision-cortex">
      <div className="cortex-card">
        <div className="cortex-header">
          <h2>🔮 Vision Cortex</h2>
          <p className="cortex-subtitle">Interactive Intelligence Assistant</p>
        </div>

        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : '🔮'}
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message assistant-message">
              <div className="message-avatar">🔮</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="quick-prompts">
            <p className="quick-prompts-title">Try asking:</p>
            <div className="quick-prompts-grid">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="quick-prompt-button"
                  onClick={() => handleQuickPrompt(prompt)}
                  disabled={loading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={sendMessage} className="input-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about your business intelligence..."
              disabled={loading || !sessionToken}
              className="message-input"
            />
            <button
              type="submit"
              className="send-button"
              disabled={loading || !inputMessage.trim() || !sessionToken}
            >
              {loading ? '⏳' : '➤'}
            </button>
          </div>
        </form>
      </div>

      <div className="cortex-info-card">
        <h3>💡 About Vision Cortex</h3>
        <p>
          Vision Cortex is your AI-powered intelligence assistant that helps you explore 
          and understand complex business intelligence findings.
        </p>
        <ul>
          <li>Ask questions about discoveries and intelligence reports</li>
          <li>Get strategic insights and recommendations</li>
          <li>Explore opportunities and competitive positioning</li>
          <li>Understand simulations and projections</li>
          <li>Receive actionable guidance for decision-making</li>
        </ul>
      </div>
    </div>
  );
};

export default VisionCortex;
