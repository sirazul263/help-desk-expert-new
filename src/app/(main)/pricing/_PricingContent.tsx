"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import CtaBand from "@/components/CtaBand";

const prices = { starter: [799, 639], growth: [1899, 1519] };

const plans = [
  {
    name: "Starter",
    desc: "For early-stage SaaS teams getting support off the ground.",
    popular: false,
    features: [
      { text: "1 dedicated support agent", included: true },
      { text: "Live chat & email support", included: true },
      { text: "40 hrs/week coverage", included: true },
      { text: "Monthly performance report", included: true },
      { text: "Zendesk / Intercom setup", included: true },
      { text: "Knowledge base training", included: true },
      { text: "24/7 coverage", included: false },
      { text: "Technical support tier", included: false },
      { text: "Dedicated account manager", included: false },
    ],
  },
  {
    name: "Growth",
    desc: "For scaling SaaS companies with growing support demand.",
    popular: true,
    features: [
      { text: "Up to 3 dedicated agents", included: true },
      { text: "Live chat, email & phone", included: true },
      { text: "24/7 coverage", included: true },
      { text: "Weekly QA scorecards", included: true },
      { text: "Technical support tier", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Monthly strategy review call", included: true },
      { text: "CSAT guarantee", included: true },
      { text: "Custom SLAs", included: false },
    ],
  },
  {
    name: "Enterprise",
    desc: "For high-volume operations that need a fully managed support function.",
    popular: false,
    isCustom: true,
    features: [
      { text: "Unlimited agents", included: true },
      { text: "Omnichannel support", included: true },
      { text: "Custom SLA configuration", included: true },
      { text: "Dedicated team lead", included: true },
      { text: "API & integration support", included: true },
      { text: "Priority onboarding (24h)", included: true },
      { text: "Quarterly business reviews", included: true },
      { text: "Custom reporting dashboards", included: true },
      { text: "SLA penalty / credit terms", included: true },
    ],
  },
];

const addons = [
  {
    title: "Extra Agent",
    desc: "Add a 2nd or 3rd agent to Starter",
    price: "+$650",
    period: "/mo",
  },
  {
    title: "Social Media Support",
    desc: "Twitter/X, LinkedIn, Facebook DMs",
    price: "+$299",
    period: "/mo",
  },
  {
    title: "Knowledge Base Build",
    desc: "We write your full KB from scratch",
    price: "$799",
    period: "one-off",
  },
  {
    title: "Bilingual Agent",
    desc: "Support in English + one other language",
    price: "+$200",
    period: "/mo",
  },
  {
    title: "Surge Coverage",
    desc: "Extra capacity during launch weeks",
    price: "Custom",
    period: "",
  },
  {
    title: "Agent Training Sprint",
    desc: "Deep product training for complex tools",
    price: "$349",
    period: "one-off",
  },
];

const pricingFaqs = [
  {
    q: "Is there a setup fee?",
    a: "No setup fees on any plan. You pay only the monthly rate from day one.",
  },
  {
    q: "Can I cancel any time?",
    a: "Yes. Monthly plans can be cancelled with 30 days notice. No penalties.",
  },
  {
    q: "What's included in the CSAT guarantee?",
    a: "If CSAT falls below 90%, we replace your agent free of charge within 5 business days.",
  },
  {
    q: "Do prices include the agent's salary?",
    a: "Yes — agent pay, HR, benefits, and management overhead are all included in the monthly rate.",
  },
];

export default function PricingContent() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <PageHero
        label="Pricing"
        title="Simple pricing,"
        titleHighlight="no surprises"
        description="Month-to-month plans with no setup fees, no long-term lock-in, and no hidden charges. Pay only for what you use."
      />

      <section className="section">
        {/* Toggle */}
        <div className="toggle-wrap">
          <span
            className={`toggle-label active ${!annual ? "text-text font-semibold" : "text-muted"}`}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`w-[52px] h-[28px] rounded-[14px] relative cursor-pointer transition-colors border ${
              annual
                ? "bg-[rgba(255,92,53,0.2)] border-[rgba(255,92,53,0.4)]"
                : "bg-card border-border"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full absolute top-[3px] transition-all ${
                annual ? "left-[27px] bg-brand" : "left-[4px] bg-muted"
              }`}
            />
          </button>
          <span className={`toggle-label ${annual ? "active" : ""}`}>
            Annual <span className="save-badge">Save 20%</span>
          </span>
        </div>

        {/* Cards */}
        <div className="pricing-grid">
          {plans.map((plan, i) => {
            const priceKey = plan.name.toLowerCase() as keyof typeof prices;
            const priceData = prices[priceKey];
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`price-card ${plan.popular ? "popular" : ""}`}
              >
                {plan.popular && (
                  <span className="popular-tag">Most Popular</span>
                )}
                <h3>{plan.name}</h3>
                <p className="price-desc">{plan.desc}</p>
                {"isCustom" in plan ? (
                  <>
                    <div className="font-[var(--font-syne)] text-[2.6rem] font-extrabold leading-none mb-[0.25rem]">
                      Custom
                    </div>
                    <p className="price-period">Custom contract terms</p>
                  </>
                ) : (
                  <>
                    <div className="price-amount">
                      $
                      {priceData
                        ? priceData[annual ? 1 : 0].toLocaleString()
                        : ""}
                      <sub>/mo</sub>
                    </div>
                    <p className="price-period">
                      {annual && priceData
                        ? `Billed annually ($${(priceData[1] * 12).toLocaleString()}/yr)`
                        : "Billed monthly"}
                    </p>
                  </>
                )}
                <ul className="feat-list">
                  {plan.features.map((f) => (
                    <li key={f.text}>
                      {f.included ? (
                        <span className="ok">✓</span>
                      ) : (
                        <span className="no">—</span>
                      )}
                      <span className={f.included ? "" : "opacity-45"}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`btn-card  ${
                    plan.popular
                      ? "btn-filled"
                      : "bg-transparent border border-border text-text"
                  }`}
                >
                  {"isCustom" in plan ? "Contact Sales" : "Get Started"}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Guarantee */}
        <div className="guarantee-card">
          <h3 className="text-[1.4rem] font-extrabold mb-[0.6rem] text-success">
            The HelpDeskXpert Guarantee
          </h3>
          <p>
            If your CSAT score drops below 90% in any given month, we&apos;ll
            replace your agent within 5 business days — at absolutely no extra
            cost to you. We stand behind every placement.
          </p>
        </div>
      </section>

      <section className="section section-alt">
        <SectionHeader
          label="Add-Ons"
          title="Boost any plan with extras"
          subtitle="Pick the additional features you need without upgrading your whole plan."
        />
        <div className="addons-grid">
          {addons.map((addon) => (
            <div key={addon.title} className="addon">
              <div className="addon-info">
                <h4>{addon.title}</h4>
                <p>{addon.desc}</p>
              </div>
              <div className="addon-price">
                {addon.price}
                <span className="text-[0.75rem] text-muted">
                  {addon.period}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader label="Common Questions" title="Pricing FAQs" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[1.25rem] !mt-10">
          {pricingFaqs.map((faq) => (
            <div
              key={faq.q}
              className="bg-card border border-border rounded-[14px] !p-6"
            >
              <h4 className="text-[0.975rem] font-semibold mb-2">{faq.q}</h4>
              <p className="text-[0.875rem] text-muted leading-[1.7]">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center !mt-8">
          <Link href="/faq" className="btn-lg btn-outline-lg">
            See All FAQs →
          </Link>
        </div>
      </section>

      <CtaBand
        title="Still not sure which plan fits?"
        description="Talk to us — we'll recommend the right plan based on your ticket volume and team size, no pressure."
        primaryLabel="Talk to Sales →"
        primaryHref="/contact"
      />
    </>
  );
}
