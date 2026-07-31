import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

const CATEGORIES = ["General", "Bug report", "Feature request", "Suggest a tool", "Business"];

function esc(s: string) {
  return s.replace(/[<>&]/g, (c) => (c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&amp;"));
}

export async function POST(req: Request) {
  const to = process.env.CONTACT_EMAIL?.trim();
  if (!to) return Response.json({ error: "Contact isn't configured yet." }, { status: 503 });

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(data.name ?? "").trim().slice(0, 100);
  const email = String(data.email ?? "").trim().slice(0, 200);
  const category = String(data.category ?? "General").trim();
  const message = String(data.message ?? "").trim().slice(0, 5000);
  const honeypot = String(data.website ?? "").trim();

  // Bots fill the hidden honeypot — silently accept and drop.
  if (honeypot) return Response.json({ ok: true });

  if (!name || !email || !message) {
    return Response.json({ error: "Please fill in your name, email, and message." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const cat = CATEGORIES.includes(category) ? category : "General";

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#111;line-height:1.6;">
    <h2 style="margin:0 0 12px;font-size:18px;">New OhoTool contact message</h2>
    <p style="margin:0 0 4px;"><strong>Topic:</strong> ${esc(cat)}</p>
    <p style="margin:0 0 4px;"><strong>Name:</strong> ${esc(name)}</p>
    <p style="margin:0 0 12px;"><strong>Email:</strong> ${esc(email)}</p>
    <div style="white-space:pre-wrap;border-top:1px solid #e4e4e7;padding-top:12px;">${esc(message)}</div>
  </div>`;

  const { ok } = await sendEmail({ to, subject: `[OhoTool] ${cat} — ${name}`, html, replyTo: email });

  // In dev without a Resend key the message is logged (ok:false) — still succeed.
  if (!ok && process.env.RESEND_API_KEY) {
    return Response.json({ error: "Couldn't send your message. Please try again." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
