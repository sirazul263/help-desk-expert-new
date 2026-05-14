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
      process.env.EMAIL_FROM || "HelpDeskXpert <contact@helpdeskexpert.com>",
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return data;
}

export function buildAdminEmail(subject: string, body: string): string {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://helpdeskexpert.com";
  const bodyHtml = body
    .split(/\r?\n\r?\n/)
    .map((p) => `<p style="margin:0 0 14px;color:#334155;font-size:14.5px;line-height:1.7;">${p.replace(/\r?\n/g, "<br/>")}</p>`)
    .join("");
  return `
    <!doctype html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding:24px 12px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e9ee;">
              <tr>
                <td style="padding:22px 28px 20px;background:linear-gradient(90deg,#0f172a 0%,#0b75ff 100%);color:#fff;">
                  <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:40px;height:40px;border-radius:8px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;">HD</div>
                    <div>
                      <div style="font-size:17px;font-weight:700;">HelpDeskXpert</div>
                      <div style="font-size:12px;opacity:.85;margin-top:2px;">Customer Support Platform</div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 36px 8px;">
                  <h1 style="margin:0 0 20px;font-size:18px;color:#0f172a;font-weight:700;">${subject}</h1>
                  ${bodyHtml}
                </td>
              </tr>
              <tr>
                <td style="padding:16px 36px 28px;">
                  <div style="text-align:center;margin:8px 0 16px;">
                    <a href="${appUrl}" style="display:inline-block;padding:10px 22px;border-radius:8px;background:#0b75ff;color:#fff;text-decoration:none;font-weight:600;font-size:14px;">Visit HelpDeskXpert</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 36px 24px;border-top:1px solid #f1f5f9;background:#fbfdff;color:#64748b;font-size:13px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
                    <div>HelpDeskXpert — Customer Support</div>
                    <div>© ${new Date().getFullYear()} HelpDeskXpert</div>
                  </div>
                  <div style="margin-top:8px;color:#9aa7b6;font-size:12px;">Support: <a href="mailto:contact@helpdeskexpert.com" style="color:#0b75ff;text-decoration:none;">contact@helpdeskexpert.com</a></div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function buildPromotionalEmail(): string {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://helpdeskxpert.com";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>HelpDesk Expert &ndash; World-Class Support, On Demand</title>
<!--[if mso]>
<style type="text/css">table, td { font-family: Georgia, serif !important; }</style>
<![endif]-->
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
  body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
  @media screen and (max-width: 600px) {
    .container { width: 100% !important; max-width: 100% !important; }
    .px-mobile { padding-left: 24px !important; padding-right: 24px !important; }
    .stack { display: block !important; width: 100% !important; }
    .h1-mobile { font-size: 32px !important; line-height: 1.15 !important; }
    .service-cell { padding: 20px !important; }
    .hide-mobile { display: none !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#F4F1EC; font-family: Georgia, 'Times New Roman', serif;">
<div style="display:none; font-size:1px; color:#F4F1EC; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
  Trained SaaS support agents, live in 48 hours. 4.9&#9733; CSAT. No long-term contract.
</div>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F4F1EC;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="max-width:600px; background-color:#FFFFFF; border-radius:4px; overflow:hidden;">
      <!-- Header -->
      <tr>
        <td class="px-mobile" style="padding:32px 40px 24px 40px; border-bottom:1px solid #EAE4D8;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="left" style="font-family: Georgia, 'Times New Roman', serif; font-size:20px; font-weight:bold; color:#0E1E2B; letter-spacing:-0.3px;">
                HelpDesk<span style="color:#C8704A;">Expert</span>
              </td>
              <td align="right" class="hide-mobile" style="font-family: Georgia, serif; font-size:12px; color:#6B6357; letter-spacing:1.5px; text-transform:uppercase;">
                Support, On Demand
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Hero -->
      <tr>
        <td class="px-mobile" style="padding:56px 40px 40px 40px; background-color:#FFFFFF;">
          <p style="margin:0 0 20px 0; font-family: Georgia, serif; font-size:11px; letter-spacing:2.5px; color:#C8704A; text-transform:uppercase; font-weight:bold;">Trusted by 200+ SaaS Companies</p>
          <h1 class="h1-mobile" style="margin:0 0 20px 0; font-family: Georgia, 'Times New Roman', serif; font-size:42px; line-height:1.1; color:#0E1E2B; font-weight:normal; letter-spacing:-1px;">
            World-class support agents,<br><em style="color:#C8704A;">on demand.</em>
          </h1>
          <p style="margin:0 0 32px 0; font-family: Georgia, serif; font-size:17px; line-height:1.6; color:#3D3A33;">
            We place expert customer support agents into your SaaS team &mdash; fully trained, managed, and ready to delight your users from day one.
          </p>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="background-color:#0E1E2B; border-radius:2px;">
                <a href="${appUrl}/contact" target="_blank" style="display:inline-block; padding:16px 36px; font-family: Georgia, serif; font-size:15px; color:#FFFFFF; text-decoration:none; font-weight:bold; letter-spacing:0.5px;">Book a Free Consultation &rarr;</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Stats -->
      <tr>
        <td style="background-color:#0E1E2B; padding:32px 40px;" class="px-mobile">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td class="stack" align="center" width="25%" style="padding:8px 4px;">
                <p style="margin:0; font-family: Georgia, serif; font-size:28px; color:#C8704A; font-weight:bold;">2,000+</p>
                <p style="margin:4px 0 0 0; font-family: Georgia, serif; font-size:11px; color:#A8A199; letter-spacing:1.5px; text-transform:uppercase;">Agents Placed</p>
              </td>
              <td class="stack" align="center" width="25%" style="padding:8px 4px;">
                <p style="margin:0; font-family: Georgia, serif; font-size:28px; color:#C8704A; font-weight:bold;">98%</p>
                <p style="margin:4px 0 0 0; font-family: Georgia, serif; font-size:11px; color:#A8A199; letter-spacing:1.5px; text-transform:uppercase;">Retention</p>
              </td>
              <td class="stack" align="center" width="25%" style="padding:8px 4px;">
                <p style="margin:0; font-family: Georgia, serif; font-size:28px; color:#C8704A; font-weight:bold;">&lt;48h</p>
                <p style="margin:4px 0 0 0; font-family: Georgia, serif; font-size:11px; color:#A8A199; letter-spacing:1.5px; text-transform:uppercase;">Onboarding</p>
              </td>
              <td class="stack" align="center" width="25%" style="padding:8px 4px;">
                <p style="margin:0; font-family: Georgia, serif; font-size:28px; color:#C8704A; font-weight:bold;">4.9&#9733;</p>
                <p style="margin:4px 0 0 0; font-family: Georgia, serif; font-size:11px; color:#A8A199; letter-spacing:1.5px; text-transform:uppercase;">Avg. CSAT</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Services Header -->
      <tr>
        <td class="px-mobile" style="padding:56px 40px 8px 40px;">
          <p style="margin:0 0 12px 0; font-family: Georgia, serif; font-size:11px; letter-spacing:2.5px; color:#C8704A; text-transform:uppercase; font-weight:bold;">Our Services</p>
          <h2 style="margin:0 0 12px 0; font-family: Georgia, serif; font-size:28px; line-height:1.2; color:#0E1E2B; font-weight:normal; letter-spacing:-0.5px;">Everything your support team needs.</h2>
          <p style="margin:0 0 32px 0; font-family: Georgia, serif; font-size:16px; line-height:1.6; color:#6B6357;">From tier-1 ticket handling to technical escalations &mdash; we have the right agent for every role.</p>
        </td>
      </tr>
      <!-- Services Grid -->
      <tr>
        <td class="px-mobile" style="padding:0 40px 16px 40px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td class="stack service-cell" width="50%" valign="top" style="padding:24px; background-color:#F9F6F0; border-radius:2px;">
                <p style="margin:0 0 12px 0; font-family: Georgia, serif; font-size:22px; color:#C8704A; font-weight:bold;">01</p>
                <h3 style="margin:0 0 8px 0; font-family: Georgia, serif; font-size:17px; color:#0E1E2B; font-weight:bold;">Live Chat Support</h3>
                <p style="margin:0; font-family: Georgia, serif; font-size:14px; line-height:1.5; color:#3D3A33;">Real-time agents handling chat with fast response times and high CSAT scores.</p>
              </td>
              <td class="hide-mobile" width="16">&nbsp;</td>
              <td class="stack service-cell" width="50%" valign="top" style="padding:24px; background-color:#F9F6F0; border-radius:2px;">
                <p style="margin:0 0 12px 0; font-family: Georgia, serif; font-size:22px; color:#C8704A; font-weight:bold;">02</p>
                <h3 style="margin:0 0 8px 0; font-family: Georgia, serif; font-size:17px; color:#0E1E2B; font-weight:bold;">Email &amp; Ticket Management</h3>
                <p style="margin:0; font-family: Georgia, serif; font-size:14px; line-height:1.5; color:#3D3A33;">Structured inbox management with SLA adherence and escalation workflows.</p>
              </td>
            </tr>
            <tr><td colspan="3" height="16">&nbsp;</td></tr>
            <tr>
              <td class="stack service-cell" width="50%" valign="top" style="padding:24px; background-color:#F9F6F0; border-radius:2px;">
                <p style="margin:0 0 12px 0; font-family: Georgia, serif; font-size:22px; color:#C8704A; font-weight:bold;">03</p>
                <h3 style="margin:0 0 8px 0; font-family: Georgia, serif; font-size:17px; color:#0E1E2B; font-weight:bold;">24/7 Coverage</h3>
                <p style="margin:0; font-family: Georgia, serif; font-size:14px; line-height:1.5; color:#3D3A33;">Round-the-clock agents across time zones &mdash; your users are never left waiting.</p>
              </td>
              <td class="hide-mobile" width="16">&nbsp;</td>
              <td class="stack service-cell" width="50%" valign="top" style="padding:24px; background-color:#F9F6F0; border-radius:2px;">
                <p style="margin:0 0 12px 0; font-family: Georgia, serif; font-size:22px; color:#C8704A; font-weight:bold;">04</p>
                <h3 style="margin:0 0 8px 0; font-family: Georgia, serif; font-size:17px; color:#0E1E2B; font-weight:bold;">Technical Support Agents</h3>
                <p style="margin:0; font-family: Georgia, serif; font-size:14px; line-height:1.5; color:#3D3A33;">SaaS-specialized agents who handle API questions and developer queries.</p>
              </td>
            </tr>
            <tr><td colspan="3" height="16">&nbsp;</td></tr>
            <tr>
              <td class="stack service-cell" width="50%" valign="top" style="padding:24px; background-color:#F9F6F0; border-radius:2px;">
                <p style="margin:0 0 12px 0; font-family: Georgia, serif; font-size:22px; color:#C8704A; font-weight:bold;">05</p>
                <h3 style="margin:0 0 8px 0; font-family: Georgia, serif; font-size:17px; color:#0E1E2B; font-weight:bold;">Team Scaling</h3>
                <p style="margin:0; font-family: Georgia, serif; font-size:14px; line-height:1.5; color:#3D3A33;">Ramp headcount up or down in days &mdash; perfect for launches and growth spurts.</p>
              </td>
              <td class="hide-mobile" width="16">&nbsp;</td>
              <td class="stack service-cell" width="50%" valign="top" style="padding:24px; background-color:#F9F6F0; border-radius:2px;">
                <p style="margin:0 0 12px 0; font-family: Georgia, serif; font-size:22px; color:#C8704A; font-weight:bold;">06</p>
                <h3 style="margin:0 0 8px 0; font-family: Georgia, serif; font-size:17px; color:#0E1E2B; font-weight:bold;">QA &amp; Reporting</h3>
                <p style="margin:0; font-family: Georgia, serif; font-size:14px; line-height:1.5; color:#3D3A33;">Weekly performance reports, CSAT tracking, and QA reviews to keep your bar high.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Divider -->
      <tr>
        <td class="px-mobile" style="padding:48px 40px 24px 40px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr><td style="border-top:1px solid #EAE4D8; line-height:0; font-size:0;">&nbsp;</td></tr>
          </table>
        </td>
      </tr>
      <!-- Testimonial -->
      <tr>
        <td class="px-mobile" style="padding:0 40px 48px 40px;">
          <p style="margin:0 0 16px 0; font-family: Georgia, serif; font-size:24px; color:#C8704A; line-height:1;">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
          <p style="margin:0 0 20px 0; font-family: Georgia, 'Times New Roman', serif; font-size:20px; line-height:1.5; color:#0E1E2B; font-style:italic; font-weight:normal;">
            &ldquo;HelpDesk Expert transformed our support. Response time dropped from 12 hours to under 2 &mdash; and our CSAT jumped from 72% to 96% in three months.&rdquo;
          </p>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td valign="middle" style="padding-right:12px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr><td align="center" valign="middle" width="40" height="40" style="background-color:#0E1E2B; border-radius:20px; font-family: Georgia, serif; font-size:13px; color:#FFFFFF; font-weight:bold;">JK</td></tr>
                </table>
              </td>
              <td valign="middle">
                <p style="margin:0; font-family: Georgia, serif; font-size:14px; color:#0E1E2B; font-weight:bold;">James Keller</p>
                <p style="margin:2px 0 0 0; font-family: Georgia, serif; font-size:13px; color:#6B6357;">Head of CX, Streamly</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Final CTA -->
      <tr>
        <td class="px-mobile" style="padding:48px 40px; background-color:#0E1E2B;">
          <h2 style="margin:0 0 12px 0; font-family: Georgia, serif; font-size:26px; line-height:1.2; color:#FFFFFF; font-weight:normal; letter-spacing:-0.5px;">Ready to level up your support?</h2>
          <p style="margin:0 0 28px 0; font-family: Georgia, serif; font-size:15px; line-height:1.6; color:#A8A199;">Join 200+ SaaS companies that trust HelpDesk Expert to keep their customers happy.</p>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="background-color:#C8704A; border-radius:2px;">
                <a href="${appUrl}/contact" target="_blank" style="display:inline-block; padding:16px 36px; font-family: Georgia, serif; font-size:15px; color:#FFFFFF; text-decoration:none; font-weight:bold; letter-spacing:0.5px;">Book a Free Consultation &rarr;</a>
              </td>
              <td width="12">&nbsp;</td>
              <td align="center" style="border:1px solid #3A4A57; border-radius:2px;">
                <a href="${appUrl}/pricing" target="_blank" style="display:inline-block; padding:15px 28px; font-family: Georgia, serif; font-size:15px; color:#FFFFFF; text-decoration:none; font-weight:bold; letter-spacing:0.5px;">See Pricing</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td class="px-mobile" style="padding:32px 40px; background-color:#F9F6F0; text-align:center;">
          <p style="margin:0 0 12px 0; font-family: Georgia, serif; font-size:16px; color:#0E1E2B; font-weight:bold;">HelpDesk<span style="color:#C8704A;">Expert</span></p>
          <p style="margin:0 0 16px 0; font-family: Georgia, serif; font-size:13px; line-height:1.6; color:#6B6357;">
            World-class outsourced customer support agents for SaaS companies.<br>Fast, reliable, and built to scale.
          </p>
          <p style="margin:0 0 16px 0; font-family: Georgia, serif; font-size:13px;">
            <a href="${appUrl}/services" style="color:#0E1E2B; text-decoration:none; padding:0 8px;">Services</a>
            <span style="color:#C8B89F;">&middot;</span>
            <a href="${appUrl}/how-it-works" style="color:#0E1E2B; text-decoration:none; padding:0 8px;">How It Works</a>
            <span style="color:#C8B89F;">&middot;</span>
            <a href="${appUrl}/pricing" style="color:#0E1E2B; text-decoration:none; padding:0 8px;">Pricing</a>
            <span style="color:#C8B89F;">&middot;</span>
            <a href="${appUrl}/contact" style="color:#0E1E2B; text-decoration:none; padding:0 8px;">Contact</a>
          </p>
          <p style="margin:0; font-family: Georgia, serif; font-size:11px; color:#A8A199; letter-spacing:0.5px;">
            &copy; ${new Date().getFullYear()} HelpDesk Expert. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
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
                  <div style="margin-top:8px;color:#9aa7b6;font-size:12px;">Support: <a href="mailto:contact@helpdeskexpert.com" style="color:#0b75ff;text-decoration:none;">contact@helpdeskexpert.com</a></div>
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
