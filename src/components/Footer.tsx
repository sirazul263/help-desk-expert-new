import Link from "next/link";

const serviceLinks = [
  { href: "/services?key=live-chat", label: "Live Chat Support" },
  { href: "/services?key=email-tickets", label: "Email & Tickets" },
  { href: "/services?key=technical-support", label: "Technical Support" },
  { href: "/services?key=24-7-coverage", label: "24/7 Coverage" },
  { href: "/services?key=team-scaling", label: "Team Scaling" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/cookie-policy", label: "Cookie Policy" },
];

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <Link href="/" className="logo">
            HelpDesk<span>Expert</span>
          </Link>
          <p>
            World-class outsourced customer support agents for SaaS companies.
            Fast, reliable, and built to scale.
          </p>
        </div>
        <div className="footer-col">
          <h4 className="font-bold">Services</h4>
          <ul>
            {serviceLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="font-bold">Company</h4>
          <ul>
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="font-bold">Legal</h4>
          <ul>
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 HelpDesk Expert. All rights reserved.</p>
        <div className="footer-socials">
          <a
            href="https://web.facebook.com/HelpDeskXpert"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
            aria-label="Facebook"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            Facebook
          </a>
          <a
            href="https://www.linkedin.com/company/help-desk-xpert"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
