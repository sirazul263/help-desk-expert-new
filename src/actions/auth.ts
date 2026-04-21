"use server";

import { prisma } from "@/lib/prisma";
import { signIn, signOut, auth, hashPassword, verifyPassword, generateOTP } from "@/lib/auth";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOTPSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "@/lib/validations";
import { sendMail, buildOTPEmail } from "@/lib/email";
import { headers } from "next/headers";
import { AuthError } from "next-auth";

// ── Helper: get IP from request ───────────────────────
async function getRequestIP() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

// ── REGISTER ──────────────────────────────────────────
export async function register(_prev: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { firstName, lastName, email, company, password } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const hashed = await hashPassword(password);

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email: email.toLowerCase(),
      company: company || null,
      password: hashed,
    },
  });

  return { success: "Account created! You can now log in." };
}

// ── LOGIN ─────────────────────────────────────────────
export async function login(_prev: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password } = parsed.data;
  const ip = await getRequestIP();

  // Rate-limit: max 5 failed attempts in 15 min
  const recentFails = await prisma.loginAttempt.count({
    where: {
      email: email.toLowerCase(),
      success: false,
      createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) },
    },
  });
  if (recentFails >= 5) {
    return {
      error: "Too many failed attempts. Please try again in 15 minutes.",
    };
  }

  try {
    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirect: false,
    });

    // Log successful attempt
    await prisma.loginAttempt.create({
      data: { email: email.toLowerCase(), ipAddress: ip, success: true },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      await prisma.loginAttempt.create({
        data: { email: email.toLowerCase(), ipAddress: ip, success: false },
      });
      return { error: "Invalid email or password" };
    }
    throw error;
  }
}

// ── LOGOUT ────────────────────────────────────────────
export async function logout() {
  await signOut({ redirect: false });
}

// ── FORGOT PASSWORD (send OTP) ───────────────────────
export async function forgotPassword(_prev: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // Always return success to avoid email enumeration
  if (!user) {
    return { success: "If an account exists, a reset code has been sent." };
  }

  // Invalidate previous unused tokens
  await prisma.resetToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.resetToken.create({
    data: {
      userId: user.id,
      token: otp,
      expiresAt,
    },
  });

  // Send email
  try {
    await sendMail({
      to: user.email,
      subject: "Your Password Reset Code — HelpDesk Expert",
      html: buildOTPEmail(user.firstName, otp),
    });
  } catch (e) {
    console.error("Failed to send OTP email:", e);
    return { error: "Failed to send email. Please try again." };
  }

  return {
    success: "If an account exists, a reset code has been sent.",
    email: user.email,
  };
}

// ── VERIFY OTP ───────────────────────────────────────
export async function verifyOTP(_prev: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = verifyOTPSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, otp } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return { error: "Invalid code" };
  }

  const resetToken = await prisma.resetToken.findFirst({
    where: {
      userId: user.id,
      token: otp,
      used: false,
      expiresAt: { gte: new Date() },
    },
  });

  if (!resetToken) {
    return { error: "Invalid or expired code" };
  }

  return { success: "Code verified", verified: true };
}

// ── RESET PASSWORD ───────────────────────────────────
export async function resetPassword(_prev: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, otp, password } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return { error: "Invalid request" };
  }

  const resetToken = await prisma.resetToken.findFirst({
    where: {
      userId: user.id,
      token: otp,
      used: false,
      expiresAt: { gte: new Date() },
    },
  });

  if (!resetToken) {
    return { error: "Invalid or expired code" };
  }

  const hashed = await hashPassword(password);

  // Update password & mark token as used
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    }),
    prisma.resetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    }),
    // Invalidate all sessions (force re-login)
    prisma.session.deleteMany({
      where: { userId: user.id },
    }),
  ]);

  return { success: "Password reset successfully. You can now log in." };
}

// ── GET CURRENT USER (for server components) ─────────
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      company: true,
      image: true,
    },
  });

  return user;
}

// ── UPDATE PROFILE ───────────────────────────────────
export async function updateProfile(_prev: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const raw = Object.fromEntries(formData);
  const parsed = updateProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { firstName, lastName, company } = parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName,
      lastName,
      company: company || null,
    },
  });

  return { success: "Profile updated successfully." };
}

// ── CHANGE PASSWORD ──────────────────────────────────
export async function changePassword(_prev: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const raw = Object.fromEntries(formData);
  const parsed = changePasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { error: "User not found" };
  }

  const isValid = await verifyPassword(currentPassword, user.password);
  if (!isValid) {
    return { error: "Current password is incorrect" };
  }

  const hashed = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return { success: "Password changed successfully." };
}
