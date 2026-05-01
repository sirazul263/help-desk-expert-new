import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  return transporter.sendMail({
    from:
      process.env.SMTP_FROM || "HelpDeskXpert <noreply@helpdeskexpert.com>",
    to,
    subject,
    html,
  });
}

export function buildOTPEmail(name: string, otp: string): string {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 12px;">
      <h2 style="color: #1a1a1a; margin-bottom: 8px;">Password Reset</h2>
      <p style="color: #555; font-size: 15px;">Hi ${name},</p>
      <p style="color: #555; font-size: 15px;">Use the code below to reset your password. This code expires in <strong>10 minutes</strong>.</p>
      <div style="text-align: center; margin: 28px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #ff5c35; background: #fff5f2; padding: 16px 32px; border-radius: 8px;">${otp}</span>
      </div>
      <p style="color: #999; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #bbb; font-size: 12px; text-align: center;">HelpDeskXpert</p>
    </div>
  `;
}
