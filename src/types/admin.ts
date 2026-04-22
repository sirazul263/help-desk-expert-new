/* Shared types for the admin invoice system */

export interface InvoiceItem {
  id?: string;
  desc: string;
  qty: number;
  price: number;
}

export interface InvoiceClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  phone?: string | null;
}

export interface Invoice {
  id: string;
  num: string;
  clientId: string;
  issued: string | Date;
  due: string | Date;
  status: "Draft" | "Unpaid" | "Paid" | "Overdue";
  tax: number;
  bank: string;
  notes: string;
  items: InvoiceItem[];
  client: InvoiceClient;
  createdAt?: string | Date;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  isActive: boolean;
  createdAt: string | Date;
  _count: { invoices: number };
}

export interface InvoiceStats {
  totalBilled: number;
  collected: number;
  outstanding: number;
  overdueCount: number;
  paidCount: number;
  unpaidCount: number;
  totalCount: number;
}

/* ── Helpers ── */
export const fmt = (n: number) =>
  "$" +
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const fmtDate = (d: string | Date) => {
  if (!d) return "—";
  const str = typeof d === "string" ? d : d.toISOString().split("T")[0];
  return new Date(str + "T12:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const toDateStr = (d: string | Date) => {
  if (!d) return "";
  if (typeof d === "string") {
    if (d.includes("T")) return d.split("T")[0];
    return d;
  }
  return d.toISOString().split("T")[0];
};

export const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

export const avatarColors = [
  "rgba(255,92,53,.18)",
  "rgba(255,176,32,.18)",
  "rgba(100,150,255,.18)",
  "rgba(46,204,138,.18)",
  "rgba(212,83,126,.18)",
];

export const avatarTextColors = [
  "#FF5C35",
  "#FFB020",
  "#6496FF",
  "#2ECC8A",
  "#D4537E",
];

export const badgeClass: Record<string, string> = {
  Paid: "b-paid",
  Unpaid: "b-unpaid",
  Overdue: "b-overdue",
  Draft: "b-draft",
};

export function getInvTotal(inv: { items: InvoiceItem[]; tax: number }) {
  const sub = inv.items.reduce((s, i) => s + i.qty * (i.price || 0), 0);
  const tax = (sub * (inv.tax || 0)) / 100;
  return { sub, tax, total: sub + tax };
}

export function clientName(c: InvoiceClient) {
  return `${c.firstName} ${c.lastName}`;
}
