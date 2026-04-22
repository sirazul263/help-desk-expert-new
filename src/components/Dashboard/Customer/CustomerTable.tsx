"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { getCustomers } from "@/actions/invoice";
import {
  fmtDate,
  initials,
  avatarColors,
  avatarTextColors,
  type Customer,
} from "@/types/admin";

export default function CustomerTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 10;

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(),
  });

  const filtered = (customers as Customer[]).filter((c) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.company || "").toLowerCase().includes(q)
    );
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice(page * perPage, (page + 1) * perPage);

  return (
    <div className="table-card">
      <div className="table-header">
        <div className="table-header-left">
          <h3>Customers</h3>
          <input
            className="table-search"
            type="text"
            placeholder="Search customers…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Email</th>
            <th>Company</th>
            <th>Invoices</th>
            <th>Joined</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="empty-row">
              <td colSpan={6}>Loading…</td>
            </tr>
          ) : filtered.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={6}>No customers found.</td>
            </tr>
          ) : (
            paginated.map((c, idx) => {
              const name = `${c.firstName} ${c.lastName}`;
              const ci = idx % avatarColors.length;
              return (
                <tr key={c.id}>
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
                      <span style={{ fontWeight: 500 }}>{name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: ".8rem" }}>{c.email}</td>
                  <td style={{ fontSize: ".82rem" }}>{c.company || "—"}</td>
                  <td>
                    <span
                      className="inv-badge b-paid"
                      style={{ fontSize: ".7rem" }}
                    >
                      {c._count.invoices} invoice
                      {c._count.invoices !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td style={{ fontSize: ".8rem" }}>{fmtDate(c.createdAt)}</td>
                  <td>
                    <span
                      className={`inv-badge ${c.isActive ? "b-paid" : "b-overdue"}`}
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

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
          {filtered.length} customers
        </div>
      </div>
    </div>
  );
}
