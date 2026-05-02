"use client";

import { useState, useMemo } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import Link from "next/link";
import { Eye, X, UserPlus } from "lucide-react";

type User = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  company?: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string | null;
};

type UsersResponse = {
  users: User[];
  total: number;
  page: number;
  perPage: number;
};

async function fetchUsers({
  page,
  perPage,
  q,
  role,
  isActive,
}: {
  page: number;
  perPage: number;
  q?: string;
  role?: string;
  isActive?: boolean;
}): Promise<UsersResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("perPage", String(perPage));
  if (q) params.set("q", q);
  if (role) params.set("role", role);
  if (typeof isActive !== "undefined") params.set("isActive", String(isActive));
  const res = await fetch(`/api/admin/users?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  company: "",
};

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [q, setQ] = useState("");
  const [isActive, setIsActive] = useState<string>("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const queryKey = useMemo(
    () => ["adminUsers", page, perPage, q, isActive],
    [page, perPage, q, isActive],
  );

  const { data, isLoading, error } = useQuery<UsersResponse>({
    queryKey,
    queryFn: () =>
      fetchUsers({
        page,
        perPage,
        q,
        role: "ADMIN",
        isActive: isActive === "" ? undefined : isActive === "true",
      }),
    placeholderData: keepPreviousData,
  });

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  const openModal = () => {
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password) {
      setFormError("First name, last name, email and password are required.");
      return;
    }
    if (form.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to create admin user.");
        return;
      }
      closeModal();
      qc.invalidateQueries({ queryKey: ["adminUsers"] });
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="p-8!">
      <h1 className="dash-title">All Users</h1>

      <div className="table-card">
        <div className="table-header">
          <div className="table-header-left">
            <h3>Admin Users</h3>
            <input
              className="table-search"
              placeholder="Search name or email"
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
            />
            <select
              className="filter-select"
              value={isActive}
              onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
            >
              <option value="">Any status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            {(q || isActive) && (
              <button
                className="filter-clear-btn"
                onClick={() => { setQ(""); setIsActive(""); setPage(1); }}
              >
                Clear
              </button>
            )}
          </div>
          <button className="btn-secondary" onClick={openModal} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <UserPlus size={15} /> New Admin
          </button>
        </div>

        <div className="adm-content">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error loading users</div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Last Login</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan={8}>No users found.</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 500 }}>
                        {u.firstName} {u.lastName}
                      </td>
                      <td style={{ fontSize: "0.82rem" }}>{u.email}</td>
                      <td style={{ fontSize: "0.82rem" }}>{u.company ?? "—"}</td>
                      <td>
                        <span className={`inv-badge ${u.role === "ADMIN" ? "b-paid" : "b-draft"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className={`inv-badge ${u.isActive ? "b-paid" : "b-overdue"}`}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.82rem" }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ fontSize: "0.82rem" }}>
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "—"}
                      </td>
                      <td>
                        <Link href={`/admin/users/${u.id}`} className="btn-icon" title="View details">
                          <Eye size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <ReactPaginate
              pageCount={pageCount}
              forcePage={page - 1}
              onPageChange={({ selected }) => setPage(selected + 1)}
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
              Page {page} of {pageCount} — {total} users
            </div>
          </div>
        </div>
      </div>

      {/* New Admin Modal */}
      {showModal && (
        <div className="adm-overlay open" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="adm-modal">
            <div className="adm-modal-hdr">
              <h3>Add Admin User</h3>
              <button className="adm-modal-close" onClick={closeModal} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="adm-modal-body">
                <div className="adm-field-row">
                  <div className="adm-field">
                    <label>First Name <span className="req">*</span></label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => field("firstName", e.target.value)}
                      placeholder="Jane"
                      autoFocus
                    />
                  </div>
                  <div className="adm-field">
                    <label>Last Name <span className="req">*</span></label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => field("lastName", e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="adm-field">
                  <label>Email <span className="req">*</span></label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => field("email", e.target.value)}
                    placeholder="jane@example.com"
                  />
                </div>
                <div className="adm-field">
                  <label>Password <span className="req">*</span></label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => field("password", e.target.value)}
                    placeholder="Min 8 characters"
                  />
                </div>
                <div className="adm-field">
                  <label>Company</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => field("company", e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                {formError && (
                  <p style={{ color: "var(--color-error)", fontSize: "0.8rem", margin: "0.5rem 0 0" }}>
                    {formError}
                  </p>
                )}
              </div>
              <div className="adm-modal-ftr">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button
                  type="submit"
                  className="btn-secondary"
                  disabled={submitting}
                  style={{ background: "var(--color-brand)", color: "#fff", border: "none" }}
                >
                  {submitting ? "Creating…" : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
