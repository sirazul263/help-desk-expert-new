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
        <p>www.helpdeskexpert.com</p>
      </div>
    </footer>
  );
}
