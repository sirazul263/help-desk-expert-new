import Link from "next/link";
import ComposeClient from "@/components/Dashboard/Email/ComposeClient";
import AdminToast from "@/components/Dashboard/AdminToast";

export const metadata = { title: "Compose Email — Admin" };

export default function ComposePage() {
  return (
    <div className="adm-content">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <h1 className="dash-title" style={{ margin: 0 }}>Compose Email</h1>
        <Link href="/admin/emails" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.82rem" }}>
          ← Back to Sent Emails
        </Link>
      </div>
      <ComposeClient />
      <AdminToast />
    </div>
  );
}
