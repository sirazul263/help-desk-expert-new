"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInvoice,
  updateInvoice,
  getNextInvoiceNum,
  getCustomers,
} from "@/actions/invoice";
import {
  fmt,
  toDateStr,
  clientName,
  type Invoice,
  type InvoiceItem,
  type Customer,
} from "@/types/admin";
import { showToast } from "../AdminToast";

interface Props {
  invoice?: Invoice | null;
  onClose: () => void;
}

const today = () => new Date().toISOString().split("T")[0];
const addDays = (d: string, n: number) => {
  const dt = new Date(d + "T12:00:00");
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().split("T")[0];
};

export default function InvoiceModal({ invoice, onClose }: Props) {
  const qc = useQueryClient();
  const isEdit = !!invoice;

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(),
  });

  const [form, setForm] = useState({
    num: "",
    clientId: "",
    issued: today(),
    due: addDays(today(), 30),
    status: "Unpaid" as string,
    tax: "10",
    bank: "",
    notes: "",
  });
  const [lineItems, setLineItems] = useState<InvoiceItem[]>([
    { desc: "", qty: 1, price: 0 },
  ]);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  /* populate for edit or new */
  useEffect(() => {
    if (invoice) {
      setForm({
        num: invoice.num,
        clientId: invoice.clientId,
        issued: toDateStr(invoice.issued),
        due: toDateStr(invoice.due),
        status: invoice.status,
        tax: String(invoice.tax || 10),
        bank: invoice.bank,
        notes: invoice.notes,
      });
      setLineItems(
        invoice.items.map((i) => ({
          desc: i.desc,
          qty: i.qty,
          price: i.price,
        })),
      );
    } else {
      getNextInvoiceNum().then((num) => setForm((f) => ({ ...f, num })));
    }
  }, [invoice]);

  /* calc totals */
  const sub = lineItems.reduce((s, i) => s + i.qty * (i.price || 0), 0);
  const taxRate = parseFloat(form.tax) || 0;
  const tax = (sub * taxRate) / 100;
  const total = sub + tax;

  const handleSave = useCallback(
    async (forceStatus?: string) => {
      const errs: Record<string, boolean> = {};
      if (!form.num.trim()) errs.num = true;
      if (!form.clientId) errs.clientId = true;
      if (!form.issued) errs.issued = true;
      if (!form.due) errs.due = true;
      setErrors(errs);
      if (Object.keys(errs).length) {
        showToast("Please fill in all required fields.", "error");
        return;
      }
      const validItems = lineItems.filter((i) => i.desc.trim());
      if (!validItems.length) {
        showToast("Add at least one line item.", "error");
        return;
      }

      setSaving(true);
      const input = {
        num: form.num.trim(),
        clientId: form.clientId,
        issued: form.issued,
        due: form.due,
        status: forceStatus || form.status,
        tax: parseFloat(form.tax) || 0,
        bank: form.bank,
        notes: form.notes,
        items: validItems,
      };

      const result = isEdit
        ? await updateInvoice(invoice!.id, input)
        : await createInvoice(input);

      setSaving(false);

      if ("error" in result) {
        showToast(result.error!, "error");
        return;
      }

      showToast(isEdit ? "Invoice updated" : "Invoice created");
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["invoice-stats"] });
      onClose();
    },
    [form, lineItems, isEdit, invoice, qc, onClose],
  );

  return (
    <div
      className="adm-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="adm-modal">
        <div className="adm-modal-hdr">
          <h3>{isEdit ? "Edit Invoice" : "New Invoice"}</h3>
          <button className="adm-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="adm-modal-body">
          <div className="adm-field-row">
            <div className={`adm-field${errors.num ? " invalid" : ""}`}>
              <label>
                Invoice # <span className="req">*</span>
              </label>
              <input
                type="text"
                value={form.num}
                onChange={(e) => setForm({ ...form, num: e.target.value })}
                placeholder="INV-001"
              />
              <div className="adm-err-msg">Required</div>
            </div>
            <div className={`adm-field${errors.clientId ? " invalid" : ""}`}>
              <label>
                Customer <span className="req">*</span>
              </label>
              <select
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              >
                <option value="">Select customer...</option>
                {(customers as Customer[]).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                    {c.company ? " — " + c.company : ""}
                  </option>
                ))}
              </select>
              <div className="adm-err-msg">Select a customer</div>
            </div>
          </div>

          <div className="adm-field-row">
            <div className={`adm-field${errors.issued ? " invalid" : ""}`}>
              <label>
                Issue Date <span className="req">*</span>
              </label>
              <input
                type="date"
                value={form.issued}
                onChange={(e) => setForm({ ...form, issued: e.target.value })}
              />
              <div className="adm-err-msg">Required</div>
            </div>
            <div className={`adm-field${errors.due ? " invalid" : ""}`}>
              <label>
                Due Date <span className="req">*</span>
              </label>
              <input
                type="date"
                value={form.due}
                onChange={(e) => setForm({ ...form, due: e.target.value })}
              />
              <div className="adm-err-msg">Required</div>
            </div>
          </div>

          <div className="adm-field-row">
            <div className="adm-field">
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Draft">Draft</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div className="adm-field">
              <label>Tax Rate (%)</label>
              <input
                type="number"
                value={form.tax}
                min={0}
                max={100}
                step={0.5}
                onChange={(e) => setForm({ ...form, tax: e.target.value })}
              />
            </div>
          </div>

          {/* Line items */}
          <div className="adm-field">
            <label>
              Line Items <span className="req">*</span>
            </label>
            <div className="line-items-wrap">
              <div className="li-header">
                <span>Description</span>
                <span>Qty</span>
                <span>Unit Price</span>
                <span style={{ textAlign: "right" }}>Amount</span>
                <span></span>
              </div>
              {lineItems.map((item, i) => (
                <div className="li-row" key={i}>
                  <input
                    type="text"
                    value={item.desc}
                    placeholder="Service description"
                    onChange={(e) => {
                      const next = [...lineItems];
                      next[i] = { ...next[i], desc: e.target.value };
                      setLineItems(next);
                    }}
                  />
                  <input
                    type="number"
                    value={item.qty}
                    min={1}
                    step={1}
                    onChange={(e) => {
                      const next = [...lineItems];
                      next[i] = { ...next[i], qty: +e.target.value };
                      setLineItems(next);
                    }}
                  />
                  <input
                    type="number"
                    value={item.price}
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    onChange={(e) => {
                      const next = [...lineItems];
                      next[i] = { ...next[i], price: +e.target.value };
                      setLineItems(next);
                    }}
                  />
                  <div
                    style={{
                      textAlign: "right",
                      fontSize: ".82rem",
                      fontWeight: 600,
                      paddingRight: 4,
                    }}
                  >
                    {fmt(item.qty * (item.price || 0))}
                  </div>
                  <button
                    className="li-del"
                    onClick={() => {
                      if (lineItems.length > 1)
                        setLineItems(lineItems.filter((_, idx) => idx !== i));
                    }}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              className="btn-ghost"
              onClick={() =>
                setLineItems([...lineItems, { desc: "", qty: 1, price: 0 }])
              }
              style={{
                width: "100%",
                marginTop: ".4rem",
                borderRadius: 8,
                padding: 6,
              }}
            >
              + Add Line Item
            </button>
            <div className="totals-block">
              <div className="total-line">
                <span>Subtotal</span>
                <span>{fmt(sub)}</span>
              </div>
              <div className="total-line">
                <span>Tax ({form.tax}%)</span>
                <span>{fmt(tax)}</span>
              </div>
              <div className="total-line grand">
                <span>Total Due</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
          </div>

          <div className="adm-field">
            <label>Payment / Bank Details (shown on invoice)</label>
            <textarea
              rows={2}
              value={form.bank}
              onChange={(e) => setForm({ ...form, bank: e.target.value })}
              placeholder="e.g. Bank: BRAC Bank | Account: 1234567890 | Routing: 0200..."
            />
          </div>
          <div className="adm-field">
            <label>Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Thank you message, payment terms, late fee policy..."
            />
          </div>
        </div>

        <div className="adm-modal-ftr">
          <button className="btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            className="btn-secondary"
            onClick={() => handleSave("Draft")}
            disabled={saving}
          >
            Save as Draft
          </button>
          <button
            className="btn-primary"
            onClick={() => handleSave()}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
}
