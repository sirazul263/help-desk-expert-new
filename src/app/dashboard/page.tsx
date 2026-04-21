import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div>
      <h1 className="dash-title">
        Welcome, {user.firstName}!
      </h1>

      <div className="dash-stats">
        <div className="dash-stat-card">
          <span className="dash-stat-label">Name</span>
          <span className="dash-stat-value-sm">
            {user.firstName} {user.lastName}
          </span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Email</span>
          <span className="dash-stat-value-sm">{user.email}</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Company</span>
          <span className="dash-stat-value-sm">{user.company ?? "—"}</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Role</span>
          <span className="dash-stat-value-sm">{user.role}</span>
        </div>
      </div>
    </div>
  );
}
