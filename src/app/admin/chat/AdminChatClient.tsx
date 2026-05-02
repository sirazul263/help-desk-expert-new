"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Paperclip,
  MessageSquare,
  Check,
  CheckCheck,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { getPusher, usePusherConnection } from "@/lib/pusher-client";

interface Message {
  id: string;
  sender: string;
  body: string;
  fileUrl?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  adminName?: string | null;
  adminId?: string | null;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  email: string;
  name: string;
  status: string;
  updatedAt: string;
  userId: string | null;
  user?: { id: string } | null;
  messages: Message[];
  _count: { messages: number };
}

interface Props {
  currentAdminId: string | null;
}

function getInitials(name?: string | null, fallback?: string | null): string {
  const n = name || fallback || "?";
  const parts = n.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return n.substring(0, 2).toUpperCase();
}

export default function AdminChatClient({ currentAdminId }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"open" | "closed">("open");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnected = usePusherConnection();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  // Subscribe to admin channel for new/updated conversations
  useEffect(() => {
    const pusher = getPusher();
    const channel = pusher.subscribe("admin");
    channel.bind("conversation-updated", () => fetchConversations());
    channel.bind("new-conversation", () => fetchConversations());
    return () => {
      channel.unbind_all();
      pusher.unsubscribe("admin");
    };
  }, [fetchConversations]);

  // Subscribe to active conversation channel
  useEffect(() => {
    if (!activeConvo) return;
    const pusher = getPusher();
    const channel = pusher.subscribe(`chat-${activeConvo}`);

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
      fetch(`/api/chat/conversations/${activeConvo}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "admin" }),
      });
    };

    channel.bind("new-message", handleNewMessage);
    channel.bind("user-typing", (data: { sender: string }) => {
      if (data.sender === "user") setIsTyping(true);
    });
    channel.bind("user-stop-typing", (data: { sender: string }) => {
      if (data.sender === "user") setIsTyping(false);
    });
    channel.bind("messages-seen", (data: { reader: string }) => {
      if (data.reader === "user") {
        setMessages((prev) =>
          prev.map((m) => (m.sender === "admin" ? { ...m, isRead: true } : m)),
        );
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`chat-${activeConvo}`);
    };
  }, [activeConvo]);

  const selectConversation = async (convoId: string) => {
    setActiveConvo(convoId);
    setIsTyping(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/chat/conversations/${convoId}/messages`);
      if (res.ok) {
        const msgs = await res.json();
        setMessages(msgs);
        fetch(`/api/chat/conversations/${convoId}/read`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: "admin" }),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const sendTypingIndicator = () => {
    if (!activeConvo) return;
    fetch(`/api/chat/conversations/${activeConvo}/typing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: "admin", action: "typing" }),
    });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      fetch(`/api/chat/conversations/${activeConvo}/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "admin", action: "stop" }),
      });
    }, 2000);
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !activeConvo) return;
    const body = input.trim();
    setInput("");
    fetch(`/api/chat/conversations/${activeConvo}/typing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: "admin", action: "stop" }),
    });
    const res = await fetch(`/api/chat/conversations/${activeConvo}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: "admin", body }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
    }
  };

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
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return formatTime(dateStr);
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const isImage = (type?: string | null) => type?.startsWith("image/");

  const activeConversation = conversations.find((c) => c.id === activeConvo);

  // Classify a message relative to the current admin
  const msgKind = (msg: Message): "me" | "other-admin" | "user" => {
    if (msg.sender === "user") return "user";
    if (msg.adminId === currentAdminId) return "me";
    return "other-admin";
  };

  return (
    <div className="admin-chat-container">
      {/* Sidebar */}
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
            {filter !== "open" && (
              <button
                className="filter-clear-btn"
                onClick={() => setFilter("open")}
              >
                Clear
              </button>
            )}
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
              <div className="admin-chat-item-avatar achat-avatar achat-avatar-user">
                {getInitials(convo.name, convo.email)}
              </div>
              <div className="admin-chat-item-info">
                <div
                  className="admin-chat-item-name"
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  {convo.name || convo.email}
                  {(convo.userId || convo.user?.id) && (
                    <Link
                      href={`/admin/users/${convo.userId ?? convo.user?.id}`}
                      title="View profile"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        color: "var(--color-muted)",
                        display: "inline-flex",
                        flexShrink: 0,
                      }}
                      className="achat-profile-link"
                    >
                      <ExternalLink size={11} />
                    </Link>
                  )}
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <h4 style={{ margin: 0 }}>
                    {activeConversation?.name || activeConversation?.email}
                  </h4>
                  {(activeConversation?.userId ||
                    activeConversation?.user?.id) && (
                    <Link
                      href={`/admin/users/${activeConversation.userId ?? activeConversation.user?.id}`}
                      title="View user details"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        color: "var(--color-muted)",
                        transition: "color 0.15s",
                      }}
                      className="achat-profile-link"
                    >
                      <ExternalLink size={13} />
                    </Link>
                  )}
                </div>
                <span>
                  {activeConversation?.email}
                  {isConnected ? <span className="achat-online-dot" /> : null}
                </span>
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
              {loading ? (
                <div className="admin-chat-loading">Loading messages…</div>
              ) : (
                messages.map((msg) => {
                  const kind = msgKind(msg);
                  const outgoing = kind === "me";

                  const senderName =
                    kind === "user"
                      ? activeConversation?.name ||
                        activeConversation?.email ||
                        "User"
                      : msg.adminName || "Admin";

                  const avatarClass =
                    kind === "user"
                      ? "achat-avatar-user"
                      : kind === "me"
                        ? "achat-avatar-me"
                        : "achat-avatar-other-admin";

                  const bubbleClass =
                    kind === "user"
                      ? "achat-bubble-user"
                      : kind === "me"
                        ? "achat-bubble-me"
                        : "achat-bubble-other-admin";

                  const roleClass =
                    kind === "user"
                      ? "achat-role-user"
                      : kind === "me"
                        ? "achat-role-me"
                        : "achat-role-other-admin";

                  const roleName = kind === "user" ? "User" : "Admin";

                  return (
                    <div
                      key={msg.id}
                      className={`achat-row${outgoing ? " outgoing" : ""}`}
                    >
                      <div className={`achat-avatar ${avatarClass}`}>
                        {getInitials(senderName)}
                      </div>
                      <div className="achat-content">
                        <div
                          className={`achat-header${outgoing ? " outgoing" : ""}`}
                        >
                          <span className="achat-name">{senderName}</span>
                          <span className={`achat-role ${roleClass}`}>
                            {roleName}
                          </span>
                        </div>
                        <div className={`achat-bubble ${bubbleClass}`}>
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
                        </div>
                        <div
                          className={`achat-footer${outgoing ? " outgoing" : ""}`}
                        >
                          <span>{formatTime(msg.createdAt)}</span>
                          {outgoing && (
                            <span className="achat-read-icon">
                              {msg.isRead ? (
                                <CheckCheck size={12} />
                              ) : (
                                <Check size={12} />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {isTyping && (
                <div className="achat-row">
                  <div className="achat-avatar achat-avatar-user">
                    {getInitials(
                      activeConversation?.name,
                      activeConversation?.email,
                    )}
                  </div>
                  <div className="achat-content">
                    <div className="achat-bubble achat-bubble-user">
                      <div className="chat-typing-indicator">
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

            <form className="admin-chat-composer" onSubmit={sendMessage}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="chat-file-input"
                accept="image/*,.pdf,.doc,.docx,.txt"
                disabled={uploading || loading}
              />
              <button
                type="button"
                className="chat-attach-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || loading}
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
                disabled={
                  uploading ||
                  loading ||
                  activeConversation?.status === "closed"
                }
                className="chat-text-input"
              />
              <button
                type="submit"
                disabled={
                  !input.trim() ||
                  uploading ||
                  loading ||
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
