"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import CtaBand from "@/components/CtaBand";

const bigStats = [
  { value: "2,000+", label: "Agents placed worldwide" },
  { value: "98%", label: "Client retention rate" },
  { value: "200+", label: "SaaS companies served" },
  { value: "4.9★", label: "Average CSAT across clients" },
];

const timeline = [
  {
    year: "2019",
    title: "The problem identified",
    desc: "Our founders, running their own SaaS startup, struggled to find reliable, product-aware support agents. Outsourcing felt impersonal and staffing agencies were too slow.",
  },
  {
    year: "2020",
    title: "First version launched",
    desc: "We built a small internal training program and placed our first 10 agents with SaaS companies in our network. The feedback was overwhelmingly positive.",
  },
  {
    year: "2021",
    title: "Series of growth",
    desc: "Word spread fast. We expanded to 50 client companies and introduced our CSAT guarantee — the first in our industry. Agent placement count hit 200.",
  },
  {
    year: "2023",
    title: "Global expansion",
    desc: "We opened agent pools across three continents to enable true 24/7 coverage. We crossed 1,000 agents placed and launched our enterprise tier.",
  },
  {
    year: "2025",
    title: "Industry leader",
    desc: "Today, 200+ SaaS companies across 30 countries trust us as their support partner. We're still growing — and still obsessed with quality over quantity.",
  },
];

const values = [
  {
    num: "01",
    title: "Quality Over Volume",
    desc: "We'd rather have 10 exceptional agents than 100 mediocre ones. Every placement is hand-vetted and every interaction is monitored.",
  },
  {
    num: "02",
    title: "Radical Transparency",
    desc: "You get full visibility into your agent's performance — weekly reports, CSAT scores, ticket trends, and improvement plans. No hiding bad news.",
  },
  {
    num: "03",
    title: "Human-First Support",
    desc: "We believe genuine human connection in customer support is irreplaceable. Our agents are trained to care, not just to close tickets.",
  },
  {
    num: "04",
    title: "Partnership Over Service",
    desc: "We act as a strategic extension of your team — not a vendor. Your success metrics are our success metrics.",
  },
];

const team = [
  {
    initials: "AK",
    name: "Alex Kim",
    role: "CEO & Co-Founder",
    prev: "Previously: Head of CX at Driftly",
    bg: "bg-[rgba(255,92,53,0.18)]",
    color: "text-brand",
  },
  {
    initials: "SR",
    name: "Sofia Reyes",
    role: "COO & Co-Founder",
    prev: "Previously: VP Ops at Codepath",
    bg: "bg-[rgba(255,176,32,0.18)]",
    color: "text-brand2",
  },
  {
    initials: "DM",
    name: "David Mensah",
    role: "Head of Agent Training",
    prev: "10+ years in SaaS support",
    bg: "bg-[rgba(100,150,255,0.18)]",
    color: "text-[#6496ff]",
  },
  {
    initials: "LP",
    name: "Lena Park",
    role: "Head of Client Success",
    prev: "Previously: CX Lead at Tapstack",
    bg: "bg-[rgba(46,204,138,0.18)]",
    color: "text-success",
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

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About Us"
        title="We exist to make"
        titleHighlight="great support accessible"
        description="HelpDesk Expert was built by former SaaS founders who experienced firsthand how hard it is to scale customer support without sacrificing quality."
      />

      <section className="section">
        <div className="mission-split">
          <div>
            <div className="section-label">Our Mission</div>
            <h2>
              Support shouldn&apos;t be a <em>bottleneck</em> to growth
            </h2>
            <p>
              Too many great SaaS products lose customers not because of the
              product itself — but because of slow, impersonal, or inconsistent
              support experiences.
            </p>
            <p>
              We started HelpDesk Expert to fix that. By placing rigorously
              trained, SaaS-savvy agents directly into your team, we remove the
              bottleneck and give your users the experience they deserve.
            </p>
            <p>
              We&apos;re not a staffing agency and we&apos;re not a chatbot.
              We&apos;re a strategic support partner that scales with you.
            </p>
            <Link href="/contact" className="btn-lg btn-primary-lg !mt-10">
              Work With Us →
            </Link>
          </div>
          <div>
            <div className="big-stat-grid">
              {bigStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="big-stat"
                >
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <SectionHeader
          label="Our Story"
          title="How we got here"
          subtitle="HelpDesk Expert was born from frustration — and a belief that there was a better way."
        />
        <div className="story-timeline">
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="story-item"
            >
              <div className="year">{item.year}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader label="What We Stand For" title="Our core values" />
        <div className="values-grid">
          {values.map((val, i) => (
            <motion.div
              key={val.num}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="value-card"
            >
              <div className="value-num">{val.num}</div>
              <h3>{val.title}</h3>
              <p>{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <SectionHeader
          label="Leadership Team"
          title="The people behind the platform"
        />
        <div className="team-grid">
          {team.map((member, i) => (
            <motion.div
              key={member.initials}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="team-card"
            >
              <div className={`team-avatar ${member.bg} ${member.color}`}>
                {member.initials}
              </div>
              <h4>{member.name}</h4>
              <p
                className={`text-[0.82rem] font-semibold !mb-[0.3rem] !${member.color}`}
              >
                {member.role}
              </p>
              <span className="text-[0.78rem] text-[rgba(255,255,255,0.3)]">
                {member.prev}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      <CtaBand
        title="Want to join our mission?"
        description="We're always looking for talented support professionals and SaaS-savvy team members to join HelpDesk Expert."
        primaryLabel="Get In Touch →"
        primaryHref="/contact"
        secondaryLabel="Explore Services"
        secondaryHref="/services"
      />
    </>
  );
}
