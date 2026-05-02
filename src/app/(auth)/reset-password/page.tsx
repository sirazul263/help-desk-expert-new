"use client";

import { useActionState, useState } from "react";
import { forgotPassword, verifyOTP, resetPassword } from "@/actions/auth";
import Link from "next/link";

type Step = "email" | "otp" | "reset";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Step 1: Request OTP
  const [emailState, emailAction, emailPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await forgotPassword(_prev, formData);
      if (result?.success && result?.email) {
        setEmail(result.email);
        setStep("otp");
      }
      return result;
    },
    null,
  );

  // Step 2: Verify OTP
  const [otpState, otpAction, otpPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await verifyOTP(_prev, formData);
      if (result?.verified) {
        setOtp(formData.get("otp") as string);
        setStep("reset");
      }
      return result;
    },
    null,
  );

  // Step 3: New password
  const [resetState, resetAction, resetPending] = useActionState(
    resetPassword,
    null,
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="auth-logo">
            HelpDesk<span>Xpert</span>
          </Link>
          <h1>Reset password</h1>
          <p>
            {step === "email" && "Enter your email to receive a reset code"}
            {step === "otp" && "Enter the 6-digit code sent to your email"}
            {step === "reset" && "Choose a new password"}
          </p>
        </div>

        {/* ── Step 1: Email ── */}
        {step === "email" && (
          <form action={emailAction} className="auth-form">
            {emailState?.error && (
              <div className="auth-error">{emailState.error}</div>
            )}

            <label className="auth-label">
              Email
              <input
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                className="auth-input"
              />
            </label>

            <button type="submit" disabled={emailPending} className="auth-btn">
              {emailPending ? "Sending…" : "Send reset code"}
            </button>
          </form>
        )}

        {/* ── Step 2: OTP ── */}
        {step === "otp" && (
          <form action={otpAction} className="auth-form">
            {otpState?.error && (
              <div className="auth-error">{otpState.error}</div>
            )}

            <input type="hidden" name="email" value={email} />

            <label className="auth-label">
              6-digit code
              <input
                type="text"
                name="otp"
                required
                maxLength={6}
                pattern="[0-9]{6}"
                placeholder="000000"
                className="auth-input auth-input-otp"
                autoFocus
              />
            </label>

            <button type="submit" disabled={otpPending} className="auth-btn">
              {otpPending ? "Verifying…" : "Verify code"}
            </button>

            <button
              type="button"
              className="auth-btn-ghost"
              onClick={() => setStep("email")}
            >
              Back
            </button>
          </form>
        )}

        {/* ── Step 3: New Password ── */}
        {step === "reset" && (
          <form action={resetAction} className="auth-form">
            {resetState?.error && (
              <div className="auth-error">{resetState.error}</div>
            )}
            {resetState?.success && (
              <div className="auth-success">
                {resetState.success}{" "}
                <Link href="/login" className="auth-link">
                  Sign in →
                </Link>
              </div>
            )}

            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="otp" value={otp} />

            <label className="auth-label">
              New password
              <input
                type="password"
                name="password"
                required
                minLength={8}
                placeholder="••••••••"
                className="auth-input"
              />
            </label>

            <label className="auth-label">
              Confirm password
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                className="auth-input"
              />
            </label>

            <button type="submit" disabled={resetPending} className="auth-btn">
              {resetPending ? "Resetting…" : "Reset password"}
            </button>
          </form>
        )}

        <p className="auth-footer-text">
          Remember your password?{" "}
          <Link href="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
