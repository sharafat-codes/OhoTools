import "server-only";

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "OhoTool <onboarding@resend.dev>";
const resend = apiKey ? new Resend(apiKey) : null;

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  /** Set so replies go straight to the sender (e.g. a contact-form submitter). */
  replyTo?: string;
}): Promise<{ ok: boolean }> {
  if (!resend) {
    // No key configured — log a readable version so flows stay testable in dev.
    const text = html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    console.log(
      `\n[OhoTool email — RESEND_API_KEY not set]\nTo: ${to}\nSubject: ${subject}\n${text.slice(0, 600)}\n`,
    );
    return { ok: false };
  }

  try {
    const { error } = await resend.emails.send({ from, to, subject, html, ...(replyTo ? { replyTo } : {}) });
    if (error) {
      console.error("[OhoTool] Resend error:", error);
      return { ok: false };
    }
    return { ok: true };
  } catch (e) {
    console.error("[OhoTool] Email send failed:", e);
    return { ok: false };
  }
}

/** Branded, inline-styled transactional email (email clients require inline CSS). */
export function renderActionEmail({
  heading,
  body,
  buttonLabel,
  buttonUrl,
  footnote,
}: {
  heading: string;
  body: string;
  buttonLabel: string;
  buttonUrl: string;
  footnote?: string;
}) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
      <tr><td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e4e4e7;">
          <tr><td style="padding:28px 32px 8px;">
            <div style="font-size:18px;font-weight:700;color:#0a0a0a;">OhoTool</div>
          </td></tr>
          <tr><td style="padding:8px 32px 0;">
            <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;color:#0a0a0a;">${heading}</h1>
            <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#52525b;">${body}</p>
            <a href="${buttonUrl}" style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:10px;">${buttonLabel}</a>
            <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#a1a1aa;">If the button doesn't work, paste this link into your browser:<br/><span style="color:#52525b;word-break:break-all;">${buttonUrl}</span></p>
          </td></tr>
          <tr><td style="padding:24px 32px 28px;">
            <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 16px;"/>
            <p style="margin:0;font-size:12px;line-height:1.6;color:#a1a1aa;">${footnote ?? "You received this email because someone used it to sign in to OhoTool. If it wasn't you, you can safely ignore it."}</p>
          </td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#a1a1aa;">© OhoTool</p>
      </td></tr>
    </table>
  </body>
</html>`;
}
