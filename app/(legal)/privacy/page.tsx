import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How OhoTool collects, uses, and protects your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 21, 2026</p>

      <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        This is a starting template, not legal advice. Please review it with a
        qualified professional and tailor it to your business before relying on it.
      </div>

      <p className="mt-6">
        This Privacy Policy explains how OhoTool (&quot;we&quot;, &quot;us&quot;) collects, uses,
        and safeguards your information when you use our website and services.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Account information</strong> — your name and email address when you register. Passwords are stored only as a secure one-way hash.</li>
        <li><strong>Content you create</strong> — the QR codes, barcodes, and links you generate and choose to save.</li>
        <li><strong>Scan data</strong> — for dynamic QR codes, we log each scan&apos;s timestamp, device type, referrer, and approximate country to provide analytics. We do not store full IP addresses.</li>
        <li><strong>Billing information</strong> — handled by our payment processor, Stripe. We never see or store your full card details.</li>
        <li><strong>Usage data</strong> — basic technical information needed to operate and secure the service.</li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To provide, maintain, and improve the service.</li>
        <li>To process subscriptions and payments.</li>
        <li>To send account-related emails such as password resets and verification.</li>
        <li>To provide scan analytics for dynamic QR codes.</li>
        <li>To protect against fraud and abuse.</li>
      </ul>

      <h2>Service providers</h2>
      <p>We share data only with providers that help us run OhoTool:</p>
      <ul>
        <li><strong>Supabase</strong> — database hosting.</li>
        <li><strong>Stripe</strong> — payment processing.</li>
        <li><strong>Vercel</strong> — application hosting.</li>
        <li><strong>Resend</strong> — transactional email delivery.</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use a strictly necessary session cookie to keep you signed in. We do
        not use advertising or third-party tracking cookies.
      </p>

      <h2>Data retention</h2>
      <p>
        We keep your data for as long as your account is active. You can delete
        your saved content at any time, and you may request deletion of your
        account by contacting us.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, export,
        or delete your personal data. To exercise these rights, contact us at the
        address below.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email us at{" "}
        <a href="mailto:support@ohotool.com">support@ohotool.com</a>.
      </p>
    </article>
  );
}
