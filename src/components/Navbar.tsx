"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

type NavUser = {
  name?: string;
  image?: string;
  role: string;
};

export default function Navbar({ user }: { user?: NavUser | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardHref = user?.role === "ADMIN" ? "/admin" : "/dashboard";
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  return (
    <nav>
      <Link href="/" className="logo">
        HelpDesk<span className="text-brand">Xpert</span>
      </Link>

      <ul className="hidden nav-links">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`text-[0.9rem] transition-colors duration-200 ${
                pathname === item.href
                  ? "text-text"
                  : "text-muted hover:text-text"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="nav-ctas">
        {user ? (
          <Link
            href={dashboardHref}
            className="flex items-center gap-2 pl-1 pr-4 py-1 border border-border rounded-full bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "User"}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="w-8 h-8 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0">
                {initials}
              </span>
            )}
            <span className="text-[0.85rem] font-medium text-text whitespace-nowrap">
              {user.name}
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="btn-ghost py-3">
              Log In
            </Link>

            <Link href="/contact" className="btn-primary">
              Get Started
            </Link>
          </div>
        )}
        <button
          className="md:hidden nav-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-dark border-b border-border p-6 md:hidden z-50"
          >
            <ul className="list-none flex flex-col gap-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-[0.9rem] transition-colors duration-200 ${
                      pathname === item.href
                        ? "text-text"
                        : "text-muted hover:text-text"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
