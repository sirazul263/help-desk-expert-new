import EmailsClient from "@/components/Dashboard/Email/EmailsClient";
import AdminToast from "@/components/Dashboard/AdminToast";

export const metadata = { title: "Email Manager — Admin" };

export default function EmailsPage() {
  return (
    <div className="adm-content">
      <h1 className="dash-title">Email Manager</h1>
      <EmailsClient />
      <AdminToast />
    </div>
  );
}
