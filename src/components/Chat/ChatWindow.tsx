import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../../types';
import { useNotification } from '../../contexts/NotificationContext';
import aiService from '../../services/aiService';
import ChatInput from './ChatInput';
import ChatMessageComponent from './ChatMessage';
import Button from '../Common/Button';
import Loading from '../Common/Loading';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useNotification();

  // Welcome message
  const welcomeMessage: ChatMessage = {
    id: 'welcome',
    content: "Hello! I'm Manasika, your AI wellness companion. I'm here to provide support, encouragement, and evidence-based coping strategies for your mental health journey. How are you feeling today?",
    role: 'assistant',
    timestamp: new Date()
  };

  // Initialize with welcome message
  useEffect(() => {
    // Load saved conversations from localStorage
    const savedMessages = localStorage.getItem('manasikaConversations');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages([welcomeMessage, ...messagesWithDates]);
      } catch (error) {
        console.error('Error loading chat history:', error);
        setMessages([welcomeMessage]);
      }
    } else {
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 1) { // Don't save just the welcome message
      const messagesToSave = messages.filter(msg => msg.id !== 'welcome');
      localStorage.setItem('manasikaConversations', JSON.stringify(messagesToSave));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await aiService.sendMessage(content);

      // Simulate typing delay for more natural feel
      setTimeout(() => {
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000 + Math.random() * 1000);

    } catch (error) {
      console.error('Error getting AI response:', error);

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "I'm having some technical difficulties right now, but I want you to know that I'm here to support you. Sometimes talking about what's on your mind can be helpful even when technology isn't cooperating perfectly. What would you like to share?",
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      setIsLoading(false);

      addNotification({
        type: 'warning',
        message: 'Connection issue - using offline responses'
      });
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history? This action cannot be undone.')) {
      setMessages([welcomeMessage]);
      localStorage.removeItem('manasikaConversations');
      aiService.clearHistory();

      addNotification({
        type: 'info',
        message: 'Chat history cleared successfully'
      });
    }
  };

  const getSuggestions = () => {
    const suggestions = [
      "I'm feeling anxious about work",
      "I had a really good day today",
      "I'm struggling with motivation",
      "I feel overwhelmed lately",
      "Can you help me with coping strategies?",
      "I'm grateful for something today"
    ];

    // Show different suggestions based on recent messages
    const recentUserMessages = messages
      .filter(msg => msg.role === 'user')
      .slice(-3);

    if (recentUserMessages.length === 0) {
      return suggestions.slice(0, 3);
    }

    // Return random suggestions
    return suggestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-title">
          <h1>🤖 AI Wellness Coach</h1>
          <p>Your compassionate mental health companion</p>
        </div>
        <div className="chat-actions">
          <Button 
            variant="outline" 
            size="small"
            onClick={handleClearChat}
          >
            🗑️ Clear Chat
          </Button>
        </div>
      </div>

      <div className="chat-disclaimer">
        <p>
          <strong>🔒 Privacy Note:</strong> This AI companion provides supportive conversation 
          and coping strategies. It's not a replacement for professional mental health care. 
          Your conversations are stored locally on your device for privacy.
        </p>
      </div>

      <div className="chat-messages-container">
        <div className="chat-messages">
          {messages.map((message) => (
            <ChatMessageComponent
              key={message.id}
              message={message}
            />
          ))}

          {isTyping && (
            <div className="typing-indicator">
              <div className="message ai-message">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        suggestions={getSuggestions()}
      />

      {messages.length <= 1 && (
        <div className="chat-suggestions-panel">
          <h4>💭 Try asking about:</h4>
          <div className="suggestion-topics">
            <span>Managing anxiety</span>
            <span>Improving mood</span>
            <span>Stress relief techniques</span>
            <span>Building resilience</span>
            <span>Sleep and mental health</span>
            <span>Gratitude practices</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
