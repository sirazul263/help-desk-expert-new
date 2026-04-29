"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Paperclip,
  MessageSquare,
  X,
  Check,
  CheckCheck,
} from "lucide-react";
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

interface Conversation {
  id: string;
  email: string;
  name: string;
  status: string;
  updatedAt: string;
  messages: Message[];
  _count: { messages: number };
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<"open" | "closed">("open");
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

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    const res = await fetch(`/api/admin/chat?status=${filter}`);
    if (res.ok) {
      const data = await res.json();
      setConversations(data);
    }
  }, [filter]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Socket.IO: join admin room and listen for updates
  useEffect(() => {
    if (!socket) return;

    socket.emit("join-admin");

    const handleConversationUpdated = () => {
      fetchConversations();
    };

    const handleNewConversation = () => {
      fetchConversations();
    };

    socket.on("conversation-updated", handleConversationUpdated);
    socket.on("new-conversation", handleNewConversation);

    return () => {
      socket.off("conversation-updated", handleConversationUpdated);
      socket.off("new-conversation", handleNewConversation);
    };
  }, [socket, fetchConversations]);

  // Socket.IO: listen for messages in active conversation
  useEffect(() => {
    if (!socket || !activeConvo) return;

    socket.emit("join-conversation", activeConvo);

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
      // Mark as read
      fetch(`/api/chat/conversations/${activeConvo}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "admin" }),
      });
      socket.emit("messages-read", {
        conversationId: activeConvo,
        reader: "admin",
      });
    };

    const handleTyping = (data: { sender: string }) => {
      if (data.sender === "user") setIsTyping(true);
    };

    const handleStopTyping = (data: { sender: string }) => {
      if (data.sender === "user") setIsTyping(false);
    };

    const handleMessagesSeen = (data: { reader: string }) => {
      if (data.reader === "user") {
        setMessages((prev) =>
          prev.map((m) => (m.sender === "admin" ? { ...m, isRead: true } : m)),
        );
      }
    };

    socket.on("new-message", handleNewMessage);
    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);
    socket.on("messages-seen", handleMessagesSeen);

    return () => {
      socket.emit("leave-conversation", activeConvo);
      socket.off("new-message", handleNewMessage);
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
      socket.off("messages-seen", handleMessagesSeen);
    };
  }, [socket, activeConvo]);

  // Load messages when selecting a conversation
  const selectConversation = async (convoId: string) => {
    // Leave previous room
    if (activeConvo && socket) {
      socket.emit("leave-conversation", activeConvo);
    }
    setActiveConvo(convoId);
    const res = await fetch(`/api/chat/conversations/${convoId}/messages`);
    if (res.ok) {
      const msgs = await res.json();
      setMessages(msgs);
      // Mark as read
      fetch(`/api/chat/conversations/${convoId}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "admin" }),
      });
      if (socket) {
        socket.emit("messages-read", {
          conversationId: convoId,
          reader: "admin",
        });
      }
    }
  };

  // Send typing indicator via socket
  const sendTypingIndicator = () => {
    if (!activeConvo || !socket) return;
    socket.emit("typing", { conversationId: activeConvo, sender: "admin" });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", {
        conversationId: activeConvo,
        sender: "admin",
      });
    }, 2000);
  };

  // Send message
  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !activeConvo) return;

    const body = input.trim();
    setInput("");

    // Stop typing
    if (socket) {
      socket.emit("stop-typing", {
        conversationId: activeConvo,
        sender: "admin",
      });
    }

    const res = await fetch(`/api/chat/conversations/${activeConvo}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: "admin", body }),
    });

    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      if (socket) {
        socket.emit("send-message", {
          conversationId: activeConvo,
          message: msg,
        });
      }
    }
  };

  // Upload file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConvo) return;

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
        `/api/chat/conversations/${activeConvo}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: "admin",
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
          socket.emit("send-message", {
            conversationId: activeConvo,
            message: msg,
          });
        }
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Close/reopen conversation
  const toggleConvoStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "open" ? "closed" : "open";
    await fetch("/api/admin/chat", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchConversations();
    if (id === activeConvo && newStatus === "closed") {
      setActiveConvo(null);
      setMessages([]);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return formatTime(dateStr);
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const isImage = (type?: string | null) => type?.startsWith("image/");

  const activeConversation = conversations.find((c) => c.id === activeConvo);

  return (
    <div className="admin-chat-container">
      {/* Sidebar - conversation list */}
      <div className="admin-chat-sidebar">
        <div className="admin-chat-sidebar-header">
          <h3>Conversations</h3>
          <div className="admin-chat-filter">
            <button
              className={filter === "open" ? "active" : ""}
              onClick={() => setFilter("open")}
            >
              Open
            </button>
            <button
              className={filter === "closed" ? "active" : ""}
              onClick={() => setFilter("closed")}
            >
              Closed
            </button>
          </div>
        </div>
        <div className="admin-chat-list">
          {conversations.length === 0 && (
            <div className="admin-chat-empty">No {filter} conversations</div>
          )}
          {conversations.map((convo) => (
            <div
              key={convo.id}
              className={`admin-chat-item ${activeConvo === convo.id ? "active" : ""}`}
              onClick={() => selectConversation(convo.id)}
            >
              <div className="admin-chat-item-avatar">
                <MessageSquare size={16} />
              </div>
              <div className="admin-chat-item-info">
                <div className="admin-chat-item-name">
                  {convo.name || convo.email}
                </div>
                <div className="admin-chat-item-preview">
                  {convo.messages[0]?.body?.slice(0, 40) || "No messages"}
                </div>
              </div>
              <div className="admin-chat-item-meta">
                <span className="admin-chat-item-time">
                  {formatDate(convo.updatedAt)}
                </span>
                {convo._count.messages > 0 && (
                  <span className="admin-chat-item-badge">
                    {convo._count.messages}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="admin-chat-main">
        {!activeConvo ? (
          <div className="admin-chat-placeholder">
            <MessageSquare size={48} />
            <p>Select a conversation to start replying</p>
          </div>
        ) : (
          <>
            <div className="admin-chat-header">
              <div className="admin-chat-header-info">
                <h4>{activeConversation?.name || activeConversation?.email}</h4>
                <span>{activeConversation?.email}</span>
              </div>
              <div className="admin-chat-header-actions">
                <button
                  onClick={() =>
                    toggleConvoStatus(
                      activeConvo,
                      activeConversation?.status || "open",
                    )
                  }
                  className="admin-chat-close-btn"
                >
                  {activeConversation?.status === "open"
                    ? "Close Chat"
                    : "Reopen"}
                </button>
              </div>
            </div>

            <div className="admin-chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-msg ${msg.sender === "admin" ? "chat-msg-user" : "chat-msg-admin"}`}
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
                  {msg.adminName && (
                    <div className="chat-msg-author">
                      Replied by: {msg.adminName}
                    </div>
                  )}
                  <div className="chat-msg-meta">
                    <span>{formatTime(msg.createdAt)}</span>
                    {msg.sender === "admin" && (
                      <span className="chat-msg-status">
                        {msg.isRead ? (
                          <CheckCheck size={14} />
                        ) : (
                          <Check size={14} />
                        )}
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

            <form className="admin-chat-composer" onSubmit={sendMessage}>
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
                placeholder={uploading ? "Uploading..." : "Type a reply..."}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  sendTypingIndicator();
                }}
                disabled={uploading || activeConversation?.status === "closed"}
                className="chat-text-input"
              />
              <button
                type="submit"
                disabled={
                  !input.trim() ||
                  uploading ||
                  activeConversation?.status === "closed"
                }
                className="chat-send-btn"
              >
                <Send size={18} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
