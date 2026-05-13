"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getEmailRecipients, sendAdminEmail } from "@/actions/emailCampaign";
import { showToast } from "../AdminToast";

type Recipient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
};

const CUSTOM = "__custom__";

export default function ComposeClient() {
  const router = useRouter();

  const [recipientId, setRecipientId] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const { data: recipients = [] } = useQuery<Recipient[]>({
    queryKey: ["email-recipients"],
    queryFn: () => getEmailRecipients(),
  });

  const resolvedTo =
    recipientId === CUSTOM
      ? customEmail.trim()
      : recipients.find((r) => r.id === recipientId)?.email ?? "";

  const canSend =
    resolvedTo.length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resolvedTo) &&
    subject.trim().length > 0 &&
    body.trim().length > 0;

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    const res = await sendAdminEmail(resolvedTo, subject.trim(), body.trim());
    setSending(false);
    if (res.error) {
      showToast(`Failed: ${res.error}`, "error");
    } else {
      showToast("Email sent successfully", "success");
      router.push("/admin/emails");
    }
  };

  return (
    <div className="table-card">
      <div className="table-header">
        <div className="table-header-left">
          <h3>New Email</h3>
        </div>
      </div>

      <div className="adm-modal-body" style={{ maxWidth: 760 }}>

        {/* Recipient + resolved address */}
        <div className="adm-field-row">
          <div className="adm-field">
            <label>Recipient</label>
            <select
              value={recipientId}
              onChange={(e) => { setRecipientId(e.target.value); setCustomEmail(""); }}
            >
              <option value="">— Select a user —</option>
              {recipients.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.firstName} {r.lastName} ({r.email}){r.company ? ` · ${r.company}` : ""}
                </option>
              ))}
              <option value={CUSTOM}>Custom email address…</option>
            </select>
          </div>

          {recipientId === CUSTOM ? (
            <div className="adm-field">
              <label>Custom Email</label>
              <input
                type="email"
                placeholder="recipient@example.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
              />
            </div>
          ) : (
            <div className="adm-field">
              <label>Sending to</label>
              <input
                type="text"
                value={resolvedTo}
                readOnly
                placeholder="—"
                style={{ color: resolvedTo ? "var(--color-brand)" : undefined, cursor: "default" }}
              />
            </div>
          )}
        </div>

        {/* Subject */}
        <div className="adm-field">
          <label>Subject</label>
          <input
            type="text"
            placeholder="Email subject…"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Body */}
        <div className="adm-field">
          <label>
            Message Body
            <span className="hint" style={{ display: "inline", marginLeft: ".4rem" }}>
              (blank lines create paragraph breaks)
            </span>
          </label>
          <textarea
            rows={12}
            placeholder="Write your message here…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem", marginTop: ".25rem" }}>
          <button
            className="btn-secondary"
            onClick={() => router.push("/admin/emails")}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            disabled={!canSend || sending}
            onClick={handleSend}
            style={{ minWidth: 130, opacity: (!canSend || sending) ? .55 : 1 }}
          >
            {sending ? "Sending…" : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
