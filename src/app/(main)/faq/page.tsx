"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";

const faqSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    items: [
      {
        q: "How do I get started with HelpDeskXpert?",
        a: "Simply book a free 30-minute discovery call through our Contact page. We'll learn about your product, your support needs, and your current setup — then recommend the right plan and match you with a suitable agent profile within 24 hours.",
      },
      {
        q: "How long does it take to go live?",
        a: "In most cases, your agent will be trained and handling live tickets within 48 hours of signing up. Enterprise accounts with more complex requirements typically take 3–5 business days for full setup.",
      },
      {
        q: "Is there a minimum contract length?",
        a: "No. All our plans are month-to-month with 30 days notice to cancel. Enterprise clients can request annual contracts for discounted rates, but it's never required.",
      },
      {
        q: "Can I try before I commit?",
        a: "Yes — we offer a 2-week trial period. If you're not fully satisfied with your agent's performance during the trial, you can cancel without charge or request a replacement agent.",
      },
    ],
  },
  {
    id: "agents",
    title: "Our Agents",
    items: [
      {
        q: "Where are your agents based?",
        a: "Our agents are based across multiple regions including South and Southeast Asia, Eastern Europe, Latin America, and Sub-Saharan Africa. All agents are fluent in English and vetted for excellent written and verbal communication.",
      },
      {
        q: "What's your agent vetting process?",
        a: "Every agent goes through a multi-stage process: application screening, written English test, live support simulation, tool proficiency assessment, and a final interview with our training team. Only around 8% of applicants pass and join our pool.",
      },
      {
        q: "Will I always have the same agent?",
        a: "Yes — each client gets a dedicated agent (or team of agents) assigned to their account. You won't be passed around between different people. We also maintain trained backup agents in case of absence.",
      },
      {
        q: "Can I replace my agent if it's not working out?",
        a: "Absolutely. Just let your account manager know and we'll initiate a replacement process. We aim to have a new agent trained and ready within 5 business days, with zero disruption to your coverage.",
      },
    ],
  },
  {
    id: "onboarding",
    title: "Onboarding",
    items: [
      {
        q: "What do I need to provide to onboard an agent?",
        a: "You'll need to provide: access to your helpdesk tool, any existing knowledge base or FAQ docs, your brand tone guide (if you have one), and about 1 hour of your time for a product walkthrough. We handle everything else.",
      },
      {
        q: "What if I don't have a knowledge base yet?",
        a: "No problem — our team will create one from scratch using your product documentation, internal notes, and a live walkthrough session. We also offer a Knowledge Base Build add-on for a more comprehensive creation service.",
      },
      {
        q: "How is the agent trained on my product?",
        a: "The agent goes through a structured onboarding: reading your knowledge base, completing a live product walkthrough with your team, reviewing past tickets, and a shadowing period where their responses are reviewed before going live independently.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing & Billing",
    items: [
      {
        q: "What's included in the monthly price?",
        a: "Everything. Agent pay, HR, benefits, payroll taxes, training, quality monitoring, account management, and weekly reporting are all included. There are no hidden fees or per-ticket charges.",
      },
      {
        q: "Do you charge per ticket or per agent?",
        a: "We charge per agent on a monthly basis — not per ticket. This gives you predictable costs regardless of volume spikes, and incentivises us to staff agents who can handle tickets efficiently.",
      },
      {
        q: "Is there a discount for annual billing?",
        a: "Yes — annual billing saves you 20% compared to month-to-month pricing. You can toggle between monthly and annual on our Pricing page to see the exact savings.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards, ACH bank transfers, and SWIFT international wire transfers. Invoicing is available for Enterprise accounts.",
      },
    ],
  },
  {
    id: "quality",
    title: "Quality & Guarantees",
    items: [
      {
        q: "What is the CSAT guarantee?",
        a: "If your average CSAT score drops below 90% in any given calendar month, we will replace your agent within 5 business days at no extra cost. This guarantee applies to Growth and Enterprise plans.",
      },
      {
        q: "How do you monitor quality on an ongoing basis?",
        a: "Your account manager reviews a random sample of tickets every week, scores them against a QA rubric, and shares coaching notes with the agent. You receive a weekly performance summary every Friday with CSAT, resolution rate, and first-response-time data.",
      },
      {
        q: "Can I set my own quality benchmarks?",
        a: "Yes — Enterprise clients can define custom QA rubrics, SLA targets, and performance thresholds. Growth clients can also request adjustments to the default metrics in consultation with their account manager.",
      },
    ],
  },
  {
    id: "tools",
    title: "Tools & Integrations",
    items: [
      {
        q: "Which helpdesk tools do your agents work with?",
        a: "Our agents are trained on all major platforms including Intercom, Zendesk, Freshdesk, HubSpot Service Hub, Plain, Front, Help Scout, Salesforce Service Cloud, and more. If you use a less common tool, let us know and we'll train accordingly.",
      },
      {
        q: "Will your agents use our existing Intercom/Zendesk setup?",
        a: "Yes — they will work inside your existing tool setup, following your existing ticket flows, macros, and configurations. No migration or new tool required.",
      },
      {
        q: "Can agents work with internal tools like Notion or Jira?",
        a: "Yes. Many of our clients share Notion knowledge bases, use Jira for bug reporting, and communicate via Slack. We set up appropriate access and train agents on your specific internal workflows.",
      },
    ],
  },
  {
    id: "scaling",
    title: "Scaling & Flexibility",
    items: [
      {
        q: "How quickly can I add more agents?",
        a: "Additional agents can typically be onboarded within 48–72 hours, since they train alongside your existing setup. For 5+ agents simultaneously, we recommend 5–7 business days to ensure quality onboarding.",
      },
      {
        q: "Can I scale down without penalties?",
        a: "Yes — you can reduce your agent count at the end of any billing month with 14 days notice. There are no penalties or clawback fees for scaling down.",
      },
      {
        q: "Do you offer surge coverage for product launches?",
        a: "Yes — our Surge Coverage add-on provides temporary additional agent capacity for launch weeks or high-traffic periods. Pricing is custom based on duration and volume. Contact us to plan ahead.",
      },
    ],
  },
];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredSections = faqSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          !searchQuery ||
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <>
      <PageHero
        label="FAQ"
        title="Got questions?"
        titleHighlight="We've got answers."
        description="Everything you need to know about working with HelpDeskXpert — from onboarding to billing to agent quality."
      >
        <div className="search-wrap">
          <Search />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </PageHero>

      <section className="section">
        <div className="faq-layout">
          {/* Sidebar Nav */}
          <nav className="faq-nav">
            <ul className="list-none">
              {faqSections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* FAQ Content */}
          <div>
            {filteredSections.map((section) => (
              <div key={section.id} id={section.id} className="faq-section">
                <div className="faq-section-title">{section.title}</div>
                {section.items.map((item) => {
                  const key = `${section.id}-${item.q}`;
                  const isOpen = openItems.has(key);
                  return (
                    <div
                      key={key}
                      className={`faq-item ${isOpen ? "open" : ""}`}
                    >
                      <button onClick={() => toggleItem(key)} className="faq-q">
                        {item.q}
                        <span
                          className={`w-[22px] h-[22px] rounded-full bg-[rgba(255,92,53,0.12)] border border-[rgba(255,92,53,0.3)] flex items-center justify-center shrink-0 text-brand transition-transform ${isOpen ? "rotate-45 bg-[rgba(255,92,53,0.25)]" : ""}`}
                        >
                          <Plus className="w-3 h-3" />
                        </span>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="pb-[1.1rem] text-[0.9rem] text-muted leading-[1.8]">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ))}

            {filteredSections.length === 0 && (
              <div className="text-center text-muted text-[0.9rem] py-8">
                No questions found matching your search.{" "}
                <Link href="/contact" className="text-brand">
                  Ask us directly →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <CtaBand
        title="Still have questions?"
        description="Our team is happy to answer anything not covered here. Book a call or send us a message."
        primaryLabel="Contact Us →"
        primaryHref="/contact"
      />
    </>
  );
}
