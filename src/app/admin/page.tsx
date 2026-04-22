"use client";
import AdminToast from "@/components/Dashboard/AdminToast";
import InvoicePreview from "@/components/Dashboard/Invoice/InvoicePreview";
import InvoiceStatsCards from "@/components/Dashboard/Invoice/InvoiceStats";
import InvoiceTable from "@/components/Dashboard/Invoice/InvoiceTable";
import { Invoice } from "@/types/admin";
import { useState } from "react";

export default function AdminDashboardPage() {
  const [preview, setPreview] = useState<Invoice | null>(null);

  if (preview) {
    return (
      <div className="adm-content">
        <InvoicePreview invoice={preview} onClose={() => setPreview(null)} />
        <AdminToast />
      </div>
    );
  }

  return (
    <div className="adm-content">
      <h2 style={{ marginBottom: "1rem", fontWeight: 700 }}>Dashboard</h2>
      <InvoiceStatsCards />
      <InvoiceTable
        limit={5}
        showSearch={false}
        onPreview={(inv) => setPreview(inv)}
      />
      <AdminToast />
    </div>
  );
}
