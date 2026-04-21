"use client";

import { useActionState } from "react";
import { register } from "@/actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, null);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="auth-logo">
            HelpDesk<span>Expert</span>
          </Link>
          <h1>Create account</h1>
          <p>Get started with HelpDesk Expert</p>
        </div>

        <form action={formAction} className="auth-form">
          {state?.error && <div className="auth-error">{state.error}</div>}
          {state?.success && (
            <div className="auth-success">{state.success}</div>
          )}

          <div className="auth-row-2col">
            <label className="auth-label">
              First name
              <input
                type="text"
                name="firstName"
                required
                placeholder="John"
                className="auth-input"
              />
            </label>
            <label className="auth-label">
              Last name
              <input
                type="text"
                name="lastName"
                required
                placeholder="Doe"
                className="auth-input"
              />
            </label>
          </div>

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

          <label className="auth-label">
            Company
            <input
              type="text"
              name="company"
              placeholder="Acme Inc. (optional)"
              className="auth-input"
            />
          </label>

          <label className="auth-label">
            Password
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

          <button type="submit" disabled={pending} className="auth-btn">
            {pending ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link href="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
