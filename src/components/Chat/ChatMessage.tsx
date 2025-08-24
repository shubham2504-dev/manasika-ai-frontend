import React from 'react';
import { ChatMessage } from '../../types';

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatContent = (content: string) => {
    // Simple formatting for line breaks
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>

      <div className="message-bubble">
        <div className="message-content">
          {formatContent(message.content)}
        </div>

        <div className="message-meta">
          <span className="message-time">
            {formatTime(message.timestamp)}
          </span>
          {isAssistant && (
            <span className="message-source">
              Manasika AI
            </span>
          )}
        </div>
      </div>

      {/* Message Actions */}
      <div className="message-actions">
        <button
          className="message-action"
          onClick={() => navigator.clipboard?.writeText(message.content)}
          title="Copy message"
          aria-label="Copy message to clipboard"
        >
          📋
        </button>

        {isAssistant && (
          <button
            className="message-action"
            onClick={() => {
              // Could implement thumbs up/down feedback here
              console.log('Feedback for message:', message.id);
            }}
            title="This response was helpful"
            aria-label="Mark as helpful"
          >
            👍
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatMessageComponent;
