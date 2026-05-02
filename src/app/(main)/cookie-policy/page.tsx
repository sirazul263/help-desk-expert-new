"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Metadata } from "next";

const tocItems = [
  { id: "what-are-cookies", label: "1. What Are Cookies" },
  { id: "how-we-use", label: "2. How We Use Them" },
  { id: "essential", label: "3. Essential Cookies" },
  { id: "analytics", label: "4. Analytics Cookies" },
  { id: "marketing", label: "5. Marketing Cookies" },
  { id: "third-party", label: "6. Third-Party Cookies" },
  { id: "manage", label: "7. Manage Preferences" },
  { id: "browser-control", label: "8. Browser Controls" },
  { id: "changes", label: "9. Changes" },
  { id: "contact-us", label: "10. Contact" },
];

const PREFS_KEY = "hde_cookie_prefs";

interface CookiePrefs {
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  saved?: boolean;
  ts?: number;
}

function loadPrefs(): CookiePrefs | null {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePrefs(prefs: CookiePrefs) {
  localStorage.setItem(
    PREFS_KEY,
    JSON.stringify({ ...prefs, saved: true, ts: Date.now() }),
  );
}

export default function CookiePolicyPage() {
  const [activeId, setActiveId] = useState("");
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const prefs = loadPrefs();
    if (prefs?.saved) {
      setFunctional(!!prefs.functional);
      setAnalytics(!!prefs.analytics);
      setMarketing(!!prefs.marketing);
    }
  }, []);

  // TOC active highlighting
  useEffect(() => {
    const sections =
      document.querySelectorAll<HTMLElement>(".legal-section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const savePref = useCallback((f: boolean, a: boolean, m: boolean) => {
    savePrefs({ functional: f, analytics: a, marketing: m });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  }, []);

  const acceptAll = () => {
    setFunctional(true);
    setAnalytics(true);
    setMarketing(true);
    savePref(true, true, true);
  };

  const rejectAll = () => {
    setFunctional(false);
    setAnalytics(false);
    setMarketing(false);
    savePref(false, false, false);
  };

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
            <span>Cookie Policy</span>
          </div>
          <h1>
            Cookie <em>Policy</em>
          </h1>
          <p className="hero-desc">
            This policy explains what cookies we use, what they do, and how you
            can control them. You can update your preferences at any time using
            the consent manager below.
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              GDPR &amp; ePrivacy Compliant
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
          {/* Section 1 */}
          <div className="legal-section" id="what-are-cookies">
            <div className="section-num">Section 01</div>
            <h2>What Are Cookies?</h2>
            <div className="highlight-box brand">
              <p>
                Cookies are small text files that are placed on your device when
                you visit a website. They are widely used to make websites work
                more efficiently, to remember your preferences, and to provide
                information to website owners.
              </p>
            </div>
            <p>
              Alongside cookies, we may also use similar technologies such as{" "}
              <strong>web beacons</strong> (tiny transparent images),{" "}
              <strong>pixel tags</strong>, and <strong>local storage</strong>{" "}
              objects. For simplicity, we refer to all of these collectively as
              &quot;cookies&quot; in this policy.
            </p>
            <p>Cookies can be categorised as:</p>
            <ul>
              <li>
                <strong>Session cookies</strong> — temporary, deleted when you
                close your browser
              </li>
              <li>
                <strong>Persistent cookies</strong> — remain on your device for
                a set period or until you delete them
              </li>
              <li>
                <strong>First-party cookies</strong> — set by HelpDeskXpert
                directly
              </li>
              <li>
                <strong>Third-party cookies</strong> — set by external services
                we use
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="legal-section" id="how-we-use">
            <div className="section-num">Section 02</div>
            <h2>How We Use Cookies</h2>
            <p>
              We use cookies for four distinct purposes, each requiring a
              different level of consent:
            </p>
            <ul>
              <li>
                <strong>Essential:</strong> Required for the website to function
                — always active, no consent needed
              </li>
              <li>
                <strong>Functional:</strong> Remember your preferences
                (language, theme, chat settings)
              </li>
              <li>
                <strong>Analytics:</strong> Understand how visitors use our site
                — requires consent
              </li>
              <li>
                <strong>Marketing:</strong> Deliver relevant ads and track
                campaign performance — requires consent
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="legal-section" id="essential">
            <div className="section-num">Section 03</div>
            <h2>
              Essential Cookies{" "}
              <span className="required-tag">Always Active</span>
            </h2>
            <p>
              These cookies are strictly necessary for the website to work. They
              cannot be disabled in our system. They are usually set in response
              to actions you take, such as logging in or filling in forms.
            </p>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>access_token</code>
                  </td>
                  <td>httpOnly, Secure</td>
                  <td>7 days</td>
                  <td>
                    Stores your JWT access token for authentication. Cannot be
                    read by JavaScript.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>refresh_token</code>
                  </td>
                  <td>httpOnly, Secure</td>
                  <td>30 days</td>
                  <td>
                    Used to issue new access tokens without requiring you to
                    sign in again.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>hde_session</code>
                  </td>
                  <td>localStorage</td>
                  <td>Session</td>
                  <td>
                    Remembers your login session state across page refreshes.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>hde_cookie_consent</code>
                  </td>
                  <td>Persistent</td>
                  <td>1 year</td>
                  <td>Stores your cookie consent preferences.</td>
                </tr>
                <tr>
                  <td>
                    <code>XSRF-TOKEN</code>
                  </td>
                  <td>Session</td>
                  <td>Session</td>
                  <td>Prevents cross-site request forgery attacks.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4 */}
          <div className="legal-section" id="analytics">
            <div className="section-num">Section 04</div>
            <h2>
              Analytics Cookies{" "}
              <span className="optional-tag">Consent Required</span>
            </h2>
            <p>
              These cookies help us understand how visitors interact with our
              website by collecting anonymous, aggregated information. This
              helps us improve our content and user experience.
            </p>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Provider</th>
                  <th>Duration</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>_ga</code>
                  </td>
                  <td>Google Analytics</td>
                  <td>2 years</td>
                  <td>
                    Distinguishes unique users. Contains a randomly generated
                    ID.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>_ga_*</code>
                  </td>
                  <td>Google Analytics 4</td>
                  <td>2 years</td>
                  <td>Maintains session state for Google Analytics 4.</td>
                </tr>
                <tr>
                  <td>
                    <code>_gid</code>
                  </td>
                  <td>Google Analytics</td>
                  <td>24 hours</td>
                  <td>Identifies a user session.</td>
                </tr>
                <tr>
                  <td>
                    <code>_gat</code>
                  </td>
                  <td>Google Analytics</td>
                  <td>1 minute</td>
                  <td>Throttles request rate.</td>
                </tr>
                <tr>
                  <td>
                    <code>hde_analytics</code>
                  </td>
                  <td>HelpDeskXpert</td>
                  <td>26 months</td>
                  <td>
                    Our internal page view and session analytics (anonymised).
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              All analytics data we collect is anonymised before processing and
              is never linked to your personal identity. We have configured
              Google Analytics with IP anonymisation enabled.
            </p>
          </div>

          {/* Section 5 */}
          <div className="legal-section" id="marketing">
            <div className="section-num">Section 05</div>
            <h2>
              Marketing Cookies{" "}
              <span className="optional-tag">Consent Required</span>
            </h2>
            <p>
              These cookies are set by advertising partners to deliver targeted
              advertisements and measure the effectiveness of our campaigns.
              They may track your activity across other websites.
            </p>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Provider</th>
                  <th>Duration</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>_fbp</code>
                  </td>
                  <td>Meta (Facebook)</td>
                  <td>3 months</td>
                  <td>
                    Identifies browsers for retargeting on Facebook and
                    Instagram.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>li_fat_id</code>
                  </td>
                  <td>LinkedIn</td>
                  <td>30 days</td>
                  <td>
                    Member indirect identifier for LinkedIn ad conversion
                    tracking.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>_gcl_au</code>
                  </td>
                  <td>Google Ads</td>
                  <td>3 months</td>
                  <td>Used by Google AdSense for conversion tracking.</td>
                </tr>
                <tr>
                  <td>
                    <code>IDE</code>
                  </td>
                  <td>Google DoubleClick</td>
                  <td>1 year</td>
                  <td>Used for targeting and measuring ads across the web.</td>
                </tr>
              </tbody>
            </table>
            <p>
              If you decline marketing cookies, you will still see
              advertisements, but they will not be personalised based on your
              browsing behaviour.
            </p>
          </div>

          {/* Section 6 */}
          <div className="legal-section" id="third-party">
            <div className="section-num">Section 06</div>
            <h2>Third-Party Cookies</h2>
            <p>
              Some cookies on our site are set by third-party services that
              appear on our pages. We do not control these cookies. The
              following third-party services may set cookies:
            </p>
            <ul>
              <li>
                <strong>Google Analytics &amp; Ads</strong> — analytics and
                advertising
              </li>
              <li>
                <strong>Meta Pixel</strong> — advertising on Facebook and
                Instagram
              </li>
              <li>
                <strong>LinkedIn Insight Tag</strong> — B2B advertising
              </li>
              <li>
                <strong>Stripe</strong> — payment processing
              </li>
            </ul>
          </div>

          {/* Section 7 — Consent Manager */}
          <div className="legal-section" id="manage">
            <div className="section-num">Section 07</div>
            <h2>Manage Your Cookie Preferences</h2>
            <p>
              Use the consent manager below to update your cookie preferences at
              any time. Essential cookies cannot be disabled as they are
              required for the website to function.
            </p>

            <div className="consent-manager">
              <div className="cm-header">
                <div>
                  <h4>Cookie Preferences</h4>
                  <p>Manage which cookies you allow HelpDeskXpert to use.</p>
                </div>
                <div className="cm-actions">
                  <button className="cm-btn cm-btn-reject" onClick={rejectAll}>
                    Reject All Optional
                  </button>
                  <button className="cm-btn cm-btn-accept" onClick={acceptAll}>
                    Accept All
                  </button>
                </div>
              </div>

              <div className="cm-row">
                <div className="cm-row-info">
                  <div className="cm-row-title">
                    Essential Cookies{" "}
                    <span className="required-tag">Required</span>
                  </div>
                  <div className="cm-row-desc">
                    Authentication, security, and core functionality. Cannot be
                    disabled.
                  </div>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked disabled />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="cm-row">
                <div className="cm-row-info">
                  <div className="cm-row-title">Functional Cookies</div>
                  <div className="cm-row-desc">
                    Remember your preferences such as language, theme, and chat
                    settings across sessions.
                  </div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={functional}
                    onChange={(e) => {
                      setFunctional(e.target.checked);
                      savePref(e.target.checked, analytics, marketing);
                    }}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="cm-row">
                <div className="cm-row-info">
                  <div className="cm-row-title">Analytics Cookies</div>
                  <div className="cm-row-desc">
                    Help us understand how visitors use our site. All data is
                    anonymised and aggregated.
                  </div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => {
                      setAnalytics(e.target.checked);
                      savePref(functional, e.target.checked, marketing);
                    }}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="cm-row">
                <div className="cm-row-info">
                  <div className="cm-row-title">Marketing Cookies</div>
                  <div className="cm-row-desc">
                    Allow personalised advertising on platforms like LinkedIn,
                    Google, and Facebook.
                  </div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => {
                      setMarketing(e.target.checked);
                      savePref(functional, analytics, e.target.checked);
                    }}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {showSaved && (
                <div className="cm-saved">
                  <svg viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Your preferences have been saved.
                </div>
              )}
            </div>
          </div>

          {/* Section 8 */}
          <div className="legal-section" id="browser-control">
            <div className="section-num">Section 08</div>
            <h2>Browser-Level Cookie Controls</h2>
            <p>
              Most browsers allow you to manage cookies through their settings.
              You can typically:
            </p>
            <ul>
              <li>View all cookies stored on your device</li>
              <li>Delete cookies individually or all at once</li>
              <li>Block cookies from specific websites</li>
              <li>Block all third-party cookies</li>
              <li>Set up private or incognito browsing</li>
            </ul>
            <p>
              Please note that disabling or deleting certain cookies may affect
              the functionality of our website, including your ability to stay
              logged in to your account.
            </p>
          </div>

          {/* Section 9 */}
          <div className="legal-section" id="changes">
            <div className="section-num">Section 09</div>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect
              changes in our use of cookies, technology, or applicable law. We
              will update the &quot;Last updated&quot; date at the top of this
              page when we make changes.
            </p>
            <p>
              If we make significant changes that affect your rights, we will
              notify you by email or through a prominent notice on our website.
              We recommend checking this page periodically to stay informed.
            </p>
          </div>

          {/* Section 10 */}
          <div className="legal-section" id="contact-us">
            <div className="section-num">Section 10</div>
            <h2>Contact Us</h2>
            <p>
              If you have questions about our use of cookies or this policy,
              please contact us:
            </p>
            <div className="legal-contact-card">
              <h4>HelpDeskXpert — Privacy Team</h4>
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
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                www.helpdeskexpert.com
              </div>
            </div>
            <p style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
              You can also learn more about your rights and how to exercise them
              in our <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
