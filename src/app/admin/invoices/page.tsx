"use client";

import AdminToast from "@/components/Dashboard/AdminToast";
import CustomerTable from "@/components/Dashboard/Customer/CustomerTable";
import InvoiceModal from "@/components/Dashboard/Invoice/InvoiceModal";
import InvoicePreview from "@/components/Dashboard/Invoice/InvoicePreview";
import InvoiceStatsCards from "@/components/Dashboard/Invoice/InvoiceStats";
import InvoiceTable from "@/components/Dashboard/Invoice/InvoiceTable";
import { Invoice } from "@/types/admin";
import { useState } from "react";

type Tab = "invoices" | "clients";

export default function InvoicesPage() {
  const [tab, setTab] = useState<Tab>("invoices");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  const handleEdit = (inv: Invoice) => {
    setEditInvoice(inv);
    setModal("edit");
  };

  const handlePreview = (inv: Invoice) => {
    setPreviewInvoice(inv);
  };

  const handleCloseModal = () => {
    setModal(null);
    setEditInvoice(null);
  };

  /* Preview mode */
  if (previewInvoice) {
    return (
      <div className="adm-content">
        <InvoicePreview
          invoice={previewInvoice}
          onClose={() => setPreviewInvoice(null)}
        />
        <AdminToast />
      </div>
    );
  }

  return (
    <div className="adm-content">
      <InvoiceStatsCards />

      {/* Tabs */}
      <div className="adm-tab-bar">
        <button
          className={`adm-tab${tab === "invoices" ? " active" : ""}`}
          onClick={() => setTab("invoices")}
        >
          Invoices
        </button>
        <button
          className={`adm-tab${tab === "clients" ? " active" : ""}`}
          onClick={() => setTab("clients")}
        >
          Customers
        </button>
      </div>

      {tab === "invoices" ? (
        <InvoiceTable
          showSearch
          onEdit={handleEdit}
          onPreview={handlePreview}
          onNewInvoice={() => setModal("create")}
        />
      ) : (
        <CustomerTable />
      )}

      {modal && (
        <InvoiceModal
          invoice={modal === "edit" ? editInvoice : null}
          onClose={handleCloseModal}
        />
      )}

      <AdminToast />
    </div>
  );
}
