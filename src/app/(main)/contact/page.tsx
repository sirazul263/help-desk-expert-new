"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";

const contactItems = [
  { icon: Phone, label: "Phone", value: "+1 (800) 555-0199" },
  { icon: Mail, label: "Email", value: "hello@helpdeskexpert.com" },
  {
    icon: MapPin,
    label: "Headquarters",
    value: "San Francisco, CA — remote-first globally",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "We reply within 2 business hours",
  },
];

const trustItems = [
  "Free 30-minute consultation — no obligation",
  "Agents ready and onboarded within 48 hours",
  "Month-to-month, cancel any time",
  "CSAT guarantee on Growth & Enterprise plans",
  "Dedicated account manager from day one",
];

const channels = [
  "Live Chat",
  "Email",
  "Phone",
  "Technical / API",
  "Social Media",
];

const roleOptions = [
  "Founder / CEO",
  "Head of Customer Success",
  "VP Operations",
  "CTO / Product Lead",
  "Support Manager",
  "Other",
];
const agentOptions = [
  "1 agent",
  "2–3 agents",
  "4–6 agents",
  "7–10 agents",
  "10+ agents",
];
const volumeOptions = [
  "Under 500",
  "500–2,000",
  "2,000–5,000",
  "5,000–10,000",
  "10,000+",
];
const toolOptions = [
  "Intercom",
  "Zendesk",
  "Freshdesk",
  "HubSpot",
  "Plain",
  "Other / None",
];
const timeOptions = [
  "9:00 AM – 9:30 AM (UTC)",
  "10:00 AM – 10:30 AM (UTC)",
  "11:00 AM – 11:30 AM (UTC)",
  "1:00 PM – 1:30 PM (UTC)",
  "2:00 PM – 2:30 PM (UTC)",
  "3:00 PM – 3:30 PM (UTC)",
  "4:00 PM – 4:30 PM (UTC)",
];
const tzOptions = [
  "UTC+6 – Dhaka (BST)",
  "UTC+0 – London (GMT)",
  "UTC-5 – New York (EST)",
  "UTC-8 – San Francisco (PST)",
  "UTC+1 – Paris (CET)",
  "UTC+5:30 – India (IST)",
  "UTC+8 – Singapore (SGT)",
  "UTC+9 – Tokyo (JST)",
];
const sourceOptions = [
  "Google Search",
  "LinkedIn",
  "Referral",
  "Twitter / X",
  "Product Hunt",
  "Other",
];

const formSchema = z.object({
  // Step 1
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Enter a valid email address"),
  company: z.string().min(1, "Company Name is required"),
  role: z.string().min(1, "Please select a role"),
  website: z.string(),
  // Step 2
  agents: z.string().min(1, "Please select an agents"),
  channels: z.array(z.string()),
  volume: z.string().min(1, "Please select a volume"),
  tool: z.string(),
  notes: z.string(),
  // Step 3
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  timezone: z.string().min(1, "Please select timezone"),
  source: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const step1Fields = [
  "firstName",
  "lastName",
  "email",
  "company",
  "role",
] as const;
const step2Fields = ["agents", "volume"] as const;
const step3Fields = ["date", "time", "timezone"] as const;

export default function ContactPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      role: "",
      website: "",
      agents: "",
      channels: ["Live Chat"],
      volume: "",
      tool: "",
      notes: "",
      date: "",
      time: "",
      timezone: "",
      source: "",
    },
    mode: "onTouched",
  });

  const form = watch();

  const toggleChannel = (ch: string) => {
    const current = form.channels ?? ["Live Chat"];
    const updated = current.includes(ch)
      ? current.filter((c) => c !== ch)
      : [...current, ch];
    setValue("channels", updated);
  };

  const next = async (nextStep: number) => {
    let valid = false;
    if (nextStep === 2) valid = await trigger([...step1Fields]);
    if (nextStep === 3) valid = await trigger([...step2Fields]);
    if (valid) setStep(nextStep);
  };

  const onSubmit = () => {
    setSubmitted(true);
  };

  const submitStep3 = async () => {
    const valid = await trigger([...step3Fields]);
    if (valid) handleSubmit(onSubmit)();
  };

  const reset = () => {
    resetForm();
    setStep(1);
    setSubmitted(false);
  };

  const progress = submitted ? 100 : step === 1 ? 33 : step === 2 ? 66 : 100;
  const minDate = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const inputCls = (field: string) =>
    `w-full py-[0.62rem] px-[0.9rem] bg-input-bg border rounded-lg text-text text-[0.9rem] font-[var(--font-dm)] outline-none transition-colors focus:border-[rgba(255,92,53,0.5)] appearance-none ${
      field && errors[field as keyof FormData]
        ? "border-error"
        : "border-input-border"
    }`;

  return (
    <>
      <PageHero
        label="Contact Us"
        title="Let's talk about"
        titleHighlight="your support"
        description="Book a free 30-minute consultation and we'll have a tailored recommendation ready for you — no sales pressure, just honest advice."
      />

      <section className="section">
        <div className="contact-layout">
          <div className="contact-info">
            <h2>
              We&apos;re ready when <em>you are</em>
            </h2>
            <p>
              Tell us a bit about your product and your team. We&apos;ll match
              you with the right agents and get you onboarded in under 48 hours.
            </p>

            <div className="contact-items">
              {contactItems.map((item) => (
                <div key={item.label} className="contact-item">
                  <div className="contact-item-icon">
                    <item.icon strokeWidth={1.8} />
                  </div>
                  <div className="contact-item-body">
                    <strong>{item.label}</strong>
                    <span>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="trust-items">
              {trustItems.map((item) => (
                <div key={item} className="trust-item">
                  <span className="trust-item-icon"></span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right Form */}
          <div className="form-card">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="step-tabs">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={`step-tab ${
                    submitted
                      ? "!text-success !border-success "
                      : step >= n
                        ? "!text-brand !border-b-brand"
                        : ""
                  }`}
                >
                  {n === 1
                    ? "1. About You"
                    : n === 2
                      ? "2. Your Needs"
                      : "3. Schedule"}
                </button>
              ))}
            </div>

            {/* Step 1 */}
            {step === 1 && !submitted && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="step-panel" />
                <div className="field-row">
                  <div className="field">
                    <label>
                      First Name <span className="text-brand">*</span>
                    </label>
                    <input
                      className={inputCls("firstName")}
                      {...register("firstName")}
                      placeholder="Sarah"
                    />
                    {errors.firstName && (
                      <div className="text-[0.75rem] text-error mt-[0.3rem]">
                        {errors.firstName.message}
                      </div>
                    )}
                  </div>
                  <div className="field">
                    <label>
                      Last Name <span className="text-brand">*</span>
                    </label>
                    <input
                      className={inputCls("lastName")}
                      {...register("lastName")}
                      placeholder="Johnson"
                    />
                    {errors.lastName && (
                      <div className="text-[0.75rem] text-error mt-[0.3rem]">
                        {errors.lastName.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="field">
                  <label>
                    Work Email <span className="text-brand">*</span>
                  </label>
                  <input
                    className={inputCls("email")}
                    type="email"
                    {...register("email")}
                    placeholder="sarah@yourcompany.com"
                  />
                  {errors.email && (
                    <div className="text-[0.75rem] text-error mt-[0.3rem]">
                      {errors.email.message}
                    </div>
                  )}
                </div>
                <div className="field">
                  <label>
                    Company Name <span className="text-brand">*</span>
                  </label>
                  <input
                    className={inputCls("company")}
                    {...register("company")}
                    placeholder="Acme Inc."
                  />
                  {errors.company && (
                    <div className="text-[0.75rem] text-error mt-[0.3rem]">
                      {errors.company.message}
                    </div>
                  )}
                </div>
                <div className="field">
                  <label>
                    Your Role <span className="text-brand">*</span>
                  </label>
                  <select className={inputCls("role")} {...register("role")}>
                    <option value="">Select your role...</option>
                    {roleOptions.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                  {errors.role && (
                    <div className="text-[0.75rem] text-error mt-[0.3rem]">
                      {errors.role.message}
                    </div>
                  )}
                </div>
                <div className="field">
                  <label>Company website (optional)</label>
                  <input
                    className={inputCls("")}
                    {...register("website")}
                    placeholder="https://yourcompany.com"
                  />
                </div>
                <div className="btn-row">
                  <button onClick={() => next(2)} className="btn-next">
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && !submitted && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="field">
                  <label>
                    How many agents do you need?{" "}
                    <span className="text-brand">*</span>
                  </label>
                  <select
                    className={inputCls("agents")}
                    {...register("agents")}
                  >
                    <option value="">Select...</option>
                    {agentOptions.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                  {errors.agents && (
                    <div className="text-[0.75rem] text-error mt-[0.3rem]">
                      {errors.agents.message}
                    </div>
                  )}
                </div>
                <div className="field">
                  <label>Support channels needed</label>
                  <div className="radio-pills">
                    {channels.map((ch) => (
                      <button
                        key={ch}
                        onClick={() => toggleChannel(ch)}
                        className={`pill ${
                          form.channels.includes(ch) ? "on" : ""
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>
                    Monthly ticket volume <span className="text-brand">*</span>
                  </label>
                  <select
                    className={inputCls("volume")}
                    {...register("volume")}
                  >
                    <option value="">Select...</option>
                    {volumeOptions.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                  {errors.volume && (
                    <div className="text-[0.75rem] text-error mt-[0.3rem]">
                      {errors.volume.message}
                    </div>
                  )}
                </div>
                <div className="field">
                  <label>Current helpdesk tool</label>
                  <select className={inputCls("")} {...register("tool")}>
                    <option value="">Select if applicable...</option>
                    {toolOptions.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Anything we should know?</label>
                  <textarea
                    className={`${inputCls("")} resize-y min-h-[110px]`}
                    {...register("notes")}
                    placeholder="e.g. We're launching in 2 weeks and need urgent coverage, or we have specific compliance requirements..."
                  />
                </div>
                <div className="btn-row">
                  <button onClick={() => setStep(1)} className="btn-back">
                    ← Back
                  </button>
                  <button onClick={() => next(3)} className="btn-next">
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && !submitted && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="field">
                  <label>
                    Preferred date <span className="text-brand">*</span>
                  </label>
                  <input
                    type="date"
                    min={minDate}
                    className={inputCls("date")}
                    {...register("date")}
                  />
                  {errors.date && (
                    <div className="text-[0.75rem] text-error mt-[0.3rem]">
                      {errors.date.message}
                    </div>
                  )}
                </div>
                <div className="field">
                  <label>
                    Preferred time slot <span className="text-brand">*</span>
                  </label>
                  <select className={inputCls("time")} {...register("time")}>
                    <option value="">Select a time...</option>
                    {timeOptions.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  {errors.time && (
                    <div className="text-[0.75rem] text-error mt-[0.3rem]">
                      {errors.time.message}
                    </div>
                  )}
                </div>
                <div className="field">
                  <label>
                    Your timezone <span className="text-brand">*</span>
                  </label>
                  <select
                    className={inputCls("timezone")}
                    {...register("timezone")}
                  >
                    <option value="">Select...</option>
                    {tzOptions.map((tz) => (
                      <option key={tz}>{tz}</option>
                    ))}
                  </select>
                  {errors.timezone && (
                    <div className="text-[0.75rem] text-error mt-[0.3rem]">
                      {errors.timezone.message}
                    </div>
                  )}
                </div>
                <div className="field">
                  <label>How did you hear about us?</label>
                  <select className={inputCls("")} {...register("source")}>
                    <option value="">Select...</option>
                    {sourceOptions.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="btn-row">
                  <button onClick={() => setStep(2)} className="btn-back">
                    ← Back
                  </button>
                  <button onClick={submitStep3} className="btn-next">
                    Book My Consultation →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Success */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="success-state"
              >
                <div className="success-icon">
                  <CheckCircle className="w-[30px] h-[30px] text-success" />
                </div>
                <h3>You&apos;re booked!</h3>
                <p>
                  Confirmation email sent. Our team will reach out within 15
                  minutes to confirm the slot.
                </p>
                <div className="success-summary">
                  {[
                    ["Name", `${form.firstName} ${form.lastName}`],
                    ["Company", form.company],
                    [
                      "Date",
                      form.date
                        ? new Date(form.date + "T12:00:00").toLocaleDateString(
                            "en-GB",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : "",
                    ],
                    ["Time", form.time],
                    ["Timezone", form.timezone],
                    ["Agents needed", form.agents],
                    ["Channels", form.channels.join(", ") || "Not specified"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between items-center !py-[0.35rem] text-[0.82rem] border-b border-border last:border-b-0"
                    >
                      <span className="text-muted">{k}</span>
                      <span className="font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
                <button onClick={reset} className="btn-reset">
                  Submit another request
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <CtaBand
        title="Prefer to just send an email?"
        description="Reach us directly at hello@helpdeskexpert.com — we respond within 2 business hours."
        primaryLabel="Contact Us →"
        primaryHref="/contact"
      />
    </>
  );
}
