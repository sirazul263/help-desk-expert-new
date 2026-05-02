"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

type Status = "waiting" | "connecting" | "live" | "ended";

interface ChatMsg {
  id: string;
  role: "agent" | "client";
  name: string;
  text: string;
  createdAt: string;
}

interface SessionInfo {
  id: string;
  agentName: string;
  startedAt: number | null;
}

interface Props {
  userName: string;
  initialSessionId: string | null;
}

function esc(t: string) {
  return String(t)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function ScreenClientViewer({
  userName,
  initialSessionId,
}: Props) {
  const [status, setStatus] = useState<Status>("waiting");
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [duration, setDuration] = useState("—");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const icePollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const esRef = useRef<EventSource | null>(null);
  const sidRef = useRef<string | null>(null);
  const addedCandidatesRef = useRef<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const cleanup = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (sessionPollRef.current) {
      clearInterval(sessionPollRef.current);
      sessionPollRef.current = null;
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
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const startTimer = (startedAt: number) => {
    timerRef.current = setInterval(() => {
      const s = Math.floor((Date.now() - startedAt) / 1000);
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
    });
    es.addEventListener("ended", () => {
      setStatus("ended");
      cleanup();
    });
  };

  const connectToSession = useCallback(
    async (sid: string) => {
      if (connectedRef.current) return;
      connectedRef.current = true;

      sidRef.current = sid;
      setStatus("connecting");

      // Fetch session details
      const sessionRes = await fetch(`/api/screen-share/sessions/${sid}`);
      if (!sessionRes.ok) {
        setStatus("waiting");
        connectedRef.current = false;
        return;
      }
      const sessionData = (await sessionRes.json()) as {
        agentName: string;
        createdAt: string;
      };
      const createdAt = new Date(sessionData.createdAt).getTime();
      setSessionInfo({
        id: sid,
        agentName: sessionData.agentName,
        startedAt: createdAt,
      });

      // Fetch existing chat history
      const chatRes = await fetch(`/api/screen-share/sessions/${sid}/chat`);
      if (chatRes.ok) {
        const { messages: history } = (await chatRes.json()) as {
          messages: ChatMsg[];
        };
        setMessages(history);
      }

      // Subscribe to SSE for live updates
      subscribeSSE(sid);
      startTimer(createdAt);

      // Poll until offer appears
      const waitForOffer = (): Promise<string> =>
        new Promise((resolve) => {
          const interval = setInterval(async () => {
            try {
              const r = await fetch(`/api/screen-share/sessions/${sid}/signal`);
              const data = (await r.json()) as {
                offer?: string;
                status: string;
              };
              if (data.status === "ended") {
                clearInterval(interval);
                setStatus("ended");
                cleanup();
                return;
              }
              if (data.offer) {
                clearInterval(interval);
                resolve(data.offer);
              }
            } catch {}
          }, 700);
          sessionPollRef.current = interval;
        });

      const offerSdp = await waitForOffer();
      if (!offerSdp) return;

      // Build WebRTC connection
      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcRef.current = pc;

      pc.ontrack = (event) => {
        if (videoRef.current && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") setStatus("live");
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed"
        ) {
          setStatus("ended");
          cleanup();
        }
      };

      // Send our ICE candidates to DB as they arrive
      pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
          fetch(`/api/screen-share/sessions/${sid}/ice`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: "client",
              candidate: JSON.stringify(candidate),
            }),
          }).catch(() => {});
        }
      };

      // Set remote description from offer — can start adding agent ICE candidates now
      await pc.setRemoteDescription({ type: "offer", sdp: offerSdp });
      startPollingAgentICE(pc, sid);

      // Create & send answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await fetch(`/api/screen-share/sessions/${sid}/signal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "answer", sdp: answer.sdp }),
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [cleanup],
  );

  const startPollingAgentICE = (pc: RTCPeerConnection, sid: string) => {
    icePollRef.current = setInterval(async () => {
      try {
        const r = await fetch(
          `/api/screen-share/sessions/${sid}/ice?role=agent`,
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
        if (
          pc.iceConnectionState === "connected" ||
          pc.iceConnectionState === "completed"
        ) {
          clearInterval(icePollRef.current!);
          icePollRef.current = null;
        }
      } catch {}
    }, 700);
  };

  // Connect once we have a session ID (from URL or poll)
  useEffect(() => {
    if (initialSessionId) {
      connectToSession(initialSessionId);
      return;
    }
    // No session ID — poll for any live session
    const poll = setInterval(async () => {
      // Nothing to poll without a session ID; user should navigate with ?session=
    }, 3000);
    return () => clearInterval(poll);
  }, [initialSessionId, connectToSession]);

  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || !sidRef.current) return;
    setChatInput("");
    const msg = (await fetch(
      `/api/screen-share/sessions/${sidRef.current}/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "client", name: userName, text }),
      },
    ).then((r) => r.json())) as ChatMsg;
    setMessages((prev) => [...prev, msg]);
  };

  const toggleFullscreen = () => {
    const el = document.getElementById("sc-screen-wrap");
    if (!document.fullscreenElement && el) el.requestFullscreen();
    else document.exitFullscreen();
  };

  const startedTime = sessionInfo?.startedAt
    ? new Date(sessionInfo.startedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="sc-viewer-outer">
      {/* Topbar */}
      <div className="sc-topbar">
        <span className="sc-logo">HDE</span>
        {status === "live" ? (
          <div className="sc-live-pill">
            <div className="sc-live-dot" />
            LIVE
          </div>
        ) : status === "ended" ? (
          <div
            className="sc-waiting-pill"
            style={{ borderColor: "var(--sc-muted)", color: "var(--sc-muted)" }}
          >
            Session ended
          </div>
        ) : (
          <div className="sc-waiting-pill">
            ⏳ {status === "connecting" ? "Connecting…" : "Waiting for agent"}
          </div>
        )}
        <div className="sc-spacer" />
        <span className="sc-user-label">
          Logged in as <strong>{userName}</strong>
        </span>
      </div>

      {/* Main area */}
      <div className="sc-main-area">
        {/* Screen viewer */}
        <div className="sc-screen-wrap" id="sc-screen-wrap">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="sc-screen-video"
            style={{ display: status === "live" ? "block" : "none" }}
          />
          {status !== "live" && (
            <div className="sc-waiting-overlay">
              <div className="sc-pulse-ring" />
              <svg viewBox="0 0 24 24">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
              <h3>
                {status === "ended"
                  ? "Session has ended"
                  : status === "connecting"
                    ? "Connecting to agent…"
                    : "Waiting for screen share"}
              </h3>
              <p>
                {status === "ended"
                  ? "The agent has stopped the screen share session."
                  : status === "connecting"
                    ? "Establishing WebRTC connection with the agent."
                    : "Your agent hasn't started sharing yet. This page will update automatically."}
              </p>
            </div>
          )}
          {status === "live" && (
            <button className="sc-fullscreen-btn" onClick={toggleFullscreen}>
              ⛶ Fullscreen
            </button>
          )}
        </div>

        {/* Sidebar */}
        <div className="sc-sidebar">
          <div className="sc-sidebar-section">
            <h4>Session Info</h4>
            <div className="sc-info-row">
              <span className="sc-key">Status</span>
              <span className="sc-val">
                <span
                  className={`sc-status-badge ${status === "live" ? "sc-badge-live" : "sc-badge-waiting"}`}
                >
                  {status === "live"
                    ? "🔴 Live"
                    : status === "ended"
                      ? "⬛ Ended"
                      : "⏳ Waiting"}
                </span>
              </span>
            </div>
            <div className="sc-info-row">
              <span className="sc-key">Session ID</span>
              <span className="sc-val">{sessionInfo?.id ?? "—"}</span>
            </div>
            <div className="sc-info-row">
              <span className="sc-key">Agent</span>
              <span className="sc-val">{sessionInfo?.agentName ?? "—"}</span>
            </div>
            <div className="sc-info-row">
              <span className="sc-key">Duration</span>
              <span className="sc-val">{duration}</span>
            </div>
            <div className="sc-info-row">
              <span className="sc-key">Started</span>
              <span className="sc-val">{startedTime}</span>
            </div>
          </div>

          {/* Chat */}
          <div className="sc-chat-section">
            <h4>Chat with Agent</h4>
            <div className="sc-chat-msgs">
              {messages.length === 0 && (
                <p className="sc-chat-empty">No messages yet.</p>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`sc-chat-msg sc-chat-${m.role}`}>
                  <div className="sc-from">
                    {m.role === "client" ? userName : m.name}
                  </div>
                  <span dangerouslySetInnerHTML={{ __html: esc(m.text) }} />
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
                disabled={status === "ended"}
              />
              <button onClick={sendChat} disabled={status === "ended"}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
