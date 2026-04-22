"use client";

import { useQuery } from "@tanstack/react-query";
import { getInvoiceStats } from "@/actions/invoice";
import { fmt } from "@/types/admin";

export default function InvoiceStatsCards() {
  const { data: stats } = useQuery({
    queryKey: ["invoice-stats"],
    queryFn: () => getInvoiceStats(),
  });

  if (!stats) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card">
            <div className="s-label">Loading…</div>
            <div className="s-value">—</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="s-label">Total Invoiced</div>
        <div className="s-value">{fmt(stats.totalBilled)}</div>
        <div className="s-sub">{stats.totalCount} invoices total</div>
      </div>
      <div className="stat-card">
        <div className="s-value" style={{ color: "var(--color-success)" }}>
          {fmt(stats.collected)}
        </div>
        <div className="s-label">Collected</div>
        <div className="s-sub">{stats.paidCount} paid</div>
      </div>
      <div className="stat-card">
        <div
          className="s-value"
          style={{ color: "var(--color-warning,#FFB020)" }}
        >
          {fmt(stats.outstanding)}
        </div>
        <div className="s-label">Outstanding</div>
        <div className="s-sub">{stats.unpaidCount} awaiting</div>
      </div>
      <div className="stat-card">
        <div className="s-value" style={{ color: "var(--color-error)" }}>
          {stats.overdueCount}
        </div>
        <div className="s-label">Overdue</div>
        <div className="s-sub">
          {stats.overdueCount ? "Needs attention!" : "All on track"}
        </div>
      </div>
    </div>
  );
}
