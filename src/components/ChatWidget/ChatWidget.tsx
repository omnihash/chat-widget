import { MessageCircle, Minimize2, Send, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { defaultTheme } from "./themes";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatTheme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  userBubble: string;
  botBubble: string;
  gradient?: string;
  borderRadius?: number;
  fontFamily?: string;
}

interface ChatWidgetProps {
  theme?: Partial<ChatTheme>;
  title?: string;
  placeholder?: string;
  botName?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  messages: Message[];
  isOpen?: boolean;
  isMinimized?: boolean;
  unreadCount?: number;
  onSendMessage: (message: string) => void;
  onToggleOpen?: () => void;
  onMinimize?: () => void;
  onClose?: () => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  onRestore?: () => void;
  isTyping?: boolean;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  theme = {},
  title = "Chat Support",
  placeholder = "Type your message...",
  botName = "Bot",
  position = "bottom-right",
  messages = [],
  isOpen = false,
  isMinimized = false,
  unreadCount = 0,
  onSendMessage,
  onToggleOpen,
  onMinimize,
  onClose,
  onTypingStart,
  onTypingEnd,
  onRestore,
  isTyping = false,
}) => {
  const finalTheme = { ...defaultTheme, ...theme };

  const [inputValue, setInputValue] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    onSendMessage(inputValue);
    setInputValue("");

    // Notify parent that user started typing (for potential typing indicators)
    if (onTypingStart) {
      onTypingStart();
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    // Could add typing indicator logic here if needed
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleToggleOpen = () => {
    if (onToggleOpen) {
      onToggleOpen();
      // When reopening from a minimized state, we should also restore
      if (isMinimized && onRestore) {
        onRestore();
      }
    }
  };

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const getPositionStyles = () => {
    const base = { position: "fixed" as const, zIndex: 1000 };
    switch (position) {
      case "bottom-left":
        return { ...base, bottom: "20px", left: "20px" };
      case "top-right":
        return { ...base, top: "20px", right: "20px" };
      case "top-left":
        return { ...base, top: "20px", left: "20px" };
      default: // bottom-right
        return { ...base, bottom: "20px", right: "20px" };
    }
  };

  const getContainerPosition = () => {
    switch (position) {
      case "bottom-left":
        return { bottom: "80px", left: "0" };
      case "top-right":
        return { top: "80px", right: "0" };
      case "top-left":
        return { top: "80px", left: "0" };
      default: // bottom-right
        return { bottom: "80px", right: "0" };
    }
  };

  return (
    <>
      <style>{`
        .chat-widget {
          position: fixed;
          font-family: ${finalTheme.fontFamily};
        }

        .chat-toggle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${
            finalTheme.gradient ||
            `linear-gradient(135deg, ${finalTheme.primary} 0%, ${finalTheme.secondary} 100%)`
          };
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: scale(1);
          position: relative;
        }

        .unread-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          min-width: 24px;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
          animation: bounce 0.5s ease-out;
        }

        @keyframes bounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .chat-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
        }

        .chat-toggle:active {
          transform: scale(0.95);
        }

        .chat-container {
          position: absolute;
          width: 380px;
          height: 500px;
          background: ${finalTheme.surface};
          border-radius: ${finalTheme.borderRadius}px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .chat-container.minimized {
          height: 60px;
          animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .chat-container.minimized .chat-messages,
        .chat-container.minimized .chat-input {
          display: none;
        }

        .minimized-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 100%;
          cursor: pointer;
        }

        .minimized-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .minimized-unread {
          background: #ef4444;
          color: white;
          border-radius: 12px;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 600;
          min-width: 20px;
          text-align: center;
          animation: bounce 0.5s ease-out;
        }

        .minimized-title {
          font-size: 14px;
          font-weight: 500;
          color: white;
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideDown {
          to {
            height: 60px;
          }
        }

        .chat-header {
          background: ${
            finalTheme.gradient ||
            `linear-gradient(135deg, ${finalTheme.primary} 0%, ${finalTheme.secondary} 100%)`
          };
          color: white;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 28px;
        }

        .chat-title {
          font-weight: 600;
          font-size: 16px;
          margin: 0;
        }

        .chat-controls {
          display: flex;
          gap: 8px;
        }

        .control-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .control-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }

        .message {
          display: flex;
          flex-direction: column;
          max-width: 85%;
          animation: messageSlide 0.3s ease-out;
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          align-self: flex-end;
        }

        .message.bot {
          align-self: flex-start;
        }

        .message-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .message.user .message-bubble {
          background: ${finalTheme.userBubble};
          color: white;
          border-bottom-right-radius: 6px;
        }

        .message.bot .message-bubble {
          background: ${finalTheme.botBubble};
          color: ${finalTheme.text};
          border: 1px solid ${finalTheme.border};
          border-bottom-left-radius: 6px;
        }

        .message-time {
          font-size: 11px;
          color: ${finalTheme.textSecondary};
          margin-top: 4px;
          align-self: flex-end;
        }

        .message.bot .message-time {
          align-self: flex-start;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          border-bottom-left-radius: 6px;
          max-width: 85%;
          align-self: flex-start;
          animation: messageSlide 0.3s ease-out;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background-color: #94a3b8;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .chat-input {
          padding: 20px;
          background: ${finalTheme.surface};
          border-top: 1px solid ${finalTheme.border};
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .input-field {
          flex: 1;
          border: 1px solid ${finalTheme.border};
          border-radius: 24px;
          padding: 12px 16px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          background: ${finalTheme.background};
          color: ${finalTheme.text};
        }

        .input-field:focus {
          border-color: ${finalTheme.primary};
          background: ${finalTheme.surface};
        }

        .send-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: ${
            finalTheme.gradient ||
            `linear-gradient(135deg, ${finalTheme.primary} 0%, ${finalTheme.secondary} 100%)`
          };
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .send-btn:hover {
          transform: scale(1.05);
        }

        .send-btn:active {
          transform: scale(0.95);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 480px) {
          .chat-container {
            width: calc(100vw - 40px);
            height: calc(100vh - 100px);
            bottom: 80px;
            right: 20px;
          }
        }
      `}</style>

      <div className="chat-widget" style={getPositionStyles()}>
        <button
          className="chat-toggle"
          onClick={handleToggleOpen}
          style={{
            display: isOpen && !isMinimized ? "none" : "flex",
          }}
        >
          <MessageCircle size={24} />
          {unreadCount > 0 && (
            <div className="unread-badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </button>

        {isOpen && (
          <div
            className={`chat-container ${isMinimized ? "minimized" : ""}`}
            style={getContainerPosition()}
          >
            <div className="chat-header">
              {isMinimized ? (
                <div
                  className="minimized-content"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestore?.();
                  }}
                >
                  <div className="minimized-info">
                    <h3 className="minimized-title">{title}</h3>
                    {unreadCount > 0 && (
                      <div className="minimized-unread">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="chat-controls">
                    <button
                      className="control-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="chat-title">{title}</h3>
                  <div className="chat-controls">
                    <button className="control-btn" onClick={handleMinimize}>
                      <Minimize2 size={16} />
                    </button>
                    <button className="control-btn" onClick={handleClose}>
                      <X size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {!isMinimized && (
              <>
                <div className="chat-messages">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.sender}`}
                    >
                      <div className="message-bubble">{message.text}</div>
                      <div className="message-time">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="typing-indicator">
                      <div className="typing-dots">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                          color: finalTheme.textSecondary,
                        }}
                      >
                        {botName} is typing...
                      </span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input">
                  <input
                    ref={inputRef}
                    type="text"
                    className="input-field"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={inputValue.trim() === ""}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatWidget;
export type { ChatTheme, ChatWidgetProps, Message };
