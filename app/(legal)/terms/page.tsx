import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of OhoTool.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 21, 2026</p>

      <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        This is a starting template, not legal advice. Please review it with a
        qualified professional and tailor it to your business before relying on it.
      </div>

      <p className="mt-6">
        By accessing or using OhoTool, you agree to these Terms of Service. If you
        do not agree, please do not use the service.
      </p>

      <h2>Accounts</h2>
      <p>
        You are responsible for maintaining the security of your account and for
        all activity that occurs under it. You must provide accurate information
        and be at least the age of majority in your jurisdiction.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not use the service for unlawful, harmful, or fraudulent purposes.</li>
        <li>Do not encode malware, phishing, or content that violates others&apos; rights.</li>
        <li>Do not attempt to disrupt, reverse engineer, or abuse the service or its API.</li>
      </ul>

      <h2>Subscriptions &amp; billing</h2>
      <ul>
        <li>Paid plans are billed in advance on a recurring monthly basis through Stripe.</li>
        <li>You can cancel anytime; access continues until the end of the current billing period.</li>
        <li>Except where required by law, payments are non-refundable.</li>
        <li>We may change pricing with reasonable notice.</li>
      </ul>

      <h2>Free tools</h2>
      <p>
        Our free browser-based tools are provided &quot;as is&quot; for your convenience,
        without warranty of any kind.
      </p>

      <h2>Intellectual property</h2>
      <p>
        You retain ownership of the content you create. OhoTool and its branding,
        design, and software remain our property.
      </p>

      <h2>Disclaimer &amp; limitation of liability</h2>
      <p>
        The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of
        any kind. To the maximum extent permitted by law, OhoTool is not liable for
        any indirect, incidental, or consequential damages arising from your use of
        the service.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. Continued use of the service
        after changes take effect constitutes acceptance of the updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email us at{" "}
        <a href="mailto:support@ohotool.com">support@ohotool.com</a>.
      </p>
    </article>
  );
}
