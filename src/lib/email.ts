import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY);

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  const { data, error } = await resend.emails.send({
    from:
      process.env.EMAIL_FROM || "HelpDeskXpert <noreply@helpdeskexpert.com>",
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return data;
}

export function buildOTPEmail(name: string, otp: string): string {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://helpdeskexpert.com";
  return `
    <!doctype html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style="margin:0;padding:0;background:#f4f6f8;font-family: 'Segoe UI', Arial, sans-serif;">
      <span style="display:none;font-size:1px;color:#fff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">Your HelpDeskXpert password reset code</span>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding:24px 12px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e9ee;">
              <tr>
                <td style="padding:24px 28px 0;background:linear-gradient(90deg,#0f172a 0%,#0b75ff 100%);color:#fff;">
                  <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:44px;height:44px;border-radius:8px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;">HD</div>
                    <div>
                      <div style="font-size:18px;font-weight:700;letter-spacing:0.2px;">HelpDeskXpert</div>
                      <div style="font-size:12px;opacity:0.9;margin-top:2px;">Secure account actions</div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 36px 18px;color:#0f172a;">
                  <h1 style="margin:0 0 8px;font-size:20px;">Password reset code</h1>
                  <p style="margin:0 0 16px;color:#475569;font-size:15px;">Hi ${name || "there"},</p>
                  <p style="margin:0 0 20px;color:#64748b;font-size:14px;">Use the one-time verification code below to reset your HelpDeskXpert password. The code expires in <strong>10 minutes</strong>.</p>

                  <div style="text-align:center;margin:22px 0;">
                    <div style="display:inline-block;padding:18px 28px;border-radius:12px;background:#fff5f0;border:1px solid #ffe6db;">
                      <div style="font-family: monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono';font-size:28px;letter-spacing:6px;color:#ff5c35;font-weight:700;">${otp}</div>
                    </div>
                  </div>

                  <div style="text-align:center;margin:18px 0 8px;">
                    <a href="${appUrl}/login" style="display:inline-block;padding:10px 20px;border-radius:8px;background:#0b75ff;color:#fff;text-decoration:none;font-weight:600;">Go to sign in</a>
                  </div>

                  <p style="margin:18px 0 0;color:#94a3b8;font-size:13px;">If you did not request a password reset, you can safely ignore this email or contact our support.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 36px 26px;border-top:1px solid #f1f5f9;background:#fbfdff;color:#64748b;font-size:13px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
                    <div>HelpDeskXpert — <span style="white-space:nowrap;">Customer Support</span></div>
                    <div style="opacity:0.9">© ${new Date().getFullYear()} HelpDeskXpert</div>
                  </div>
                  <div style="margin-top:8px;color:#9aa7b6;font-size:12px;">Support: <a href="mailto:support@helpdeskexpert.com" style="color:#0b75ff;text-decoration:none;">support@helpdeskexpert.com</a></div>
                </td>
              </tr>
            </table>
            <div style="max-width:600px;margin:16px auto 0;color:#94a3b8;font-size:12px;text-align:center;">If the button doesn't work, copy and paste this link into your browser: ${appUrl}/login</div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
