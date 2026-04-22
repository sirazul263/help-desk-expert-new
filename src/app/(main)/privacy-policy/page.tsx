"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const tocItems = [
  { id: "overview", label: "1. Overview" },
  { id: "data-we-collect", label: "2. Data We Collect" },
  { id: "how-we-use", label: "3. How We Use Data" },
  { id: "sharing", label: "4. Data Sharing" },
  { id: "cookies", label: "5. Cookies" },
  { id: "retention", label: "6. Data Retention" },
  { id: "security", label: "7. Security" },
  { id: "your-rights", label: "8. Your Rights" },
  { id: "children", label: "9. Children's Privacy" },
  { id: "transfers", label: "10. International Transfers" },
  { id: "changes", label: "11. Changes to Policy" },
  { id: "contact-us", label: "12. Contact Us" },
];

export default function PrivacyPolicyPage() {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const sections =
      document.querySelectorAll<HTMLElement>(".legal-section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero */}
      <div className="legal-hero">
        <motion.div
          style={{ maxWidth: 1100, margin: "0 auto" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="crumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Privacy Policy</span>
          </div>
          <h1>
            Privacy <em>Policy</em>
          </h1>
          <p className="hero-desc">
            We take your privacy seriously. This policy explains what data we
            collect, why we collect it, how we use it, and your rights over it.
          </p>
          <div className="meta-row">
            <div className="meta-pill">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Last updated: 22 April 2026
            </div>
            <div className="meta-pill">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Effective: 22 April 2026
            </div>
            <div className="meta-pill">
              <svg viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              GDPR &amp; CCPA Compliant
            </div>
          </div>
        </motion.div>
      </div>

      {/* Layout */}
      <div className="legal-layout">
        <aside className="sidebar-nav">
          <div className="toc-title">Contents</div>
          <ul className="toc-list">
            {tocItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={activeId === item.id ? "active" : ""}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="legal-content">
          {/* 1 */}
          <div className="legal-section" id="overview">
            <div className="section-num">Section 01</div>
            <h2>Overview</h2>
            <div className="highlight-box brand">
              <p>
                HelpDesk Expert (&quot;we&quot;, &quot;us&quot;,
                &quot;our&quot;) is committed to protecting your personal
                information. This Privacy Policy applies to all services offered
                at <strong>www.helpdeskexpert.com</strong> and explains how we
                handle data in compliance with the General Data Protection
                Regulation (GDPR), the California Consumer Privacy Act (CCPA),
                and other applicable laws.
              </p>
            </div>
            <p>
              By accessing or using our website, services, or live chat, you
              acknowledge that you have read and understood this Privacy Policy.
              If you do not agree with the practices described here, please do
              not use our services.
            </p>
            <p>
              The data controller responsible for your personal information is:
            </p>
            <div className="highlight-box">
              <p>
                <strong>HelpDesk Expert Ltd.</strong>
                <br />
                www.helpdeskexpert.com
                <br />
                hello@helpdeskexpert.com
                <br />
                +1 (800) 555-0199
              </p>
            </div>
          </div>

          {/* 2 */}
          <div className="legal-section" id="data-we-collect">
            <div className="section-num">Section 02</div>
            <h2>Data We Collect</h2>
            <p>
              We collect personal data in several ways depending on how you
              interact with us:
            </p>

            <h3>Information you provide directly</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Data Type</th>
                  <th>Examples</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Identity data</td>
                  <td>First name, last name, job title</td>
                  <td>Account creation, communication</td>
                </tr>
                <tr>
                  <td>Contact data</td>
                  <td>Email address, phone number, company</td>
                  <td>Service delivery, invoicing</td>
                </tr>
                <tr>
                  <td>Account data</td>
                  <td>Username, password (hashed)</td>
                  <td>Authentication and security</td>
                </tr>
                <tr>
                  <td>Transaction data</td>
                  <td>Invoice details, payment amounts</td>
                  <td>Billing and financial records</td>
                </tr>
                <tr>
                  <td>Communication data</td>
                  <td>Live chat messages, support emails</td>
                  <td>Customer support, quality assurance</td>
                </tr>
                <tr>
                  <td>Preference data</td>
                  <td>Support channel, service tier</td>
                  <td>Service personalisation</td>
                </tr>
              </tbody>
            </table>

            <h3>Information collected automatically</h3>
            <ul>
              <li>IP address and approximate geographic location</li>
              <li>Browser type, version, and device information</li>
              <li>Pages visited, time on page, and navigation paths</li>
              <li>Referring URLs and search terms</li>
              <li>
                Session identifiers and authentication tokens (stored in
                httpOnly cookies)
              </li>
            </ul>

            <h3>Information from third parties</h3>
            <p>
              We may receive information about you from referral partners,
              analytics providers, and publicly available sources (such as
              LinkedIn for business development purposes).
            </p>
          </div>

          {/* 3 */}
          <div className="legal-section" id="how-we-use">
            <div className="section-num">Section 03</div>
            <h2>How We Use Your Data</h2>
            <p>
              We process your personal data under the following legal bases:
            </p>

            <h3>Contract performance</h3>
            <ul>
              <li>
                Delivering and managing your outsourced support agent services
              </li>
              <li>Creating and sending invoices and billing records</li>
              <li>Managing your account, login, and access credentials</li>
              <li>Providing live chat and customer support</li>
            </ul>

            <h3>Legitimate interests</h3>
            <ul>
              <li>Improving and optimising our website and service quality</li>
              <li>Preventing fraud, abuse, and security threats</li>
              <li>Conducting internal analytics and performance reporting</li>
              <li>Sending service-related updates and notifications</li>
            </ul>

            <h3>Consent (where required)</h3>
            <ul>
              <li>Sending marketing emails and promotional content</li>
              <li>Placing non-essential cookies on your device</li>
              <li>
                Using your testimonial or case study in our marketing materials
              </li>
            </ul>

            <h3>Legal obligation</h3>
            <ul>
              <li>Complying with applicable laws and regulations</li>
              <li>Responding to lawful requests from authorities</li>
              <li>Retaining financial records for tax and audit purposes</li>
            </ul>
          </div>

          {/* 4 */}
          <div className="legal-section" id="sharing">
            <div className="section-num">Section 04</div>
            <h2>Data Sharing</h2>
            <p>
              We do not sell, rent, or trade your personal information to third
              parties for marketing purposes. We may share your data only in the
              following circumstances:
            </p>

            <h3>Service providers (processors)</h3>
            <p>
              We share data with trusted third-party providers who process it on
              our behalf under strict data processing agreements:
            </p>
            <ul>
              <li>
                <strong>Infrastructure:</strong> Cloud hosting (servers,
                databases, backups)
              </li>
              <li>
                <strong>Communication:</strong> Email delivery services
                (transactional emails only)
              </li>
              <li>
                <strong>Analytics:</strong> Anonymised website analytics
                providers
              </li>
              <li>
                <strong>Payments:</strong> Payment processors (we do not store
                full card numbers)
              </li>
            </ul>

            <h3>Business transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your
              data may be transferred as part of that transaction. We will
              notify you via email and/or a prominent notice on our website
              before any such transfer.
            </p>

            <h3>Legal requirements</h3>
            <p>
              We may disclose your data if required by law, court order, or
              governmental authority, or if we believe in good faith that
              disclosure is necessary to protect our rights, your safety, or the
              safety of others.
            </p>
          </div>

          {/* 5 */}
          <div className="legal-section" id="cookies">
            <div className="section-num">Section 05</div>
            <h2>Cookies</h2>
            <p>
              We use cookies and similar tracking technologies on our website.
              For full details of every cookie we use, please read our{" "}
              <Link href="/cookie-policy">Cookie Policy</Link>.
            </p>
            <p>In summary, we use:</p>
            <ul>
              <li>
                <strong>Essential cookies:</strong> Required for login sessions
                and security — cannot be disabled
              </li>
              <li>
                <strong>Analytics cookies:</strong> Help us understand how
                visitors use our site — disabled by default
              </li>
              <li>
                <strong>Marketing cookies:</strong> Used for retargeting and ad
                measurement — disabled by default, require consent
              </li>
            </ul>
            <p>
              You can manage your cookie preferences at any time through the
              cookie consent banner or your browser settings.
            </p>
          </div>

          {/* 6 */}
          <div className="legal-section" id="retention">
            <div className="section-num">Section 06</div>
            <h2>Data Retention</h2>
            <p>
              We retain your personal data only for as long as necessary for the
              purposes described in this policy, unless a longer retention
              period is required by law.
            </p>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Data Category</th>
                  <th>Retention Period</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Account data</td>
                  <td>Duration of contract + 2 years</td>
                  <td>Account management</td>
                </tr>
                <tr>
                  <td>Invoice &amp; billing records</td>
                  <td>7 years</td>
                  <td>Legal / tax compliance</td>
                </tr>
                <tr>
                  <td>Chat transcripts</td>
                  <td>1 year</td>
                  <td>Quality assurance</td>
                </tr>
                <tr>
                  <td>Marketing data</td>
                  <td>Until consent withdrawn</td>
                  <td>Consent-based</td>
                </tr>
                <tr>
                  <td>Website analytics</td>
                  <td>26 months</td>
                  <td>Anonymised, aggregated</td>
                </tr>
                <tr>
                  <td>Security &amp; access logs</td>
                  <td>90 days</td>
                  <td>Fraud prevention</td>
                </tr>
              </tbody>
            </table>
            <p>
              When data is no longer required, it is securely deleted or
              anonymised so it can no longer be linked to you.
            </p>
          </div>

          {/* 7 */}
          <div className="legal-section" id="security">
            <div className="section-num">Section 07</div>
            <h2>Security</h2>
            <p>
              We implement industry-standard technical and organisational
              security measures to protect your personal data against
              unauthorised access, loss, destruction, or alteration:
            </p>
            <ul>
              <li>
                All passwords are hashed using bcrypt with 12+ rounds — we never
                store plaintext passwords
              </li>
              <li>
                Authentication tokens are stored in httpOnly, Secure, SameSite
                cookies
              </li>
              <li>All data is transmitted over TLS/HTTPS encryption</li>
              <li>
                Access to production systems is restricted to authorised
                personnel only
              </li>
              <li>
                We conduct regular security audits and vulnerability assessments
              </li>
              <li>Data backups are encrypted at rest</li>
            </ul>
            <p>
              Despite these measures, no method of transmission over the
              internet or electronic storage is 100% secure. If you become aware
              of any security issue, please contact us immediately at{" "}
              <a href="mailto:security@helpdeskexpert.com">
                security@helpdeskexpert.com
              </a>
              .
            </p>
          </div>

          {/* 8 */}
          <div className="legal-section" id="your-rights">
            <div className="section-num">Section 08</div>
            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have the following rights
              regarding your personal data:
            </p>

            <h3>For EU/UK residents (GDPR)</h3>
            <ul>
              <li>
                <strong>Right of access</strong> — request a copy of the
                personal data we hold about you
              </li>
              <li>
                <strong>Right to rectification</strong> — request correction of
                inaccurate or incomplete data
              </li>
              <li>
                <strong>Right to erasure</strong> (&quot;right to be
                forgotten&quot;) — request deletion of your data where there is
                no compelling reason for us to continue processing it
              </li>
              <li>
                <strong>Right to restrict processing</strong> — request that we
                limit how we use your data
              </li>
              <li>
                <strong>Right to data portability</strong> — receive your data
                in a structured, machine-readable format
              </li>
              <li>
                <strong>Right to object</strong> — object to processing based on
                legitimate interests or for direct marketing
              </li>
              <li>
                <strong>Rights related to automated decision-making</strong> —
                we do not make solely automated decisions that significantly
                affect you
              </li>
            </ul>

            <h3>For California residents (CCPA)</h3>
            <ul>
              <li>
                Right to know what personal information we collect and how it is
                used
              </li>
              <li>Right to delete personal information we have collected</li>
              <li>
                Right to opt out of the sale of personal information (we do not
                sell data)
              </li>
              <li>
                Right to non-discrimination for exercising your privacy rights
              </li>
            </ul>

            <p>
              To exercise any of these rights, please email us at{" "}
              <a href="mailto:privacy@helpdeskexpert.com">
                privacy@helpdeskexpert.com
              </a>
              . We will respond within 30 days (or within the timeframe required
              by applicable law).
            </p>
          </div>

          {/* 9 */}
          <div className="legal-section" id="children">
            <div className="section-num">Section 09</div>
            <h2>Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 16.
              We do not knowingly collect personal information from children. If
              you believe we have inadvertently collected data from a child,
              please contact us immediately and we will delete it promptly.
            </p>
          </div>

          {/* 10 */}
          <div className="legal-section" id="transfers">
            <div className="section-num">Section 10</div>
            <h2>International Data Transfers</h2>
            <p>
              HelpDesk Expert operates globally. Your personal data may be
              transferred to and processed in countries other than your own.
              When we transfer personal data outside the European Economic Area
              (EEA) or UK, we ensure appropriate safeguards are in place,
              including:
            </p>
            <ul>
              <li>
                Standard Contractual Clauses (SCCs) approved by the European
                Commission
              </li>
              <li>
                Adequacy decisions for countries with equivalent data protection
                standards
              </li>
              <li>Data Processing Agreements with all sub-processors</li>
            </ul>
          </div>

          {/* 11 */}
          <div className="legal-section" id="changes">
            <div className="section-num">Section 11</div>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we make
              significant changes, we will:
            </p>
            <ul>
              <li>
                Update the &quot;Last updated&quot; date at the top of this page
              </li>
              <li>Send an email notification to registered account holders</li>
              <li>
                Display a banner on our website for 30 days after the update
              </li>
            </ul>
            <p>
              We encourage you to review this page periodically. Your continued
              use of our services after any changes constitutes acceptance of
              the updated policy.
            </p>
          </div>

          {/* 12 */}
          <div className="legal-section" id="contact-us">
            <div className="section-num">Section 12</div>
            <h2>Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or your personal data, please reach out to us:
            </p>
            <div className="legal-contact-card">
              <h4>HelpDesk Expert — Privacy Team</h4>
              <div className="contact-row">
                <svg viewBox="0 0 24 24">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a href="mailto:privacy@helpdeskexpert.com">
                  privacy@helpdeskexpert.com
                </a>
              </div>
              <div className="contact-row">
                <svg viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 12 19.79 19.79 0 01.22 3.4 2 2 0 012.18 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.72 6.72l1.48-1.48a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                +1 (800) 555-0199
              </div>
              <div className="contact-row">
                <svg viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                San Francisco, CA — www.helpdeskexpert.com
              </div>
            </div>
            <p style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
              You also have the right to lodge a complaint with your local data
              protection authority. For EU residents, this is your national
              supervisory authority. For UK residents, this is the Information
              Commissioner&apos;s Office (ICO) at{" "}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
              >
                ico.org.uk
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
