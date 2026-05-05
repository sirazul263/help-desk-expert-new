"use client";

import { useEffect, useState } from "react";

type Status = "pending" | "in_progress" | "completed";

interface Consultation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  agents: string;
  channels: string;
  volume: string;
  date: string;
  time: string;
  timezone: string;
  notes: string;
  source: string;
  status: Status;
  createdAt: string;
}

const STATUS_LABELS: Record<Status, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

const STATUS_CLASS: Record<Status, string> = {
  pending: "cs-badge cs-pending",
  in_progress: "cs-badge cs-inprogress",
  completed: "cs-badge cs-completed",
};

function fmtDate(ymd: string) {
  return new Date(ymd + "T12:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ConsultationsPage() {
  const [rows, setRows] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/consultations")
      .then((r) => r.json())
      .then((data) => { setRows(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: Status) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRows((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r)),
        );
      }
    } finally {
      setUpdating(null);
    }
  };

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      r.firstName.toLowerCase().includes(q) ||
      r.lastName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.company.toLowerCase().includes(q)
    );
  });

  return (
    <div className="adm-content">
      <div className="cs-header">
        <div>
          <h2 className="cs-title">Consultations</h2>
          <p className="cs-subtitle">{rows.length} booking{rows.length !== 1 ? "s" : ""} total</p>
        </div>
        <input
          className="cs-search"
          placeholder="Search by name, email or company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Status summary chips */}
      <div className="cs-summary">
        {(["pending", "in_progress", "completed"] as Status[]).map((s) => {
          const count = rows.filter((r) => r.status === s).length;
          return (
            <div key={s} className={`cs-summary-chip cs-summary-${s}`}>
              <span className="cs-summary-count">{count}</span>
              <span>{STATUS_LABELS[s]}</span>
            </div>
          );
        })}
      </div>

      <div className="cs-table-wrap">
        {loading ? (
          <div className="cs-empty">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="cs-empty">No consultations found.</div>
        ) : (
          <table className="cs-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Company</th>
                <th>Appointment</th>
                <th>Agents</th>
                <th>Channels</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="cs-client-name">
                      {row.firstName} {row.lastName}
                    </div>
                    <div className="cs-client-email">{row.email}</div>
                    <div className="cs-client-role">{row.role}</div>
                  </td>
                  <td>{row.company}</td>
                  <td>
                    <div className="cs-apt-date">{fmtDate(row.date)}</div>
                    <div className="cs-apt-time">{row.time}</div>
                    <div className="cs-apt-tz">{row.timezone}</div>
                  </td>
                  <td>{row.agents}</td>
                  <td>
                    <div className="cs-channels">
                      {row.channels || "—"}
                    </div>
                  </td>
                  <td>
                    <span className={STATUS_CLASS[row.status]}>
                      {STATUS_LABELS[row.status]}
                    </span>
                  </td>
                  <td>
                    <select
                      className="cs-status-select"
                      value={row.status}
                      disabled={updating === row.id}
                      onChange={(e) =>
                        updateStatus(row.id, e.target.value as Status)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
