"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Users,
  Activity,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import CtaBand from "@/components/CtaBand";

const coreServices = [
  {
    icon: MessageSquare,
    title: "Live Chat Support",
    desc: "Real-time agents embedded directly in your product's chat widget — trained on your knowledge base, tone of voice, and escalation paths.",
    features: [
      "Sub-60-second first response time",
      "Proactive chat triggers for at-risk users",
      "Handoff protocols to your internal team",
      "Multi-language support available",
    ],
  },
  {
    icon: Mail,
    title: "Email & Ticket Management",
    desc: "Full inbox ownership — our agents triage, categorise, resolve, and escalate tickets according to your custom SLA rules.",
    features: [
      "Custom SLA setup and monitoring",
      "Smart tagging and routing",
      "Template library creation",
      "Weekly ticket trend reports",
    ],
  },
  {
    icon: Phone,
    title: "Technical Support Agents",
    desc: "Agents with a technical background who can handle API questions, integration troubleshooting, and developer-facing support tickets.",
    features: [
      "API & webhook troubleshooting",
      "Integration setup assistance",
      "Bug reporting with reproduction steps",
      "Developer documentation guidance",
    ],
  },
  {
    icon: Clock,
    title: "24/7 Global Coverage",
    desc: "We staff agents across multiple time zones so your users always reach a human, no matter when they reach out.",
    features: [
      "Agents in Americas, EMEA, APAC",
      "Seamless shift handoff documentation",
      "Holiday and surge coverage included",
      "No extra cost for weekend coverage",
    ],
  },
  {
    icon: Users,
    title: "Team Scaling",
    desc: "Rapidly expand your support headcount around product launches, seasonal spikes, or hypergrowth phases — without the hiring headache.",
    features: [
      "Add agents in 48–72 hours",
      "Scale down without penalties",
      "Bulk onboarding playbooks",
      "Dedicated team lead for 5+ agents",
    ],
  },
  {
    icon: Activity,
    title: "Quality Assurance & Reporting",
    desc: "We continuously monitor, score, and coach every agent on your account — so you always know exactly how your support is performing.",
    features: [
      "Weekly CSAT & QA scorecards",
      "Ticket resolution rate tracking",
      "Monthly strategy review call",
      "Agent coaching and improvement plans",
    ],
  },
];

const tools = [
  "Intercom",
  "Zendesk",
  "Freshdesk",
  "HubSpot",
  "Plain",
  "Jira",
  "Linear",
  "Slack",
  "Front",
  "Help Scout",
  "Salesforce",
  "Notion",
];

const industries = [
  {
    title: "Developer Tools",
    desc: "API-first, CLI, and dev tooling products with technical user bases.",
  },
  {
    title: "Fintech & Payments",
    desc: "Compliance-aware agents trained on financial product support.",
  },
  {
    title: "HR & People Ops",
    desc: "Sensitive, empathetic support for HR platform users.",
  },
  {
    title: "Marketing SaaS",
    desc: "Agents versed in CRM, email automation, and analytics tools.",
  },
  {
    title: "E-Commerce SaaS",
    desc: "Order management, billing, and store-owner queries covered.",
  },
  {
    title: "Health & Wellness Tech",
    desc: "HIPAA-aware support with a careful, empathetic tone.",
  },
];

const compareRows = [
  {
    feature: "Dedicated support agents",
    starter: "1 agent",
    growth: "Up to 3",
    enterprise: "Unlimited",
  },
  {
    feature: "Live chat support",
    starter: true,
    growth: true,
    enterprise: true,
  },
  {
    feature: "Email & ticket management",
    starter: true,
    growth: true,
    enterprise: true,
  },
  { feature: "Phone support", starter: false, growth: true, enterprise: true },
  { feature: "24/7 coverage", starter: false, growth: true, enterprise: true },
  {
    feature: "Technical support tier",
    starter: false,
    growth: true,
    enterprise: true,
  },
  {
    feature: "Weekly QA scorecards",
    starter: false,
    growth: true,
    enterprise: true,
  },
  {
    feature: "Dedicated account manager",
    starter: false,
    growth: true,
    enterprise: true,
  },
  {
    feature: "Custom SLA setup",
    starter: false,
    growth: false,
    enterprise: true,
  },
  {
    feature: "Dedicated team lead",
    starter: false,
    growth: false,
    enterprise: true,
  },
  {
    feature: "API & integration support",
    starter: false,
    growth: false,
    enterprise: true,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

export default function ServicesContent() {
  return (
    <>
      <PageHero
        label="Our Services"
        title="Every kind of support,"
        titleHighlight="fully covered"
        description="From basic tier-1 tickets to complex API troubleshooting — we staff the right agents for every support scenario your SaaS users face."
      />

      <section className="section">
        <SectionHeader
          label="Core Offerings"
          title="What we do for you"
          subtitle="Six specialised service lines, each staffed with agents trained specifically for SaaS products."
        />
        <div className="services-hero-grid">
          {coreServices.map((svc, i) => (
            <motion.div
              key={svc.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="service-big"
            >
              <div className="card-icon">
                <svc.icon
                  className="w-[22px] h-[22px] text-brand"
                  strokeWidth={1.8}
                />
              </div>
              <h3 className="text-[1.2rem] font-bold mb-[0.6rem]">
                {svc.title}
              </h3>
              <p className="text-[0.9rem] text-muted leading-[1.75] mb-5">
                {svc.desc}
              </p>
              <ul className="list-none">
                {svc.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <SectionHeader
          label="Tools We Work With"
          title="We work inside your existing stack"
          subtitle="Our agents are pre-trained on the most popular SaaS helpdesk and CRM platforms — no retraining required."
        />
        <div className="tools-grid">
          {tools.map((tool) => (
            <div key={tool} className="tool-chip">
              {tool}
            </div>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <SectionHeader
          label="Industries We Serve"
          title="Specialists across SaaS verticals"
          subtitle="We don't believe in generic agents. Each placement is matched to your product's industry context."
        />
        <div className="industries-grid">
          {industries.map((ind) => (
            <div key={ind.title} className="industry-card">
              <h4>{ind.title}</h4>
              <p>{ind.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section sec">
        <SectionHeader
          label="Feature Comparison"
          title="What's included in each plan"
          subtitle="Every plan includes the essentials. Higher tiers unlock more coverage, channels, and dedicated management."
        />
        <div className="overflow-x-auto mt-10">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>
                  <span className="plan-badge plan-starter">Starter</span>
                </th>
                <th>
                  <span className="plan-badge plan-growth">Growth</span>
                </th>
                <th>
                  <span className="plan-badge plan-ent">Enterprise</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row, i) => (
                <tr key={i}>
                  <td className="py-[0.85rem] px-4 border-b border-border font-semibold">
                    {row.feature}
                  </td>
                  {[row.starter, row.growth, row.enterprise].map((val, j) => (
                    <td key={j}>
                      {typeof val === "string" ? (
                        val
                      ) : val ? (
                        <span className="yes">✓</span>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center !mt-10">
          <Link href="/pricing" className="btn-lg btn-primary-lg">
            See Full Pricing →
          </Link>
        </div>
      </section>

      <CtaBand
        title="Not sure which service you need?"
        description="Book a free 30-minute call and we'll recommend the right setup for your SaaS team."
        primaryLabel="Book a Free Consultation →"
        primaryHref="/contact"
      />
    </>
  );
}
