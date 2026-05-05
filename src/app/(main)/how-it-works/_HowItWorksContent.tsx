"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import CtaBand from "@/components/CtaBand";

const timelineSteps = [
  {
    num: "01",
    title: "Book a Discovery Call",
    desc: "A 30-minute call with our team to understand your product, your users, your current support stack, and your pain points. We'll ask about ticket volume, response time expectations, tone of voice, and any technical complexity your product involves.",
    chips: ["30 min call", "No commitment", "Same-day booking"],
  },
  {
    num: "02",
    title: "We Match Your Agent",
    desc: "Based on your requirements, we hand-select the best-fit agent from our trained pool. We match on industry experience, tool familiarity, time zone, technical aptitude, and communication style. You'll receive a profile and can approve the match.",
    chips: [
      "Hand-picked matching",
      "SaaS-niche alignment",
      "You approve before start",
    ],
  },
  {
    num: "03",
    title: "Agent Onboarding & Training",
    desc: "Your agent completes a structured onboarding: product walkthrough, knowledge base review, tone of voice training, tool access setup, and a live shadowing period. By the time they handle a ticket independently, they know your product inside out.",
    chips: [
      "Knowledge base training",
      "Tool access setup",
      "Live shadowing period",
      "Tone & brand alignment",
    ],
  },
  {
    num: "04",
    title: "Go Live & Ongoing Management",
    desc: "Your agent starts handling tickets. Your dedicated account manager monitors quality, reviews CSAT scores weekly, provides coaching, and sends you a performance report every Friday. You can request changes, add agents, or scale down at any time.",
    chips: [
      "Weekly performance reports",
      "CSAT monitoring",
      "Ongoing coaching",
      "Scale up/down anytime",
    ],
  },
];

const stats = [
  { value: "30m", desc: "Discovery call to understand your exact needs" },
  { value: "24h", desc: "Agent matched and profile sent for your approval" },
  { value: "48h", desc: "Agent trained, set up, and handling live tickets" },
  { value: "7d", desc: "First performance report delivered to your inbox" },
];

const youProvide = [
  "Access to your helpdesk tool",
  "Existing knowledge base / FAQs",
  "Brand and tone guidance",
  "1 hour for initial product walkthrough",
  "Feedback on weekly reports",
];

const weHandle = [
  "Agent recruitment and vetting",
  "Full onboarding and training",
  "Tool setup and configuration",
  "Payroll, HR, and compliance",
  "Quality monitoring and coaching",
  "Weekly performance reporting",
];

const faqs = [
  {
    q: "What if I don't have a knowledge base yet?",
    a: "No problem. Our onboarding team will work with you to create one from scratch during the setup phase, using your product docs, internal notes, and a live walkthrough session.",
  },
  {
    q: "Can I trial an agent before committing?",
    a: "Yes — we offer a 2-week trial period. If you're not satisfied with the agent's performance, we'll replace them at no charge.",
  },
  {
    q: "What happens if my agent goes on leave?",
    a: "We maintain a bench of trained backup agents familiar with your product, so there's no coverage gap when your primary agent is unavailable.",
  },
  {
    q: "How do you ensure quality over time?",
    a: "Your account manager reviews a random sample of tickets every week, scores them against your quality rubric, and provides coaching notes to the agent. CSAT trends are tracked and shared in your weekly report.",
  },
];

export default function HowItWorksContent() {
  return (
    <>
      <PageHero
        label="How It Works"
        title="From sign-up to live support"
        titleHighlight="in 48 hours"
        description="We've built a streamlined process that removes every bottleneck between you and a great support experience for your users."
      />

      <section className="section">
        <SectionHeader
          label="The Process"
          title="Four steps to your dream support team"
          subtitle="Each step is designed to be fast and low-effort on your side — we do the heavy lifting."
        />
        <div className="timeline">
          {timelineSteps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="t-step"
            >
              <div className="t-num">{step.num}</div>
              <div className="t-body">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                <div className="detail-chips">
                  {step.chips.map((chip) => (
                    <span key={chip} className="chip">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <SectionHeader
          label="By the Numbers"
          title="Speed and results you can count on"
        />
        <div className="onboarding-grid">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="ob-card"
            >
              <div className="big-num">{stat.value}</div>
              <p>{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader
          label="What to Expect"
          title="Your responsibilities vs ours"
          subtitle="We keep your workload minimal — here's a clear split of who does what."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 !gap-6 !mt-10">
          <div className="bg-card border border-border rounded-[14px] !p-8">
            <div className="text-[0.78rem] uppercase tracking-[0.1em] text-muted !mb-4">
              You provide
            </div>
            <ul className="list-none">
              {youProvide.map((item) => (
                <li
                  key={item}
                  className="!py-2 border-b border-border text-[0.9rem] flex items-center gap-3 last:border-b-0"
                >
                  <span className="text-brand2">→</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[rgba(255,92,53,0.05)] border border-[rgba(255,92,53,0.35)] rounded-[14px] !p-8">
            <div className="text-[0.78rem] uppercase tracking-[0.1em] text-brand !mb-4">
              We handle
            </div>
            <ul className="list-none">
              {weHandle.map((item) => (
                <li
                  key={item}
                  className="!py-2 border-b border-border text-[0.9rem] flex items-center gap-3 last:border-b-0"
                >
                  <span className="text-success">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <SectionHeader
          label="Quick Answers"
          title="Common questions about the process"
        />
        <div className="!mt-10">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-border !py-5">
              <h4 className="!text-[0.975rem] font-semibold !mb-[0.4rem]">
                {faq.q}
              </h4>
              <p className="!text-[0.875rem] !text-muted !leading-[1.7]">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center !mt-10">
          <Link href="/faq" className=" btn-lg btn-outline-lg">
            Read All FAQs →
          </Link>
        </div>
      </section>

      <CtaBand
        title="Ready to get started?"
        description="Book your free 30-minute discovery call and we'll have agents ready for you within 48 hours."
        primaryLabel="Book a Free Consultation →"
        primaryHref="/contact"
        secondaryLabel="View Pricing"
        secondaryHref="/pricing"
      />
    </>
  );
}
