"use client";

import {
  fmt,
  fmtDate,
  getInvTotal,
  clientName,
  type Invoice,
} from "@/types/admin";

interface Props {
  invoice: Invoice;
  onClose: () => void;
}

const pillColor: Record<string, string> = {
  Paid: "#2ecc8a",
  Unpaid: "#ffb020",
  Overdue: "#ff5c35",
  Draft: "#999",
};

export default function InvoicePreview({ invoice, onClose }: Props) {
  const { sub, tax, total } = getInvTotal(invoice);

  const handlePrint = () => window.print();

  return (
    <div>
      <div className="preview-select-bar no-print">
        <button className="btn-ghost" onClick={onClose}>
          ← Back
        </button>
        <div>
          <button className="btn-primary" onClick={handlePrint}>
            Print / Download PDF
          </button>
        </div>
      </div>

      <div className="inv-doc" id="invoice-doc">
        {/* Header */}
        <div className="inv-doc-hdr">
          <div>
            <div className="inv-brand">
              HelpDesk<span>Expert</span>
            </div>
            <small className="inv-contact-info">
              www.helpdeskexpert.com
              <br />
              contact@helpdeskexpert.com
              <br />
              +1 (800) 555-0199
              <br />
              San Francisco, CA
            </small>
          </div>
          <div className="inv-meta-block">
            <div className="inv-num">INVOICE</div>
            <p>
              {invoice.num}
              <br />
              Issued: {fmtDate(invoice.issued)}
              <br />
              Due: {fmtDate(invoice.due)}
            </p>
            <span
              className="inv-status-pill"
              style={{
                background: pillColor[invoice.status] || "#999",
                color: "#fff",
              }}
            >
              {invoice.status}
            </span>
          </div>
        </div>

        {/* From / Bill To */}
        <div className="inv-parties">
          <div>
            <div className="inv-from-to">FROM</div>
            <div className="inv-party-name">HelpDesk Expert</div>
            <div className="inv-party-detail">
              Outsourced Support for SaaS
              <br />
              contact@helpdeskexpert.com
              <br />
              +1 (800) 555-0199
            </div>
          </div>
          <div>
            <div className="inv-from-to">BILL TO</div>
            <div className="inv-party-name">{clientName(invoice.client)}</div>
            <div className="inv-party-detail">
              {invoice.client.company && (
                <>
                  {invoice.client.company}
                  <br />
                </>
              )}
              {invoice.client.email}
              {invoice.client.phone && (
                <>
                  <br />
                  {invoice.client.phone}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Notes callout */}
        {invoice.notes && <div className="inv-note-block">{invoice.notes}</div>}

        {/* Items table */}
        <table className="inv-tbl">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th className="td-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((li, i) => (
              <tr key={i}>
                <td>{li.desc}</td>
                <td>{li.qty}</td>
                <td>{fmt(li.price)}</td>
                <td className="td-amt">{fmt(li.qty * li.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="inv-totals-wrap">
          <div className="inv-totals-inner">
            <div className="inv-total-row">
              <span>Subtotal</span>
              <span>{fmt(sub)}</span>
            </div>
            <div className="inv-total-row">
              <span>Tax ({invoice.tax}%)</span>
              <span>{fmt(tax)}</span>
            </div>
            <div className="inv-total-row grand-total">
              <span>Total Due</span>
              <span>{fmt(total)}</span>
            </div>
          </div>
        </div>

        {/* Bank / Payment Details */}
        {invoice.bank && (
          <div className="inv-bank-info">
            <strong>Payment Details</strong>
            <span style={{ whiteSpace: "pre-wrap" }}>{invoice.bank}</span>
          </div>
        )}

        {/* Footer */}
        <div className="inv-footer-bar">
          Thank you for your business! &middot; Payment due by{" "}
          {fmtDate(invoice.due)}
          <br />
          HelpDesk Expert &middot; www.helpdeskexpert.com &middot;
          hello@helpdeskexpert.com &middot; +1 (800) 555-0199
        </div>
      </div>
    </div>
  );
}
