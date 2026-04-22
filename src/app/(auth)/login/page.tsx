"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, register } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ── Schemas ─────────────────────────────────────────── */
const loginSchema = z.object({
  email: z.email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    email: z.email("Valid email required"),
    company: z.string().optional(),
    password: z
      .string()
      .min(8, "Min 8 chars, 1 uppercase, 1 number")
      .regex(/[A-Z]/, "Min 8 chars, 1 uppercase, 1 number")
      .regex(/[0-9]/, "Min 8 chars, 1 uppercase, 1 number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

/* ── Password strength helper ────────────────────────── */
function getStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const colors = ["#FF4F4F", "#FFB020", "#FFB020", "#2ECC8A"];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  return { score: s, color: colors[s - 1] || "", label: labels[s - 1] || "" };
}

/* ── Eye icons ───────────────────────────────────────── */
const EyeOpen = () => (
  <svg viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeClosed = () => (
  <svg viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /* ── Login form ── */
  const [showLoginPw, setShowLoginPw] = useState(false);
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onLogin = async (data: LoginValues) => {
    setServerError("");
    setLoading(true);
    const fd = new FormData();
    fd.append("email", data.email);
    fd.append("password", data.password);
    const result = await login(null, fd);
    setLoading(false);
    if (result?.success) {
      router.push("/");
      router.refresh();
    } else if (result?.error) {
      setServerError(result.error);
    }
  };

  /* ── Register form ── */
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegCpw, setShowRegCpw] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const regForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const regPw = regForm.watch("password") || "";
  const strength = useMemo(() => getStrength(regPw), [regPw]);

  const onRegister = async (data: RegisterValues) => {
    if (!agreedTerms) {
      setTermsError(true);
      return;
    }
    setTermsError(false);
    setServerError("");
    setServerSuccess("");
    setLoading(true);
    const fd = new FormData();
    fd.append("firstName", data.firstName);
    fd.append("lastName", data.lastName);
    fd.append("email", data.email);
    fd.append("company", data.company || "");
    fd.append("password", data.password);
    fd.append("confirmPassword", data.confirmPassword);
    const result = await register(null, fd);
    setLoading(false);
    if (result?.success) {
      setServerSuccess(result.success);
      setServerError("");
    } else if (result?.error) {
      setServerError(result.error);
    }
  };

  const switchTab = (t: "login" | "signup") => {
    setTab(t);
    setServerError("");
    setServerSuccess("");
  };

  return (
    <div className="auth-page">
      {/* ── LEFT PANEL ── */}
      <div className="auth-left-panel">
        <div className="brand-side">
          <div className="brand-logo">
            HelpDesk<span>Expert</span>
          </div>
          <h1>
            Your support team,
            <br />
            <em>fully managed</em>
          </h1>
          <p>
            Sign in to access your invoice dashboard, manage clients, and track
            your outsourced agents — all from one place.
          </p>
          <ul className="feature-list">
            <li>
              <span className="feat-check">
                <svg viewBox="0 0 12 12">
                  <polyline points="2,6 5,9 10,3" />
                </svg>
              </span>
              Create and send professional invoices
            </li>
            <li>
              <span className="feat-check">
                <svg viewBox="0 0 12 12">
                  <polyline points="2,6 5,9 10,3" />
                </svg>
              </span>
              Manage your full SaaS client database
            </li>
            <li>
              <span className="feat-check">
                <svg viewBox="0 0 12 12">
                  <polyline points="2,6 5,9 10,3" />
                </svg>
              </span>
              Track payment status in real-time
            </li>
            <li>
              <span className="feat-check">
                <svg viewBox="0 0 12 12">
                  <polyline points="2,6 5,9 10,3" />
                </svg>
              </span>
              Download branded PDF invoices instantly
            </li>
            <li>
              <span className="feat-check">
                <svg viewBox="0 0 12 12">
                  <polyline points="2,6 5,9 10,3" />
                </svg>
              </span>
              Monitor agent performance and CSAT scores
            </li>
          </ul>
          <div className="brand-stats">
            <div className="b-stat">
              <strong>200+</strong>
              <span>SaaS clients</span>
            </div>
            <div className="b-stat">
              <strong>98%</strong>
              <span>Retention rate</span>
            </div>
            <div className="b-stat">
              <strong>4.9★</strong>
              <span>Avg CSAT</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right-panel">
        <div className="auth-box">
          <div className="auth-logo">
            HelpDesk<span>Expert</span>
          </div>

          {/* TABS */}
          <div className="auth-tabs">
            <button
              className={`auth-tab${tab === "login" ? " active" : ""}`}
              onClick={() => switchTab("login")}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`auth-tab${tab === "signup" ? " active" : ""}`}
              onClick={() => switchTab("signup")}
              type="button"
            >
              Create Account
            </button>
          </div>

          {/* ═══ LOGIN VIEW ═══ */}
          {tab === "login" && (
            <div>
              <h2 className="auth-title">Welcome back</h2>
              <p className="auth-sub">
                Sign in to your HelpDesk Expert account.
              </p>

              {serverError && (
                <div className="alert alert-error">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={loginForm.handleSubmit(onLogin)}>
                {/* Email */}
                <div
                  className={`field${loginForm.formState.errors.email ? " invalid" : ""}`}
                >
                  <label>
                    Email address <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <input
                      type="email"
                      placeholder="you@company.com"
                      autoComplete="email"
                      {...loginForm.register("email")}
                    />
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                  </div>
                  {loginForm.formState.errors.email && (
                    <div className="err-text">
                      {loginForm.formState.errors.email.message}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div
                  className={`field${loginForm.formState.errors.password ? " invalid" : ""}`}
                >
                  <label>
                    Password <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <input
                      type={showLoginPw ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...loginForm.register("password")}
                    />
                    <button
                      className="toggle-pw"
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowLoginPw(!showLoginPw)}
                    >
                      {showLoginPw ? <EyeClosed /> : <EyeOpen />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <div className="err-text">
                      {loginForm.formState.errors.password.message}
                    </div>
                  )}
                </div>

                <div className="remember-row">
                  <div className="check-row">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Keep me signed in</label>
                  </div>
                  <Link href="/reset-password" className="forgot-link-inline">
                    Forgot password?
                  </Link>
                </div>

                <button
                  className="btn-primary w-full"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner" /> Please wait…
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="divider">or continue with</div>

              <div className="social-buttons">
                <button type="button" className="btn-social">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>
                <button type="button" className="btn-social">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M11.4 24H0V12.6L11.4 0H24v11.4L12.6 24h-1.2z"
                      fill="#F25022"
                      opacity="0"
                    />
                    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                    <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                    <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                    <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
                  </svg>
                  Microsoft
                </button>
              </div>

              <div className="auth-switch">
                No account?{" "}
                <button type="button" onClick={() => switchTab("signup")}>
                  Create one free
                </button>
              </div>
            </div>
          )}

          {/* ═══ SIGNUP VIEW ═══ */}
          {tab === "signup" && (
            <div>
              <h2 className="auth-title">Create your account</h2>
              <p className="auth-sub">
                Get started with HelpDesk Expert — free to try.
              </p>

              {serverError && (
                <div className="alert alert-error">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{serverError}</span>
                </div>
              )}

              {serverSuccess && (
                <div className="alert alert-success">
                  <svg viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{serverSuccess}</span>
                </div>
              )}

              <form onSubmit={regForm.handleSubmit(onRegister)}>
                {/* Name row */}
                <div className="field-row">
                  <div
                    className={`field${regForm.formState.errors.firstName ? " invalid" : ""}`}
                  >
                    <label>
                      First name <span className="req">*</span>
                    </label>
                    <div className="input-wrap">
                      <input
                        type="text"
                        placeholder="Sarah"
                        {...regForm.register("firstName")}
                      />
                    </div>
                    {regForm.formState.errors.firstName && (
                      <div className="err-text">
                        {regForm.formState.errors.firstName.message}
                      </div>
                    )}
                  </div>
                  <div
                    className={`field${regForm.formState.errors.lastName ? " invalid" : ""}`}
                  >
                    <label>
                      Last name <span className="req">*</span>
                    </label>
                    <div className="input-wrap">
                      <input
                        type="text"
                        placeholder="Johnson"
                        {...regForm.register("lastName")}
                      />
                    </div>
                    {regForm.formState.errors.lastName && (
                      <div className="err-text">
                        {regForm.formState.errors.lastName.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div
                  className={`field${regForm.formState.errors.email ? " invalid" : ""}`}
                >
                  <label>
                    Work email <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <input
                      type="email"
                      placeholder="sarah@yourcompany.com"
                      {...regForm.register("email")}
                    />
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                  </div>
                  {regForm.formState.errors.email && (
                    <div className="err-text">
                      {regForm.formState.errors.email.message}
                    </div>
                  )}
                </div>

                {/* Company */}
                <div className="field">
                  <label>Company</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="Acme Inc."
                      {...regForm.register("company")}
                    />
                  </div>
                </div>

                {/* Password */}
                <div
                  className={`field${regForm.formState.errors.password ? " invalid" : ""}`}
                >
                  <label>
                    Password <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <input
                      type={showRegPw ? "text" : "password"}
                      placeholder="Min. 8 chars, 1 uppercase, 1 number"
                      {...regForm.register("password")}
                    />
                    <button
                      className="toggle-pw"
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowRegPw(!showRegPw)}
                    >
                      {showRegPw ? <EyeClosed /> : <EyeOpen />}
                    </button>
                  </div>
                  {regForm.formState.errors.password && (
                    <div className="err-text">
                      {regForm.formState.errors.password.message}
                    </div>
                  )}
                  {regPw.length > 0 && (
                    <div className="pw-strength">
                      <div className="pw-bars">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="pw-bar"
                            style={{
                              background:
                                i <= strength.score
                                  ? strength.color
                                  : undefined,
                            }}
                          />
                        ))}
                      </div>
                      <div
                        className="pw-label"
                        style={{ color: strength.color }}
                      >
                        {strength.label}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div
                  className={`field${regForm.formState.errors.confirmPassword ? " invalid" : ""}`}
                >
                  <label>
                    Confirm password <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <input
                      type={showRegCpw ? "text" : "password"}
                      placeholder="Repeat password"
                      {...regForm.register("confirmPassword")}
                    />
                    <button
                      className="toggle-pw"
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowRegCpw(!showRegCpw)}
                    >
                      {showRegCpw ? <EyeClosed /> : <EyeOpen />}
                    </button>
                  </div>
                  {regForm.formState.errors.confirmPassword && (
                    <div className="err-text">
                      {regForm.formState.errors.confirmPassword.message}
                    </div>
                  )}
                </div>

                {/* Terms */}
                <div className="check-row">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedTerms}
                    onChange={(e) => {
                      setAgreedTerms(e.target.checked);
                      if (e.target.checked) setTermsError(false);
                    }}
                  />
                  <label htmlFor="terms">
                    I agree to the{" "}
                    <Link href="/terms-of-service">Terms of Service</Link> and{" "}
                    <Link href="/privacy-policy">Privacy Policy</Link>
                  </label>
                </div>
                {termsError && (
                  <div
                    className="err-text"
                    style={{ marginTop: "-0.7rem", marginBottom: "0.8rem" }}
                  >
                    You must accept the terms.
                  </div>
                )}

                <button
                  className="btn-primary w-full"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner" /> Please wait…
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="divider">or sign up with</div>

              <div className="social-buttons">
                <button type="button" className="btn-social">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>
                <button type="button" className="btn-social">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M11.4 24H0V12.6L11.4 0H24v11.4L12.6 24h-1.2z"
                      fill="#F25022"
                      opacity="0"
                    />
                    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                    <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                    <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                    <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
                  </svg>
                  Microsoft
                </button>
              </div>

              <div className="auth-switch">
                Already have an account?{" "}
                <button type="button" onClick={() => switchTab("login")}>
                  Sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
