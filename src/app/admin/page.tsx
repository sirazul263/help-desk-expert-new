import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [userCount, adminCount, recentUsers] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLogin: true,
      },
    }),
  ]);

  return (
    <div>
      <h1 className="dash-title">Admin Dashboard</h1>

      <div className="dash-stats">
        <div className="dash-stat-card">
          <span className="dash-stat-value">{userCount}</span>
          <span className="dash-stat-label">Users</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-value">{adminCount}</span>
          <span className="dash-stat-label">Admins</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-value">{userCount + adminCount}</span>
          <span className="dash-stat-label">Total</span>
        </div>
      </div>

      <h2 className="dash-subtitle">Recent Users</h2>
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`dash-badge ${u.role === "ADMIN" ? "dash-badge-admin" : "dash-badge-user"}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <span className={`dash-badge ${u.isActive ? "dash-badge-active" : "dash-badge-inactive"}`}>
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
