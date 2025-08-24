import React, { useState, useRef } from 'react';
import Button from '../Common/Button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  suggestions?: string[];
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false, 
  suggestions = [] 
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    // Auto-focus textarea
    textareaRef.current?.focus();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="chat-input-container">
      {/* Suggestions */}
      {suggestions.length > 0 && message === '' && (
        <div className="chat-suggestions">
          <div className="suggestions-header">💡 Quick starters:</div>
          <div className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-btn"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={disabled}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-group">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "AI is typing..." : "Share what's on your mind..."}
            className="chat-textarea"
            disabled={disabled}
            rows={1}
            maxLength={1000}
          />

          <Button
            type="submit"
            variant="primary"
            disabled={disabled || !message.trim()}
            className="send-button"
            aria-label="Send message"
          >
            {disabled ? '⏳' : '📤'}
          </Button>
        </div>

        <div className="input-footer">
          <span className="char-counter">
            {message.length}/1000
          </span>
          <span className="input-hint">
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
