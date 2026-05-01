"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const tocItems = [
  { id: "acceptance", label: "1. Acceptance" },
  { id: "services", label: "2. Our Services" },
  { id: "accounts", label: "3. Accounts" },
  { id: "payment", label: "4. Payment & Billing" },
  { id: "cancellation", label: "5. Cancellation" },
  { id: "acceptable-use", label: "6. Acceptable Use" },
  { id: "intellectual-property", label: "7. Intellectual Property" },
  { id: "confidentiality", label: "8. Confidentiality" },
  { id: "warranties", label: "9. Warranties" },
  { id: "liability", label: "10. Limitation of Liability" },
  { id: "indemnification", label: "11. Indemnification" },
  { id: "termination", label: "12. Termination" },
  { id: "disputes", label: "13. Disputes" },
  { id: "general", label: "14. General" },
  { id: "contact-us", label: "15. Contact" },
];

export default function TermsOfServicePage() {
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
            <span>Terms of Service</span>
          </div>
          <h1>
            Terms of <em>Service</em>
          </h1>
          <p className="hero-desc">
            These Terms govern your access to and use of HelpDeskXpert
            services. Please read them carefully before using our platform or
            engaging our agents.
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Governing law: California, USA
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
          <div className="legal-section" id="acceptance">
            <div className="section-num">Section 01</div>
            <h2>Acceptance of Terms</h2>
            <div className="highlight-box brand">
              <p>
                By accessing our website, creating an account, engaging our
                services, or signing a service agreement, you confirm that you
                have read, understood, and agree to be bound by these Terms of
                Service (&quot;Terms&quot;) and our{" "}
                <Link href="/privacy-policy">Privacy Policy</Link>. If you do
                not agree, you must not use our services.
              </p>
            </div>
            <p>
              These Terms constitute a legally binding agreement between you
              (&quot;Client&quot;, &quot;you&quot;, &quot;your&quot;) and{" "}
              <strong>HelpDeskXpert Ltd.</strong> (&quot;HelpDesk
              Expert&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
            </p>
            <p>
              If you are accepting these Terms on behalf of a company or other
              legal entity, you represent that you have the authority to bind
              that entity to these Terms. In that case, &quot;you&quot; refers
              to that entity.
            </p>
          </div>

          {/* 2 */}
          <div className="legal-section" id="services">
            <div className="section-num">Section 02</div>
            <h2>Our Services</h2>
            <p>
              HelpDeskXpert provides outsourced customer support agent
              services to SaaS and technology companies. Our services include,
              but are not limited to:
            </p>
            <ul>
              <li>
                Placement and management of dedicated customer support agents
              </li>
              <li>Live chat, email, and phone support staffing</li>
              <li>Technical support agent placement</li>
              <li>24/7 coverage and shift management</li>
              <li>
                Quality assurance, CSAT monitoring, and performance reporting
              </li>
              <li>Knowledge base creation and agent training</li>
              <li>Team scaling and surge coverage</li>
            </ul>

            <h3>Service levels</h3>
            <p>
              Specific service levels, deliverables, agent counts, and coverage
              hours are defined in the individual Service Order or Statement of
              Work agreed between you and HelpDeskXpert. These Terms apply to
              all such agreements.
            </p>

            <h3>CSAT guarantee</h3>
            <p>
              On Growth and Enterprise plans, if your average monthly CSAT score
              falls below 90%, we will replace your assigned agent within 5
              business days at no additional cost. This guarantee does not apply
              where the performance issue is caused by factors outside our
              control, including inaccurate knowledge base information provided
              by you or unreasonable customer expectations.
            </p>
          </div>

          {/* 3 */}
          <div className="legal-section" id="accounts">
            <div className="section-num">Section 03</div>
            <h2>Accounts &amp; Responsibilities</h2>

            <h3>Account creation</h3>
            <p>
              To access certain features of our platform (including the invoice
              system and agent dashboard), you must create an account. You agree
              to provide accurate, current, and complete information and to keep
              it updated.
            </p>

            <h3>Account security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your
              login credentials and for all activities that occur under your
              account. You must notify us immediately at{" "}
              <a href="mailto:security@helpdeskexpert.com">
                security@helpdeskexpert.com
              </a>{" "}
              if you suspect any unauthorised access.
            </p>

            <h3>Your obligations</h3>
            <p>To enable us to deliver our services, you agree to:</p>
            <ul>
              <li>
                Provide accurate onboarding information, including product
                documentation and knowledge base materials
              </li>
              <li>
                Grant our agents appropriate access to your helpdesk tools (e.g.
                Intercom, Zendesk) in a timely manner
              </li>
              <li>
                Respond to reasonable requests for clarification within 2
                business days
              </li>
              <li>
                Ensure your helpdesk environment complies with all applicable
                laws
              </li>
              <li>
                Not instruct our agents to engage in any unlawful, deceptive, or
                harmful activities
              </li>
            </ul>
          </div>

          {/* 4 */}
          <div className="legal-section" id="payment">
            <div className="section-num">Section 04</div>
            <h2>Payment &amp; Billing</h2>

            <h3>Fees and invoicing</h3>
            <p>
              Our fees are set out in your Service Order. Unless otherwise
              agreed, invoices are issued on the first business day of each
              month and are due within <strong>14 days of issue</strong>.
            </p>

            <h3>Late payments</h3>
            <p>
              Overdue invoices will incur interest at the rate of 1.5% per month
              (or the maximum permitted by law, whichever is lower) from the due
              date until paid. We reserve the right to suspend services if
              payment is more than 30 days overdue, with 7 days&apos; written
              notice.
            </p>

            <h3>Taxes</h3>
            <p>
              All fees are exclusive of applicable taxes (including VAT, GST, or
              sales tax). You are responsible for all taxes applicable to your
              purchase of our services.
            </p>

            <h3>Price changes</h3>
            <p>
              We reserve the right to modify our pricing with at least 30
              days&apos; written notice. If you do not accept the new pricing,
              you may cancel your subscription before the new pricing takes
              effect.
            </p>

            <h3>Refunds</h3>
            <p>
              All fees are non-refundable except where (a) we have materially
              failed to deliver agreed services, or (b) required by applicable
              law. Partial-month refunds are not provided on cancellation.
            </p>
          </div>

          {/* 5 */}
          <div className="legal-section" id="cancellation">
            <div className="section-num">Section 05</div>
            <h2>Cancellation &amp; Termination</h2>

            <h3>Cancellation by you</h3>
            <p>
              You may cancel your subscription at any time by providing{" "}
              <strong>30 days&apos; written notice</strong> to{" "}
              <a href="mailto:contact@helpdeskexpert.com">
                contact@helpdeskexpert.com
              </a>
              . You will continue to receive services and be billed during the
              notice period. No penalties apply for cancellation with proper
              notice.
            </p>

            <h3>Reducing agent count</h3>
            <p>
              You may reduce your agent count with 14 days&apos; written notice.
              Reductions take effect at the start of the next billing period.
            </p>

            <h3>Termination for cause</h3>
            <p>
              Either party may terminate the agreement immediately upon written
              notice if the other party:
            </p>
            <ul>
              <li>
                Materially breaches these Terms and fails to cure the breach
                within 14 days of written notice
              </li>
              <li>Becomes insolvent, enters bankruptcy, or is wound up</li>
              <li>Engages in fraudulent, illegal, or harmful conduct</li>
            </ul>

            <h3>Effect of termination</h3>
            <p>
              Upon termination, your access to our platform and agent services
              will cease. We will provide you with a data export of your account
              information within 30 days of termination, after which your data
              will be deleted in accordance with our Privacy Policy.
            </p>
          </div>

          {/* 6 */}
          <div className="legal-section" id="acceptable-use">
            <div className="section-num">Section 06</div>
            <h2>Acceptable Use</h2>
            <p>You must not use our services or instruct our agents to:</p>
            <ul>
              <li>
                Violate any applicable laws, regulations, or industry standards
              </li>
              <li>
                Engage in deceptive, fraudulent, or misleading customer
                communications
              </li>
              <li>
                Harass, abuse, threaten, or discriminate against any person
              </li>
              <li>
                Infringe the intellectual property rights of any third party
              </li>
              <li>Transmit malware, spam, or other harmful content</li>
              <li>
                Collect personal data without proper legal basis or consent
              </li>
              <li>
                Circumvent security measures or access systems without
                authorisation
              </li>
              <li>
                Engage in activities that damage the reputation of HelpDesk
                Expert
              </li>
            </ul>
            <div className="highlight-box warning">
              <p>
                Violation of these acceptable use requirements may result in
                immediate suspension of services without refund, and may expose
                you to legal liability.
              </p>
            </div>
          </div>

          {/* 7 */}
          <div className="legal-section" id="intellectual-property">
            <div className="section-num">Section 07</div>
            <h2>Intellectual Property</h2>

            <h3>Your content</h3>
            <p>
              You retain all ownership rights to your data, knowledge base
              content, brand assets, and materials you provide to us. You grant
              HelpDeskXpert a limited, non-exclusive licence to use these
              materials solely for the purpose of delivering our services to
              you.
            </p>

            <h3>Our content</h3>
            <p>
              HelpDeskXpert retains all rights to our platform, software,
              website, methodology, training materials, and agent management
              systems. These Terms do not grant you any rights to our
              intellectual property beyond what is necessary to receive our
              services.
            </p>

            <h3>Work product</h3>
            <p>
              Any work product created by our agents specifically for your
              account (such as custom response templates, knowledge base
              articles, or macros created on your behalf) becomes your property
              upon full payment of relevant invoices.
            </p>
          </div>

          {/* 8 */}
          <div className="legal-section" id="confidentiality">
            <div className="section-num">Section 08</div>
            <h2>Confidentiality</h2>
            <p>
              Each party agrees to keep confidential any non-public information
              disclosed by the other party that is designated as confidential or
              that should reasonably be understood to be confidential
              (&quot;Confidential Information&quot;).
            </p>
            <p>
              Confidential Information includes, without limitation, business
              plans, customer data, pricing, technical systems, and agent
              training materials. Neither party will disclose the other&apos;s
              Confidential Information to any third party without prior written
              consent, except:
            </p>
            <ul>
              <li>
                To employees or contractors who need to know it to perform
                obligations under these Terms and who are bound by
                confidentiality obligations at least as protective as these
              </li>
              <li>
                As required by applicable law or court order (with prompt notice
                where legally permissible)
              </li>
            </ul>
            <p>
              Confidentiality obligations survive termination of these Terms for
              a period of 3 years.
            </p>
          </div>

          {/* 9 */}
          <div className="legal-section" id="warranties">
            <div className="section-num">Section 09</div>
            <h2>Warranties &amp; Disclaimers</h2>

            <h3>Our warranties</h3>
            <p>HelpDeskXpert warrants that:</p>
            <ul>
              <li>
                We will perform our services with reasonable skill and care
              </li>
              <li>
                We will comply with all applicable laws in delivering our
                services
              </li>
              <li>
                Our agents will be trained to the standard described in your
                Service Order
              </li>
            </ul>

            <h3>Disclaimer</h3>
            <div className="highlight-box">
              <p>
                EXCEPT AS EXPRESSLY SET OUT IN THESE TERMS, OUR SERVICES ARE
                PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND. WE
                DISCLAIM ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR
                A PARTICULAR PURPOSE, AND NON-INFRINGEMENT TO THE MAXIMUM EXTENT
                PERMITTED BY LAW.
              </p>
            </div>
          </div>

          {/* 10 */}
          <div className="legal-section" id="liability">
            <div className="section-num">Section 10</div>
            <h2>Limitation of Liability</h2>
            <div className="highlight-box warning">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, HELPDESK
                EXPERT&apos;S TOTAL LIABILITY ARISING OUT OF OR RELATED TO THESE
                TERMS (WHETHER IN CONTRACT, TORT, OR OTHERWISE) SHALL NOT EXCEED
                THE TOTAL FEES PAID BY YOU IN THE THREE MONTHS PRECEDING THE
                CLAIM.
              </p>
            </div>
            <p>In no event will HelpDeskXpert be liable for:</p>
            <ul>
              <li>
                Loss of profits, revenue, goodwill, or anticipated savings
              </li>
              <li>Loss of data or business interruption</li>
              <li>Indirect, incidental, special, or consequential damages</li>
              <li>
                Any damage arising from events outside our reasonable control
                (force majeure)
              </li>
            </ul>
            <p>
              These limitations apply even if HelpDeskXpert has been advised
              of the possibility of such damages. Some jurisdictions do not
              allow certain limitations of liability, so these limitations may
              not apply to you in full.
            </p>
          </div>

          {/* 11 */}
          <div className="legal-section" id="indemnification">
            <div className="section-num">Section 11</div>
            <h2>Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless HelpDeskXpert
              and its officers, directors, employees, agents, and contractors
              from and against any claims, liabilities, damages, losses, and
              expenses (including reasonable legal fees) arising out of or
              related to:
            </p>
            <ul>
              <li>Your violation of these Terms</li>
              <li>Your violation of any applicable law or regulation</li>
              <li>
                Your infringement of any third-party intellectual property or
                privacy rights
              </li>
              <li>
                Any instructions you provide that cause our agents to act
                unlawfully or harmfully
              </li>
            </ul>
          </div>

          {/* 12 */}
          <div className="legal-section" id="termination">
            <div className="section-num">Section 12</div>
            <h2>Suspension of Services</h2>
            <p>
              We reserve the right to suspend your access to our platform or
              pause agent services, with or without notice, if:
            </p>
            <ul>
              <li>
                We believe your account has been compromised or used for
                fraudulent activity
              </li>
              <li>You are in material breach of these Terms</li>
              <li>Payment is overdue by more than 30 days</li>
              <li>Continued provision would expose us to legal liability</li>
            </ul>
            <p>
              We will make reasonable efforts to notify you before suspending
              services except where immediate suspension is required for
              security or legal reasons.
            </p>
          </div>

          {/* 13 */}
          <div className="legal-section" id="disputes">
            <div className="section-num">Section 13</div>
            <h2>Disputes &amp; Governing Law</h2>

            <h3>Governing law</h3>
            <p>
              These Terms are governed by and construed in accordance with the
              laws of the <strong>State of California, United States</strong>,
              without regard to its conflict of law provisions.
            </p>

            <h3>Dispute resolution</h3>
            <p>
              Before initiating any formal legal proceeding, both parties agree
              to attempt in good faith to resolve any dispute through direct
              negotiation for at least 30 days. If the dispute cannot be
              resolved informally, it shall be submitted to binding arbitration
              in San Francisco, California, under the rules of the American
              Arbitration Association.
            </p>

            <h3>Class action waiver</h3>
            <p>
              You agree that any dispute resolution proceedings will be
              conducted on an individual basis only. You waive any right to
              participate in class action lawsuits or class-wide arbitration
              against HelpDeskXpert.
            </p>
          </div>

          {/* 14 */}
          <div className="legal-section" id="general">
            <div className="section-num">Section 14</div>
            <h2>General Provisions</h2>

            <h3>Entire agreement</h3>
            <p>
              These Terms, together with any applicable Service Order,
              constitute the entire agreement between you and HelpDeskXpert
              and supersede all prior agreements relating to the subject matter.
            </p>

            <h3>Amendments</h3>
            <p>
              We may modify these Terms from time to time. We will provide at
              least 30 days&apos; notice of material changes via email or
              prominent notice on our website. Your continued use of our
              services after the effective date constitutes acceptance of the
              updated Terms.
            </p>

            <h3>Waiver and severability</h3>
            <p>
              Failure by either party to enforce any provision of these Terms
              will not constitute a waiver of future enforcement. If any
              provision is found invalid or unenforceable, the remaining
              provisions will continue in full force.
            </p>

            <h3>Assignment</h3>
            <p>
              You may not assign your rights or obligations under these Terms
              without our prior written consent. We may assign our rights and
              obligations to an affiliate or in connection with a merger or
              acquisition, with notice to you.
            </p>

            <h3>Force majeure</h3>
            <p>
              Neither party will be liable for any failure or delay in
              performance due to causes beyond their reasonable control,
              including acts of God, natural disasters, war, pandemics,
              government actions, or internet outages.
            </p>
          </div>

          {/* 15 */}
          <div className="legal-section" id="contact-us">
            <div className="section-num">Section 15</div>
            <h2>Contact Us</h2>
            <p>
              For questions about these Terms, please contact our legal team:
            </p>
            <div className="legal-contact-card">
              <h4>HelpDeskXpert — Legal Team</h4>
              <div className="contact-row">
                <svg viewBox="0 0 24 24">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a href="mailto:legal@helpdeskexpert.com">
                  legal@helpdeskexpert.com
                </a>
              </div>
              <div className="contact-row">
                <svg viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                San Francisco, CA — www.helpdeskexpert.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
