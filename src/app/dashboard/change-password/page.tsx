"use client";

import { useActionState } from "react";
import { changePassword } from "@/actions/auth";

export default function ChangePasswordPage() {
  const [state, formAction, pending] = useActionState(changePassword, null);

  return (
    <div>
      <h1 className="dash-title">Change Password</h1>

      <form action={formAction} className="auth-form" style={{ maxWidth: 480 }}>
        {state?.error && <div className="auth-error">{state.error}</div>}
        {state?.success && <div className="auth-success">{state.success}</div>}

        <label className="auth-label">
          Current password
          <input
            type="password"
            name="currentPassword"
            required
            placeholder="••••••••"
            className="auth-input"
          />
        </label>

        <label className="auth-label">
          New password
          <input
            type="password"
            name="newPassword"
            required
            minLength={8}
            placeholder="••••••••"
            className="auth-input"
          />
        </label>

        <label className="auth-label">
          Confirm new password
          <input
            type="password"
            name="confirmPassword"
            required
            placeholder="••••••••"
            className="auth-input"
          />
        </label>

        <button type="submit" disabled={pending} className="auth-btn">
          {pending ? "Changing…" : "Change password"}
        </button>
      </form>
    </div>
  );
}
