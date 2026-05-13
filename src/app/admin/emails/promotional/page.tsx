import PromoClient from "@/components/Dashboard/Email/PromoClient";
import AdminToast from "@/components/Dashboard/AdminToast";

export const metadata = { title: "Promotional Emails — Admin" };

export default function PromotionalEmailPage() {
  return (
    <div className="adm-content">
      <h1 className="dash-title">Promotional Emails</h1>
      <PromoClient />
      <AdminToast />
    </div>
  );
}
