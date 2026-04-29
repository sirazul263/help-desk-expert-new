"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, X, Send, Paperclip } from "lucide-react";
import { useSocket } from "@/lib/socket";

interface Message {
  id: string;
  sender: string;
  body: string;
  fileUrl?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  adminName?: string | null;
  isRead: boolean;
  createdAt: string;
}

interface ChatWidgetProps {
  userEmail?: string;
  userName?: string;
}

export default function ChatWidget({ userEmail, userName }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState(userEmail || "");
  const [name, setName] = useState(userName || "");
  const [hasStarted, setHasStarted] = useState(!!userEmail);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { socket, isConnected } = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket.IO event listeners
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("join-conversation", conversationId);

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
      // Auto mark as read if chat is open
      if (isOpen) {
        fetch(`/api/chat/conversations/${conversationId}/read`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: "user" }),
        });
        socket.emit("messages-read", { conversationId, reader: "user" });
      }
    };

    const handleTyping = (data: { sender: string }) => {
      if (data.sender === "admin") setIsTyping(true);
    };

    const handleStopTyping = (data: { sender: string }) => {
      if (data.sender === "admin") setIsTyping(false);
    };

    const handleMessagesSeen = (data: { reader: string }) => {
      if (data.reader === "admin") {
        setMessages((prev) =>
          prev.map((m) => (m.sender === "user" ? { ...m, isRead: true } : m)),
        );
      }
    };

    socket.on("new-message", handleNewMessage);
    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);
    socket.on("messages-seen", handleMessagesSeen);

    return () => {
      socket.emit("leave-conversation", conversationId);
      socket.off("new-message", handleNewMessage);
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
      socket.off("messages-seen", handleMessagesSeen);
    };
  }, [socket, conversationId, isOpen]);

  // Start or resume conversation
  const startConversation = useCallback(async () => {
    const res = await fetch("/api/chat/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    if (res.ok) {
      const convo = await res.json();
      setConversationId(convo.id);
      setMessages(convo.messages || []);
      setHasStarted(true);

      // Notify admins about new conversation
      if (socket && convo.messages?.length === 0) {
        socket.emit("new-conversation", {
          conversationId: convo.id,
          email,
          name,
        });
      }
    }
  }, [email, name, socket]);

  // Auto-start for logged-in users
  useEffect(() => {
    if (userEmail && isOpen && !conversationId) {
      startConversation();
    }
  }, [userEmail, isOpen, conversationId, startConversation]);

  // Send typing indicator via socket
  const sendTypingIndicator = () => {
    if (!conversationId || !socket) return;
    socket.emit("typing", { conversationId, sender: "user" });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { conversationId, sender: "user" });
    }, 2000);
  };

  // Send message
  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !conversationId) return;

    const body = input.trim();
    setInput("");

    // Stop typing
    if (socket) {
      socket.emit("stop-typing", { conversationId, sender: "user" });
    }

    const res = await fetch(
      `/api/chat/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", body }),
      },
    );

    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      // Emit via socket for real-time delivery
      if (socket) {
        socket.emit("send-message", { conversationId, message: msg });
      }
    }
  };

  // Upload file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversationId) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/chat/upload", {
      method: "POST",
      body: formData,
    });

    if (uploadRes.ok) {
      const { fileUrl, fileName, fileType } = await uploadRes.json();

      const res = await fetch(
        `/api/chat/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: "user",
            body: "",
            fileUrl,
            fileName,
            fileType,
          }),
        },
      );

      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        if (socket) {
          socket.emit("send-message", { conversationId, message: msg });
        }
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      startConversation();
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isImage = (type?: string | null) => type?.startsWith("image/");

  return (
    <>
      {/* Floating Button */}
      <button
        className="chat-widget-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-widget">
          <div className="chat-widget-header">
            <div className="chat-widget-header-info">
              <div className="chat-widget-avatar">
                <MessageSquare size={18} />
              </div>
              <div>
                <h4>HelpDesk Support</h4>
                <span className="chat-widget-status">
                  {isTyping
                    ? "Typing..."
                    : isConnected
                      ? "Online"
                      : "Connecting..."}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chat-widget-close"
            >
              <X size={18} />
            </button>
          </div>

          {!hasStarted ? (
            <form
              className="chat-widget-email-form"
              onSubmit={handleEmailSubmit}
            >
              <p>Please enter your details to start chatting:</p>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="chat-widget-input-field"
              />
              <input
                type="email"
                placeholder="Your email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="chat-widget-input-field"
              />
              <button type="submit" className="chat-widget-start-btn">
                Start Chat
              </button>
            </form>
          ) : (
            <>
              <div className="chat-widget-messages">
                {messages.length === 0 && (
                  <div className="chat-widget-empty">
                    <p>👋 Hi! How can we help you today?</p>
                  </div>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-msg ${msg.sender === "user" ? "chat-msg-user" : "chat-msg-admin"}`}
                  >
                    {msg.fileUrl && isImage(msg.fileType) && (
                      <img
                        src={msg.fileUrl}
                        alt={msg.fileName || "image"}
                        className="chat-msg-image"
                      />
                    )}
                    {msg.fileUrl && !isImage(msg.fileType) && (
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chat-msg-file"
                      >
                        <Paperclip size={14} />
                        {msg.fileName || "File"}
                      </a>
                    )}
                    {msg.body && <p>{msg.body}</p>}
                    <div className="chat-msg-meta">
                      <span>{formatTime(msg.createdAt)}</span>
                      {msg.sender === "user" && (
                        <span className="chat-msg-status">
                          {msg.isRead ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="chat-msg chat-msg-admin">
                    <div className="chat-typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-widget-composer" onSubmit={sendMessage}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="chat-file-input"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <button
                  type="button"
                  className="chat-attach-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  title="Attach file"
                >
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  placeholder={uploading ? "Uploading..." : "Type a message..."}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    sendTypingIndicator();
                  }}
                  disabled={uploading}
                  className="chat-text-input"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || uploading}
                  className="chat-send-btn"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
