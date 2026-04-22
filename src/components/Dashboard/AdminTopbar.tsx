"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

type Notif = {
  id: string;
  type?: string;
  text: string;
  url?: string;
  createdAt?: string;
};

async function fetchNotifs(): Promise<{ notifications: Notif[] }> {
  const res = await fetch(`/api/notifications`);
  if (!res.ok) throw new Error("Failed to load notifications");
  return res.json();
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AdminTopbar({ title = "Admin" }: { title?: string }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifs,
    staleTime: 30_000,
  });
  const notifications = data?.notifications || [];

  /* Close dropdown when clicking outside */
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="adm-topbar">
      <div className="adm-topbar-title">{title}</div>
      <div className="adm-topbar-actions">
        <div className="adm-search-wrap">
          <input className="table-search" placeholder="Search..." />
        </div>
        <div className="adm-notif" ref={dropdownRef}>
          <button
            className="btn-icon notif-trigger"
            aria-label="Notifications"
            onClick={() => setOpen((s) => !s)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notifications.length > 0 && (
              <span className="notif-badge">{notifications.length}</span>
            )}
          </button>

          {open && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-hdr">
                <span>Notifications</span>
                <span className="notif-count">{notifications.length}</span>
              </div>

              <div className="notif-list">
                {isLoading ? (
                  <div className="notif-item notif-empty">Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="notif-item notif-empty">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.url || "#"}
                      className="notif-item"
                      onClick={() => setOpen(false)}
                    >
                      <span
                        className={`notif-icon ${n.type === "invoice" ? "notif-icon-inv" : "notif-icon-user"}`}
                      >
                        {n.type === "invoice" ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                        ) : (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        )}
                      </span>
                      <div className="notif-body">
                        <span className="notif-text">{n.text}</span>
                        {n.createdAt && (
                          <span className="notif-time">
                            {timeAgo(n.createdAt)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>

              <div className="notif-footer">
                <Link href="/admin" onClick={() => setOpen(false)}>
                  View all activity
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
