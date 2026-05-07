"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  login,
  register,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "@/actions/auth";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/Login/LoginForm";
import RegisterForm from "@/components/Login/RegisterForm";
import ForgotPassword from "@/components/Login/ForgotPassword";
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

type ForgotStep = "email" | "otp" | "reset";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup" | "forgot">("login");
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /* ── Forgot password state ── */
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const onForgotEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    const fd = new FormData(e.currentTarget);
    const result = await forgotPassword(null, fd);
    setForgotLoading(false);
    if (result?.success && result?.email) {
      setForgotEmail(result.email);
      setForgotStep("otp");
    } else if (result?.error) {
      setForgotError(result.error);
    } else if (result?.success) {
      setForgotError(result.success);
    }
  };

  const onForgotOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    const fd = new FormData(e.currentTarget);
    const result = await verifyOTP(null, fd);
    setForgotLoading(false);
    if (result?.verified) {
      setForgotOtp(fd.get("otp") as string);
      setForgotStep("reset");
    } else if (result?.error) {
      setForgotError(result.error);
    }
  };

  const onResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    setForgotLoading(true);
    const fd = new FormData(e.currentTarget);
    const result = await resetPassword(null, fd);
    setForgotLoading(false);
    if (result?.success) {
      setForgotSuccess(result.success);
    } else if (result?.error) {
      setForgotError(result.error);
    }
  };

  const resetForgotState = () => {
    setForgotStep("email");
    setForgotEmail("");
    setForgotOtp("");
    setForgotError("");
    setForgotSuccess("");
  };

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

  const switchTab = (t: "login" | "signup" | "forgot") => {
    setTab(t);
    setServerError("");
    setServerSuccess("");
    if (t !== "forgot") resetForgotState();
  };

  return (
    <div className="auth-page">
      {/* ── LEFT PANEL ── */}
      <div className="auth-left-panel">
        <div className="brand-side">
          <div className="brand-logo">
            <Link href="/" className="brand-logo">
              HelpDesk<span>Xpert</span>
            </Link>
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
            <Link href="/" className="brand-logo">
              HelpDesk<span>Xpert</span>
            </Link>
          </div>

          {/* TABS */}
          {tab !== "forgot" && (
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
          )}

          {/* ═══ LOGIN VIEW ═══ */}
          {tab === "login" && (
            <LoginForm
              loginForm={loginForm}
              onLogin={onLogin}
              showLoginPw={showLoginPw}
              setShowLoginPw={setShowLoginPw}
              loading={loading}
              serverError={serverError}
              switchTab={switchTab}
            />
          )}

          {/* ═══ SIGNUP VIEW ═══ */}
          {tab === "signup" && (
            <RegisterForm
              regForm={regForm}
              onRegister={onRegister}
              showRegPw={showRegPw}
              setShowRegPw={setShowRegPw}
              showRegCpw={showRegCpw}
              setShowRegCpw={setShowRegCpw}
              agreedTerms={agreedTerms}
              setAgreedTerms={setAgreedTerms}
              termsError={termsError}
              loading={loading}
              serverError={serverError}
              serverSuccess={serverSuccess}
              switchTab={switchTab}
            />
          )}

          {/* ═══ FORGOT PASSWORD VIEW ═══ */}
          {tab === "forgot" && (
            <ForgotPassword
              forgotStep={forgotStep}
              forgotEmail={forgotEmail}
              forgotOtp={forgotOtp}
              forgotError={forgotError}
              forgotSuccess={forgotSuccess}
              forgotLoading={forgotLoading}
              onForgotEmail={onForgotEmail}
              onForgotOtp={onForgotOtp}
              onResetPassword={onResetPassword}
              setForgotStep={setForgotStep}
              setForgotError={setForgotError}
              switchTab={switchTab}
            />
          )}
        </div>
      </div>
    </div>
  );
}
