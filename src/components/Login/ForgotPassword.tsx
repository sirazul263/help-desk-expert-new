"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

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

export default function ForgotPassword({
  forgotStep,
  forgotEmail,
  forgotOtp,
  forgotError,
  forgotSuccess,
  forgotLoading,
  onForgotEmail,
  onForgotOtp,
  onResetPassword,
  setForgotStep,
  setForgotError,
  switchTab,
}: any) {
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="btn-back flex items-center gap-1 !py-1"
        onClick={() => switchTab("login")}
      >
        <ArrowLeft
          style={{ verticalAlign: "middle" }}
          className="inline-block w-4 h-4"
        />
        Back
      </button>
      <h2 className="auth-title !mt-10">
        {forgotStep === "email" && "Reset password"}
        {forgotStep === "otp" && "Enter verification code"}
        {forgotStep === "reset" && "Choose new password"}
      </h2>
      <p className="auth-sub">
        {forgotStep === "email" && "Enter your email to receive a reset code."}
        {forgotStep === "otp" && "Enter the 6-digit code sent to your email."}
        {forgotStep === "reset" && "Set your new password below."}
      </p>

      {forgotError && (
        <div className="alert alert-error">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{forgotError}</span>
        </div>
      )}

      {forgotSuccess && (
        <div className="alert alert-success">
          <svg viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{forgotSuccess}</span>
        </div>
      )}

      {forgotStep === "email" && (
        <form onSubmit={onForgotEmail}>
          <div className="field">
            <label>
              Email address <span className="req">*</span>
            </label>
            <div className="input-wrap">
              <input
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                autoComplete="email"
              />
              <span className="input-icon">
                <svg viewBox="0 0 24 24">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
            </div>
          </div>
          <button
            className="btn-primary w-full"
            type="submit"
            disabled={forgotLoading}
          >
            {forgotLoading ? (
              <>
                <span className="spinner" /> Sending…
              </>
            ) : (
              "Send reset code"
            )}
          </button>
        </form>
      )}

      {forgotStep === "otp" && (
        <form onSubmit={onForgotOtp}>
          <input type="hidden" name="email" value={forgotEmail} />
          <div className="field">
            <label>
              6-digit code <span className="req">*</span>
            </label>
            <div className="input-wrap">
              <input
                type="text"
                name="otp"
                required
                maxLength={6}
                pattern="[0-9]{6}"
                placeholder="000000"
                autoFocus
                style={{
                  letterSpacing: "6px",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                }}
              />
            </div>
          </div>
          <button
            className="btn-primary w-full"
            type="submit"
            disabled={forgotLoading}
          >
            {forgotLoading ? (
              <>
                <span className="spinner" /> Verifying…
              </>
            ) : (
              "Verify code"
            )}
          </button>
          <button
            type="button"
            className="btn-secondary w-full"
            style={{ marginTop: "0.5rem" }}
            onClick={() => {
              setForgotStep("email");
              setForgotError("");
            }}
          >
            Back
          </button>
        </form>
      )}

      {forgotStep === "reset" && !forgotSuccess && (
        <form onSubmit={onResetPassword}>
          <input type="hidden" name="email" value={forgotEmail} />
          <input type="hidden" name="otp" value={forgotOtp} />
          <div className="field">
            <label>
              New password <span className="req">*</span>
            </label>
            <div className="input-wrap">
              <input
                type={showNewPw ? "text" : "password"}
                name="password"
                required
                minLength={8}
                placeholder="••••••••"
              />
              <button
                className="toggle-pw"
                type="button"
                aria-label={showNewPw ? "Hide password" : "Show password"}
                tabIndex={-1}
                onClick={() => setShowNewPw(!showNewPw)}
              >
                {showNewPw ? <EyeClosed /> : <EyeOpen />}
              </button>
            </div>
          </div>
          <div className="field">
            <label>
              Confirm password <span className="req">*</span>
            </label>
            <div className="input-wrap">
              <input
                type={showConfirmPw ? "text" : "password"}
                name="confirmPassword"
                required
                placeholder="••••••••"
              />
              <button
                className="toggle-pw"
                type="button"
                aria-label={showConfirmPw ? "Hide password" : "Show password"}
                tabIndex={-1}
                onClick={() => setShowConfirmPw(!showConfirmPw)}
              >
                {showConfirmPw ? <EyeClosed /> : <EyeOpen />}
              </button>
            </div>
          </div>
          <button
            className="btn-primary w-full"
            type="submit"
            disabled={forgotLoading}
          >
            {forgotLoading ? (
              <>
                <span className="spinner" /> Resetting…
              </>
            ) : (
              "Reset password"
            )}
          </button>
        </form>
      )}

      <div className="auth-switch">
        Remember your password?{" "}
        <button type="button" onClick={() => switchTab("login")}>
          Sign in
        </button>
      </div>
    </div>
  );
}
