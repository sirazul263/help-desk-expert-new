"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import {
  getInvoices,
  deleteInvoice,
  markInvoiceStatus,
} from "@/actions/invoice";
import {
  fmt,
  fmtDate,
  initials,
  avatarColors,
  avatarTextColors,
  badgeClass,
  getInvTotal,
  clientName,
  type Invoice,
} from "@/types/admin";
import { showToast } from "../AdminToast";

interface Props {
  limit?: number;
  showSearch?: boolean;
  onEdit?: (inv: Invoice) => void;
  onPreview?: (inv: Invoice) => void;
  onNewInvoice?: () => void;
}

export default function InvoiceTable({
  limit,
  showSearch = true,
  onEdit,
  onPreview,
  onNewInvoice,
}: Props) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 10;

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => getInvoices(),
  });

  const filtered = (invoices as Invoice[]).filter((inv) => {
    const q = search.toLowerCase();
    const name = clientName(inv.client);
    const matchSearch =
      !q ||
      inv.num.toLowerCase().includes(q) ||
      name.toLowerCase().includes(q) ||
      (inv.client.company || "").toLowerCase().includes(q) ||
      inv.items.some((li) => li.desc.toLowerCase().includes(q));
    const matchStatus = !statusFilter || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const displayed = limit ? filtered.slice(0, limit) : filtered;
  const pageCount = Math.max(1, Math.ceil(displayed.length / perPage));
  const paginated = limit
    ? displayed
    : displayed.slice(page * perPage, (page + 1) * perPage);

  const handleMarkStatus = async (id: string, status: "Paid" | "Overdue") => {
    await markInvoiceStatus(id, status);
    qc.invalidateQueries({ queryKey: ["invoices"] });
    qc.invalidateQueries({ queryKey: ["invoice-stats"] });
    showToast(
      status === "Paid"
        ? "Invoice marked as paid"
        : "Invoice marked as overdue",
      status === "Paid" ? "success" : "error",
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this invoice permanently?")) return;
    await deleteInvoice(id);
    qc.invalidateQueries({ queryKey: ["invoices"] });
    qc.invalidateQueries({ queryKey: ["invoice-stats"] });
    showToast("Invoice deleted", "error");
  };

  return (
    <div className="table-card">
      <div className="table-header">
        <div className="table-header-left">
          <h3>{limit ? "Recent Invoices" : "All Invoices"}</h3>
          {showSearch && (
            <>
              <input
                className="table-search"
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
              />
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <option value="">All statuses</option>
                <option>Draft</option>
                <option>Unpaid</option>
                <option>Paid</option>
                <option>Overdue</option>
              </select>
            </>
          )}
        </div>
        {onNewInvoice && (
          <button className="btn-primary" onClick={onNewInvoice}>
            + New Invoice
          </button>
        )}
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Client</th>
            {!limit && <th>Description</th>}
            <th>Amount</th>
            {!limit && <th>Issued</th>}
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="empty-row">
              <td colSpan={limit ? 7 : 8}>Loading…</td>
            </tr>
          ) : displayed.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={limit ? 7 : 8}>No invoices found.</td>
            </tr>
          ) : (
            paginated.map((inv, idx) => {
              const { total } = getInvTotal(inv);
              const name = clientName(inv.client);
              const desc = inv.items.map((i) => i.desc).join(", ");
              const shortDesc =
                desc.length > 45 ? desc.substring(0, 45) + "…" : desc;
              const ci = idx % avatarColors.length;
              return (
                <tr key={inv.id}>
                  <td
                    style={{
                      fontWeight: 600,
                      color: "var(--color-brand)",
                      fontSize: ".8rem",
                    }}
                  >
                    {inv.num}
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".5rem",
                      }}
                    >
                      <span
                        className="cl-avatar"
                        style={{
                          background: avatarColors[ci],
                          color: avatarTextColors[ci],
                        }}
                      >
                        {initials(name)}
                      </span>
                      <div>
                        <div style={{ fontSize: ".84rem", fontWeight: 500 }}>
                          {name}
                        </div>
                        <div
                          style={{
                            fontSize: ".72rem",
                            color: "var(--color-muted)",
                          }}
                        >
                          {inv.client.company}
                        </div>
                      </div>
                    </div>
                  </td>
                  {!limit && (
                    <td
                      style={{
                        fontSize: ".78rem",
                        color: "var(--color-muted)",
                        maxWidth: 160,
                      }}
                    >
                      {shortDesc}
                    </td>
                  )}
                  <td style={{ fontWeight: 600 }}>{fmt(total)}</td>
                  {!limit && (
                    <td style={{ fontSize: ".8rem" }}>{fmtDate(inv.issued)}</td>
                  )}
                  <td
                    style={{
                      fontSize: ".8rem",
                      ...(inv.status === "Overdue"
                        ? { color: "var(--color-error)", fontWeight: 600 }
                        : {}),
                    }}
                  >
                    {fmtDate(inv.due)}
                  </td>
                  <td>
                    <span
                      className={`inv-badge ${badgeClass[inv.status] || "b-draft"}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <div className="td-actions">
                      {inv.status !== "Paid" && (
                        <button
                          className="btn-success"
                          onClick={() => handleMarkStatus(inv.id, "Paid")}
                        >
                          {limit ? "Mark Paid" : "Paid"}
                        </button>
                      )}
                      {!limit &&
                        (inv.status === "Unpaid" ||
                          inv.status === "Overdue") && (
                          <button
                            className="btn-warning"
                            onClick={() => handleMarkStatus(inv.id, "Overdue")}
                          >
                            Overdue
                          </button>
                        )}
                      {onEdit && !limit && (
                        <button
                          className="btn-ghost"
                          onClick={() => onEdit(inv)}
                        >
                          Edit
                        </button>
                      )}
                      {onPreview && (
                        <button
                          className="btn-info"
                          onClick={() => onPreview(inv)}
                        >
                          {limit ? "Preview" : "PDF"}
                        </button>
                      )}
                      {!limit && (
                        <button
                          className="btn-danger"
                          onClick={() => handleDelete(inv.id)}
                        >
                          Del
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {!limit && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 1rem",
          }}
        >
          <ReactPaginate
            pageCount={pageCount}
            forcePage={page}
            onPageChange={({ selected }) => setPage(selected)}
            containerClassName="pagination"
            pageLinkClassName="btn-secondary"
            activeClassName="active"
            previousLabel="Prev"
            nextLabel="Next"
            previousLinkClassName="btn-secondary"
            nextLinkClassName="btn-secondary"
            disabledClassName="disabled"
            breakLabel="..."
            breakLinkClassName="btn-secondary"
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
          />
          <div style={{ color: "var(--color-muted)", fontSize: "0.82rem" }}>
            {displayed.length} invoices
          </div>
        </div>
      )}
    </div>
  );
}
