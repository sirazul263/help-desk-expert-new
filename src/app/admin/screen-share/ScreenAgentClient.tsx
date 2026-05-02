"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

type Status = "idle" | "capturing" | "connecting" | "live" | "ended";

interface ChatMsg {
  id: string;
  role: "agent" | "client";
  name: string;
  text: string;
  createdAt: string;
}

interface Props {
  agentName: string;
  agentId: string;
}

export default function ScreenAgentClient({
  agentName,
  agentId: _agentId,
}: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [clientUrl, setClientUrl] = useState("");
  const [copyText, setCopyText] = useState("Copy");
  const [duration, setDuration] = useState("00:00");
  const [iceState, setIceState] = useState("—");
  const [viewerConnected, setViewerConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answerPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const icePollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const esRef = useRef<EventSource | null>(null);
  const sidRef = useRef<string | null>(null);
  const addedCandidatesRef = useRef<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const cleanup = useCallback((sid?: string | null) => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (answerPollRef.current) {
      clearInterval(answerPollRef.current);
      answerPollRef.current = null;
    }
    if (icePollRef.current) {
      clearInterval(icePollRef.current);
      icePollRef.current = null;
    }
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    addedCandidatesRef.current.clear();

    const target = sid ?? sidRef.current;
    if (target) {
      fetch(`/api/screen-share/sessions/${target}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ended" }),
      }).catch(() => {});
    }
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const startShare = async () => {
    setStatus("capturing");
    let mediaStream: MediaStream;
    try {
      mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: { ideal: 30 },
          cursor: "always",
        } as MediaTrackConstraints,
        audio: false,
      });
    } catch {
      setStatus("idle");
      return;
    }

    streamRef.current = mediaStream;
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.style.display = "block";
    }

    setStatus("connecting");

    // Create session in DB
    const res = await fetch("/api/screen-share/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      setStatus("idle");
      return;
    }
    const { id: sid } = (await res.json()) as { id: string };
    sidRef.current = sid;
    setSessionId(sid);
    setClientUrl(
      `${window.location.origin}/dashboard/screen-share?session=${sid}`,
    );

    // Create WebRTC peer connection
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    mediaStream.getTracks().forEach((track) => pc.addTrack(track, mediaStream));

    // Send our ICE candidates to the DB as they arrive
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        fetch(`/api/screen-share/sessions/${sid}/ice`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "agent",
            candidate: JSON.stringify(candidate),
          }),
        }).catch(() => {});
      }
    };

    pc.onconnectionstatechange = () => {
      setIceState(pc.connectionState);
      if (pc.connectionState === "connected") {
        setStatus("live");
        setViewerConnected(true);
        startTimer();
        subscribeSSE(sid);
      }
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        setStatus("ended");
        setViewerConnected(false);
      }
    };

    // Handle stream track ending (user stops share via browser UI)
    mediaStream
      .getVideoTracks()[0]
      .addEventListener("ended", () => stopShare());

    // Create & send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await fetch(`/api/screen-share/sessions/${sid}/signal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "offer", sdp: offer.sdp }),
    });

    // Poll for the client's answer
    answerPollRef.current = setInterval(async () => {
      try {
        const r = await fetch(`/api/screen-share/sessions/${sid}/signal`);
        const data = (await r.json()) as { answer?: string };
        if (data.answer && pc.signalingState === "have-local-offer") {
          clearInterval(answerPollRef.current!);
          answerPollRef.current = null;
          await pc.setRemoteDescription({ type: "answer", sdp: data.answer });
          startPollingClientICE(pc, sid);
        }
      } catch {}
    }, 600);
  };

  const startPollingClientICE = (pc: RTCPeerConnection, sid: string) => {
    icePollRef.current = setInterval(async () => {
      try {
        const r = await fetch(
          `/api/screen-share/sessions/${sid}/ice?role=client`,
        );
        const { candidates } = (await r.json()) as {
          candidates: { id: string; candidate: string }[];
        };
        for (const c of candidates) {
          if (!addedCandidatesRef.current.has(c.id)) {
            addedCandidatesRef.current.add(c.id);
            const parsed = JSON.parse(c.candidate) as RTCIceCandidateInit;
            await pc
              .addIceCandidate(new RTCIceCandidate(parsed))
              .catch(() => {});
          }
        }
        // Stop polling once connection is fully established
        if (
          pc.iceConnectionState === "connected" ||
          pc.iceConnectionState === "completed"
        ) {
          clearInterval(icePollRef.current!);
          icePollRef.current = null;
        }
      } catch {}
    }, 600);
  };

  const startTimer = () => {
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const s = Math.floor((Date.now() - startTime) / 1000);
      setDuration(
        `${Math.floor(s / 60)
          .toString()
          .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`,
      );
    }, 1000);
  };

  const subscribeSSE = (sid: string) => {
    const es = new EventSource(`/api/screen-share/sessions/${sid}/events`);
    esRef.current = es;
    es.addEventListener("chat", (e) => {
      const msg = JSON.parse(e.data) as ChatMsg;
      setMessages((prev) => [...prev, msg]);
      setChatOpen(true);
    });
    es.addEventListener("ended", () => {
      setStatus("ended");
      es.close();
    });
  };

  const stopShare = useCallback(() => {
    cleanup();
    if (videoRef.current) videoRef.current.style.display = "none";
    setStatus("ended");
    setViewerConnected(false);
    setDuration("00:00");
    setIceState("—");
  }, [cleanup]);

  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || !sidRef.current) return;
    setChatInput("");
    const msg = (await fetch(
      `/api/screen-share/sessions/${sidRef.current}/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "agent", name: agentName, text }),
      },
    ).then((r) => r.json())) as ChatMsg;
    setMessages((prev) => [...prev, msg]);
  };

  const copyLink = async () => {
    if (!clientUrl) return;
    await navigator.clipboard.writeText(clientUrl).catch(() => {});
    setCopyText("✓ Copied!");
    setTimeout(() => setCopyText("Copy"), 2000);
  };

  const isSharing = status === "connecting" || status === "live";

  return (
    <div className="sc-panel-wrap">
      <div className="sc-panel">
        {/* Header */}
        <div className="sc-panel-header">
          <span className="sc-logo">HDE</span>
          <span className="sc-subtitle">Screen Share — Agent View</span>
          <h2 className="sc-session-label">Session: {sessionId ?? "—"}</h2>
        </div>

        {/* Status bar */}
        <div className="sc-status-bar">
          <div
            className={`sc-dot${status === "live" ? " sc-dot-live" : status === "connecting" ? " sc-dot-ready" : ""}`}
          />
          <span className="sc-status-text">
            {status === "idle" && "Idle — not sharing"}
            {status === "capturing" && "⏳ Requesting screen access…"}
            {status === "connecting" && "⏳ Waiting for viewer to connect…"}
            {status === "live" && "🔴 Live — viewer connected"}
            {status === "ended" && "✅ Session ended"}
          </span>
          <span className="sc-viewers">
            {viewerConnected ? (
              <>
                <strong>1</strong> viewer watching
              </>
            ) : (
              <span>No viewers yet</span>
            )}
          </span>
        </div>

        {/* Preview */}
        <div className="sc-preview-area">
          <video
            ref={videoRef}
            className="sc-local-preview"
            autoPlay
            muted
            playsInline
            style={{ display: "none" }}
          />
          {!isSharing && (
            <div className="sc-preview-placeholder">
              <svg viewBox="0 0 24 24">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9 8l6 4-6 4V8z" />
              </svg>
              <p>
                Your screen preview will appear here
                <br />
                when you start sharing.
              </p>
            </div>
          )}
          {status === "live" && (
            <div className="sc-rec-badge">
              <div className="sc-rbdot" /> LIVE
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="sc-controls">
          <button
            className="sc-btn sc-btn-primary"
            onClick={startShare}
            disabled={isSharing || status === "capturing"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 10l-4-3 4-3v6z" />
            </svg>
            Start Screen Share
          </button>
          <button
            className="sc-btn sc-btn-danger"
            onClick={stopShare}
            disabled={!isSharing}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h12v12H6z" />
            </svg>
            Stop Sharing
          </button>
          <button
            className="sc-btn sc-btn-outline"
            onClick={copyLink}
            disabled={!clientUrl}
          >
            📋 Copy Client Link
          </button>
        </div>

        {/* Client URL */}
        {clientUrl && (
          <div className="sc-share-link-box">
            <label>Client URL</label>
            <input readOnly value={clientUrl} />
            <button className="sc-copy-btn" onClick={copyLink}>
              {copyText}
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="sc-info-grid">
          <div className="sc-info-cell">
            <div className="sc-lbl">Session ID</div>
            <div className="sc-val sc-val-sm">{sessionId ?? "—"}</div>
          </div>
          <div className="sc-info-cell">
            <div className="sc-lbl">Duration</div>
            <div className="sc-val">{duration}</div>
          </div>
          <div className="sc-info-cell">
            <div className="sc-lbl">Connection</div>
            <div className="sc-val sc-val-sm">{iceState}</div>
          </div>
        </div>

        {/* Chat toggle */}
        {sessionId && (
          <div className="sc-agent-chat">
            <button
              className="sc-chat-toggle"
              onClick={() => setChatOpen((o) => !o)}
            >
              💬 Chat {messages.length > 0 && `(${messages.length})`}
              <span className="sc-chat-chevron">{chatOpen ? "▲" : "▼"}</span>
            </button>
            {chatOpen && (
              <>
                <div className="sc-chat-msgs sc-chat-msgs-agent">
                  {messages.length === 0 && (
                    <p className="sc-chat-empty">No messages yet.</p>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className={`sc-chat-msg sc-chat-${m.role}`}>
                      <div className="sc-from">
                        {m.role === "agent" ? agentName : m.name}
                      </div>
                      {m.text}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="sc-chat-input-row">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                    placeholder="Send a message…"
                  />
                  <button onClick={sendChat}>Send</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
