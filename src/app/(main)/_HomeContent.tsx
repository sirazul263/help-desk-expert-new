"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Clock,
  Phone,
  Users,
  Activity,
  Check,
  Star,
  X,
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import CtaBand from "@/components/CtaBand";

type Review = {
  id: string;
  rating: number;
  quote: string;
  role: string;
  createdAt: string;
  user: { firstName: string; lastName: string; image: string | null };
};

const services = [
  {
    icon: MessageSquare,
    title: "Live Chat Support",
    desc: "Real-time agents handling live chat with fast response times and high CSAT scores.",
  },
  {
    icon: Mail,
    title: "Email & Ticket Management",
    desc: "Structured inbox management with SLA adherence and escalation workflows.",
  },
  {
    icon: Clock,
    title: "24/7 Coverage",
    desc: "Round-the-clock agents across time zones so your users are never left waiting.",
  },
  {
    icon: Phone,
    title: "Technical Support Agents",
    desc: "SaaS-specialized agents who handle API questions and developer queries.",
  },
  {
    icon: Users,
    title: "Team Scaling",
    desc: "Ramp your support headcount up or down in days — perfect for launches and growth spurts.",
  },
  {
    icon: Activity,
    title: "QA & Reporting",
    desc: "Weekly performance reports, CSAT tracking, and QA reviews to keep your bar high.",
  },
];

const steps = [
  { num: "01", title: "Tell Us Your Needs", desc: "Share your tools, volume, and support requirements." },
  { num: "02", title: "We Match Your Agent", desc: "Best-fit agent selected from our trained SaaS pool." },
  { num: "03", title: "Onboard in 48h", desc: "Agent trained on your product, tone, and workflows." },
  { num: "04", title: "Go Live & Scale", desc: "Start handling tickets. Add more agents as you grow." },
];

const whyCards = [
  { title: "SaaS-Native Training", desc: "Agents trained in Intercom, Zendesk, HubSpot, and Jira before joining your team.", featured: true },
  { title: "Dedicated Account Manager", desc: "A real human point of contact who manages your agents and keeps quality high.", featured: false },
  { title: "No Long-Term Contracts", desc: "Flexible month-to-month agreements. Scale up, down, or pause any time.", featured: false },
  { title: "Churn-Reduction Focus", desc: "Agents trained to spot at-risk users and proactively engage to improve retention.", featured: true },
];

const AVATAR_COLORS = [
  "bg-[rgba(255,92,53,0.2)] text-brand",
  "bg-[rgba(255,176,32,0.2)] text-brand2",
  "bg-[rgba(100,150,255,0.2)] text-[#6496ff]",
  "bg-[rgba(46,204,138,0.2)] text-success",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-[1.5rem] leading-none transition-colors"
          style={{ color: star <= (hovered || value) ? "#ffb020" : "var(--border)" }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewModal({
  onClose,
  onSubmitted,
}: {
  onClose: () => void;
  onSubmitted: (review: Review) => void;
}) {
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (quote.trim().length < 10) {
      setError("Please write at least 10 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, quote: quote.trim(), role: role.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Something went wrong.");
        return;
      }
      onSubmitted(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative bg-card border border-border rounded-[18px] p-8 w-full max-w-md shadow-2xl z-10"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-[1.2rem] font-bold mb-1">Share your experience</h3>
        <p className="text-[0.85rem] text-muted mb-6">
          Your review helps other SaaS teams make a confident decision.
        </p>

        <div className="mb-5">
          <label className="block text-[0.8rem] font-semibold mb-2 uppercase tracking-wide text-muted">
            Your rating
          </label>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div className="mb-4">
          <label className="block text-[0.8rem] font-semibold mb-2 uppercase tracking-wide text-muted">
            Your review <span className="text-brand">*</span>
          </label>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={4}
            placeholder="Tell us how HelpDeskXpert has helped your team..."
            className="w-full bg-input-bg border border-input-border rounded-lg px-4 py-3 text-[0.9rem] text-text outline-none resize-none focus:border-[rgba(255,92,53,0.5)] transition-colors"
          />
        </div>

        <div className="mb-6">
          <label className="block text-[0.8rem] font-semibold mb-2 uppercase tracking-wide text-muted">
            Your role / company
          </label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Head of CX, Acme Inc."
            className="w-full bg-input-bg border border-input-border rounded-lg px-4 py-3 text-[0.9rem] text-text outline-none focus:border-[rgba(255,92,53,0.5)] transition-colors"
          />
        </div>

        {error && (
          <p className="text-error text-[0.82rem] mb-4">{error}</p>
        )}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-brand text-white font-semibold text-[0.9rem] hover:bg-brand/90 transition-colors disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </motion.div>
    </div>
  );
}

export default function HomeContent({
  reviews: initialReviews,
  isLoggedIn,
  hasReviewed,
}: {
  reviews: Review[];
  isLoggedIn: boolean;
  hasReviewed: boolean;
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReviewSubmitted = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
    setShowModal(false);
    setSubmitted(true);
  };

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <ReviewModal
            onClose={() => setShowModal(false)}
            onSubmitted={handleReviewSubmitted}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero */}
        <section className="hero">
          <div className="badge">
            <span className="badge-dot"> </span>Trusted by 200+ SaaS Companies
          </div>
          <h1>
            World-Class Support Agents,{" "}
            <em className="not-italic text-brand">On Demand</em>
          </h1>
          <p>
            We place expert customer support agents into your SaaS team — fully
            trained, managed, and ready to delight your users from day one.
          </p>
          <div className="hero-ctas">
            <Link href="/contact" className="btn-lg btn-primary-lg">
              Book a Free Consultation
            </Link>
            <Link href="/how-it-works" className="btn-lg btn-outline-lg">
              See How It Works
            </Link>
          </div>
          <div className="hero-stats">
            {[
              { value: "2,000+", label: "Agents Placed" },
              { value: "98%", label: "Client Retention" },
              { value: "<48h", label: "Agent Onboarding" },
              { value: "4.9★", label: "Average CSAT" },
            ].map((stat) => (
              <div key={stat.label} className="stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      </motion.div>

      {/* Logo Strip */}
      <div className="logos-strip">
        <p>Powering support for fast-growing SaaS brands</p>
        <div className="logos-row">
          {["STREAMLY", "CODEPATH", "NOVU", "TAPSTACK", "DRIFTLY", "FORMBASE"].map((name) => (
            <span key={name} className="logo-pill">{name}</span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section className="section">
        <SectionHeader
          label="Our Services"
          title="Everything your support team needs"
          subtitle="From tier-1 ticket handling to technical escalations — we have the right agent for every role."
        />
        <div className="services-grid">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="card"
            >
              <div className="card-icon">
                <svc.icon className="w-[22px] h-[22px] text-brand" strokeWidth={1.8} />
              </div>
              <h3 className="text-[1.05rem] font-semibold mb-[0.4rem]">{svc.title}</h3>
              <p className="text-[0.875rem] text-muted leading-[1.6]">{svc.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/services" className="btn-lg btn-outline-lg">
            View All Services →
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="section section-alt">
        <SectionHeader
          label="How It Works"
          title="Up and running in under 48 hours"
          subtitle="We handle everything from matching to onboarding so you can focus on building your product."
        />
        <div className="how-steps">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="how-step"
            >
              {i < steps.length - 1 && (
                <span className="hidden lg:block absolute right-[-0.5rem] top-1/2 -translate-y-1/2 text-brand text-[1.2rem]">
                  →
                </span>
              )}
              <div className="step-num">{step.num}</div>
              <h3 className="text-[0.975rem] font-semibold mb-[0.4rem]">{step.title}</h3>
              <p className="text-[0.82rem] text-muted leading-[1.6]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/how-it-works" className="btn-lg btn-primary-lg">
            Learn More →
          </Link>
        </div>
      </section>

      {/* Why HelpDeskXpert */}
      <section className="section">
        <SectionHeader
          label="Why HelpDeskXpert"
          title="Built specifically for SaaS teams"
          subtitle="We understand the unique demands of tech companies — from API support to churn prevention."
        />
        <div className="why-grid">
          {whyCards.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className={`why-card ${card.featured ? "featured" : ""}`}
            >
              <div className="check rounded-full h-5 w-5 font-bold text-center text-brand flex justify-center items-center">
                <Check className="w-3 h-3 mx-auto mt-1" />
              </div>
              <h3 className="text-[1rem] font-semibold mb-[0.4rem]">{card.title}</h3>
              <p className="text-[0.875rem] text-muted leading-[1.6]">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials / Reviews */}
      <section className="section section-alt">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <SectionHeader
            label="Success Stories"
            title="What our clients say"
          />
          {isLoggedIn && !hasReviewed && !submitted && (
            <button
              onClick={() => setShowModal(true)}
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(255,92,53,0.4)] text-brand text-[0.875rem] font-semibold hover:bg-[rgba(255,92,53,0.08)] transition-colors"
            >
              <Star className="w-4 h-4" />
              Share Your Experience
            </button>
          )}
          {submitted && (
            <span className="text-success text-[0.85rem] font-semibold shrink-0">
              ✓ Thanks for your review!
            </span>
          )}
          {isLoggedIn && hasReviewed && !submitted && (
            <span className="text-muted text-[0.82rem] shrink-0">
              You&apos;ve already left a review
            </span>
          )}
        </div>

        {reviews.length > 0 ? (
          <div className="testi-grid">
            {reviews.map((review, i) => {
              const initials =
                `${review.user.firstName[0]}${review.user.lastName[0]}`.toUpperCase();
              const colorClass = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <motion.div
                  key={review.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="testi-card"
                >
                  <div className="stars">{"★".repeat(review.rating)}</div>
                  <blockquote className="text-[0.9rem] leading-[1.75] mb-4 italic text-muted">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-[var(--font-syne)] font-bold text-[0.78rem] shrink-0 ${colorClass}`}
                    >
                      {initials}
                    </div>
                    <div>
                      <strong className="block text-[0.85rem] font-semibold">
                        {review.user.firstName} {review.user.lastName}
                      </strong>
                      {review.role && (
                        <span className="text-[0.78rem] text-muted">{review.role}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-muted text-[0.9rem]">
            <p className="mb-4">No reviews yet — be the first to share your experience.</p>
            {!isLoggedIn && (
              <Link href="/login" className="text-brand hover:underline">
                Log in to leave a review →
              </Link>
            )}
          </div>
        )}

        {!isLoggedIn && (
          <p className="text-center text-[0.82rem] text-muted mt-6">
            <Link href="/login" className="text-brand hover:underline">
              Log in
            </Link>{" "}
            to share your experience with HelpDeskXpert.
          </p>
        )}
      </section>

      {/* CTA */}
      <CtaBand
        title="Ready to level up your support?"
        description="Join 200+ SaaS companies that trust HelpDeskXpert to keep their customers happy."
        primaryLabel="Book a Free Consultation →"
        primaryHref="/contact"
        secondaryLabel={"See Pricing"}
        secondaryHref={"/pricing"}
      />
    </>
  );
}
