"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="auth-logo">
            HelpDesk<span>Expert</span>
          </Link>
          <h1>Welcome back</h1>
          <p>Sign in to your account</p>
        </div>

        <form action={formAction} className="auth-form">
          {state?.error && <div className="auth-error">{state.error}</div>}

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
            Password
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="auth-input"
            />
          </label>

          <div className="auth-row">
            <Link href="/reset-password" className="auth-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={pending} className="auth-btn">
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="auth-footer-text">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="auth-link">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
