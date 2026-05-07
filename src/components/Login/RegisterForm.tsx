"use client";

import React, { useMemo } from "react";

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

export default function RegisterForm({
  regForm,
  onRegister,
  showRegPw,
  setShowRegPw,
  showRegCpw,
  setShowRegCpw,
  agreedTerms,
  setAgreedTerms,
  termsError,
  loading,
  serverError,
  serverSuccess,
  switchTab,
}: any) {
  const regPw = regForm.watch("password") || "";
  const strength = useMemo(() => getStrength(regPw), [regPw]);

  return (
    <div>
      <h2 className="auth-title">Create your account</h2>
      <p className="auth-sub">Get started with HelpDeskXpert — free to try.</p>

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
              aria-label={showRegPw ? "Hide password" : "Show password"}
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
                        i <= strength.score ? strength.color : undefined,
                    }}
                  />
                ))}
              </div>
              <div className="pw-label" style={{ color: strength.color }}>
                {strength.label}
              </div>
            </div>
          )}
        </div>

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
              aria-label={showRegCpw ? "Hide password" : "Show password"}
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

        <div className="check-row">
          <input
            type="checkbox"
            id="terms"
            checked={agreedTerms}
            onChange={(e) => {
              setAgreedTerms(e.target.checked);
              if (e.target.checked) setTimeout(() => {}, 0);
            }}
          />
          <label htmlFor="terms">
            I agree to the <a href="/terms-of-service">Terms of Service</a> and{" "}
            <a href="/privacy-policy">Privacy Policy</a>
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

        <button className="btn-primary w-full" type="submit" disabled={loading}>
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
          Google
        </button>
        <button type="button" className="btn-social">
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
  );
}
