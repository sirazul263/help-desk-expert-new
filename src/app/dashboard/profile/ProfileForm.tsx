"use client";

import { useActionState } from "react";
import { updateProfile } from "@/actions/auth";
import { useEffect, useState } from "react";

interface ProfileFormProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    company: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, null);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [company, setCompany] = useState(user.company ?? "");

  useEffect(() => {
    if (state?.success) {
      // values already in sync
    }
  }, [state]);

  return (
    <form action={formAction} className="auth-form" style={{ maxWidth: 480 }}>
      {state?.error && <div className="auth-error">{state.error}</div>}
      {state?.success && <div className="auth-success">{state.success}</div>}

      <div className="auth-row-2col">
        <label className="auth-label">
          First name
          <input
            type="text"
            name="firstName"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="auth-input"
          />
        </label>
        <label className="auth-label">
          Last name
          <input
            type="text"
            name="lastName"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="auth-input"
          />
        </label>
      </div>

      <label className="auth-label">
        Email
        <input
          type="email"
          value={user.email}
          disabled
          className="auth-input"
          style={{ opacity: 0.5 }}
        />
      </label>

      <label className="auth-label">
        Company
        <input
          type="text"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Acme Inc. (optional)"
          className="auth-input"
        />
      </label>

      <button type="submit" disabled={pending} className="auth-btn">
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
