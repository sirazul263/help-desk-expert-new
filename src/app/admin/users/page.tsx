import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      company: true,
      isActive: true,
      createdAt: true,
      lastLogin: true,
    },
  });

  return (
    <div>
      <h1 className="dash-title">All Users</h1>
      <div className="dash-table-wrap">
        <table className="dash-table">
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
            {users.map((u) => (
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
                <td>{u.createdAt.toLocaleDateString()}</td>
                <td>{u.lastLogin?.toLocaleDateString() ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
