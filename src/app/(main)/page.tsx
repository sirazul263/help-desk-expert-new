"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Clock,
  Phone,
  Users,
  Activity,
  Check,
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import CtaBand from "@/components/CtaBand";

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
  {
    num: "01",
    title: "Tell Us Your Needs",
    desc: "Share your tools, volume, and support requirements.",
  },
  {
    num: "02",
    title: "We Match Your Agent",
    desc: "Best-fit agent selected from our trained SaaS pool.",
  },
  {
    num: "03",
    title: "Onboard in 48h",
    desc: "Agent trained on your product, tone, and workflows.",
  },
  {
    num: "04",
    title: "Go Live & Scale",
    desc: "Start handling tickets. Add more agents as you grow.",
  },
];

const testimonials = [
  {
    quote:
      "HelpDesk Expert transformed our support. Response time dropped from 12 hours to under 2 — and our CSAT jumped from 72% to 96% in three months.",
    name: "James Keller",
    role: "Head of CX, Streamly",
    initials: "JK",
    avatarClass: "bg-[rgba(255,92,53,0.2)] text-brand",
  },
  {
    quote:
      "We were skeptical about outsourcing, but the agents felt like part of our team from day one. They knew our product, our tone, and even our internal jokes.",
    name: "Riya Patel",
    role: "Founder, Formbase",
    initials: "RP",
    avatarClass: "bg-[rgba(255,176,32,0.2)] text-brand2",
  },
  {
    quote:
      "We scaled from 2 agents to 10 in two weeks at our Series A launch. No hiring headaches, no training delays. Just results.",
    name: "Tom Nguyen",
    role: "VP Operations, Tapstack",
    initials: "TN",
    avatarClass: "bg-[rgba(100,150,255,0.2)] text-[#6496ff]",
  },
];

const whyCards = [
  {
    title: "SaaS-Native Training",
    desc: "Agents trained in Intercom, Zendesk, HubSpot, and Jira before joining your team.",
    featured: true,
  },
  {
    title: "Dedicated Account Manager",
    desc: "A real human point of contact who manages your agents and keeps quality high.",
    featured: false,
  },
  {
    title: "No Long-Term Contracts",
    desc: "Flexible month-to-month agreements. Scale up, down, or pause any time.",
    featured: false,
  },
  {
    title: "Churn-Reduction Focus",
    desc: "Agents trained to spot at-risk users and proactively engage to improve retention.",
    featured: true,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function HomePage() {
  return (
    <>
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
          {[
            "STREAMLY",
            "CODEPATH",
            "NOVU",
            "TAPSTACK",
            "DRIFTLY",
            "FORMBASE",
          ].map((name) => (
            <span key={name} className="logo-pill">
              {name}
            </span>
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
                <svc.icon
                  className="w-[22px] h-[22px] text-brand"
                  strokeWidth={1.8}
                />
              </div>
              <h3 className="text-[1.05rem] font-semibold mb-[0.4rem]">
                {svc.title}
              </h3>
              <p className="text-[0.875rem] text-muted leading-[1.6]">
                {svc.desc}
              </p>
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
              <h3 className="text-[0.975rem] font-semibold mb-[0.4rem]">
                {step.title}
              </h3>
              <p className="text-[0.82rem] text-muted leading-[1.6]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/how-it-works" className="btn-lg btn-primary-lg">
            Learn More →
          </Link>
        </div>
      </section>

      {/* Why HelpDesk Expert */}
      <section className="section">
        <SectionHeader
          label="Why HelpDesk Expert"
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
              <h3 className="text-[1rem] font-semibold mb-[0.4rem]">
                {card.title}
              </h3>
              <p className="text-[0.875rem] text-muted leading-[1.6]">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-alt">
        <SectionHeader label="Success Stories" title="What our clients say" />
        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="testi-card"
            >
              <div className="stars">★★★★★</div>
              <blockquote className="text-[0.9rem] leading-[1.75] mb-4 italic text-muted">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-[var(--font-syne)] font-bold text-[0.78rem] shrink-0 ${t.avatarClass}`}
                >
                  {t.initials}
                </div>
                <div>
                  <strong className="block text-[0.85rem] font-semibold">
                    {t.name}
                  </strong>
                  <span className="text-[0.78rem] text-muted">{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <CtaBand
        title="Ready to level up your support?"
        description="Join 200+ SaaS companies that trust HelpDesk Expert to keep their customers happy."
        primaryLabel="Book a Free Consultation →"
        primaryHref="/contact"
        secondaryLabel={"See Pricing"}
        secondaryHref={"/pricing"}
      />
    </>
  );
}
