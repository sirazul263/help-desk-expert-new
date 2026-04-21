"use client";

import Link from "next/link";
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

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav>
      <Link href="/" className="logo">
        HelpDesk<span className="text-brand">Expert</span>
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
        <Link href="/login" className="btn-ghost">
          Log In
        </Link>
        <Link href="/contact" className="btn-primary">
          Get Started
        </Link>
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
