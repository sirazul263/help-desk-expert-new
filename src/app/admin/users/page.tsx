"use client";

import { useState, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

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

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [q, setQ] = useState("");
  const [isActive, setIsActive] = useState<string>("");

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

  return (
    <div className="p-8!">
      <h1 className="dash-title">All Users</h1>

      <div className="table-card">
        <div className="table-header">
          <div className="table-header-left">
            <h3>Users</h3>
            <input
              className="table-search"
              placeholder="Search name or email"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />

            <select
              className="filter-select"
              value={isActive}
              onChange={(e) => {
                setIsActive(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Any status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div>{/* Placeholder for actions */}</div>
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
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan={7}>No users found.</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        {u.firstName} {u.lastName}
                      </td>
                      <td>{u.email}</td>
                      <td>{u.company ?? "—"}</td>
                      <td>
                        <span
                          className={`dash-badge ${u.role === "ADMIN" ? "dash-badge-admin" : "dash-badge-user"}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`dash-badge ${u.isActive ? "dash-badge-active" : "dash-badge-inactive"}`}
                        >
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        {u.lastLogin
                          ? new Date(u.lastLogin).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 12,
            }}
          >
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
    </div>
  );
}
