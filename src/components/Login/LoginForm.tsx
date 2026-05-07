"use client";

import React from "react";

export default function LoginForm({
  loginForm,
  onLogin,
  showLoginPw,
  setShowLoginPw,
  loading,
  serverError,
  switchTab,
}: any) {
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

  return (
    <div>
      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-sub">Sign in to your HelpDeskXpert account.</p>

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
        <div className={`field${loginForm.formState.errors.email ? " invalid" : ""}`}>
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
            <div className="err-text">{loginForm.formState.errors.email.message}</div>
          )}
        </div>

        <div className={`field${loginForm.formState.errors.password ? " invalid" : ""}`}>
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
            <div className="err-text">{loginForm.formState.errors.password.message}</div>
          )}
        </div>

        <div className="remember-row">
          <div className="check-row">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Keep me signed in</label>
          </div>
          <button type="button" className="forgot-link-inline" onClick={() => switchTab("forgot")}>Forgot password?</button>
        </div>

        <button className="btn-primary w-full" type="submit" disabled={loading}>
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
        <button type="button" className="btn-social">Google</button>
        <button type="button" className="btn-social">Microsoft</button>
      </div>

      <div className="auth-switch">
        No account? <button type="button" onClick={() => switchTab("signup")}>Create one free</button>
      </div>
    </div>
  );
}
