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
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 22, 2026</p>

      <p className="mt-6">
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of OhoTool at{" "}
        <a href="https://ohotool.com">ohotool.com</a>, including our free tools, accounts, and paid
        plans. By accessing or using OhoTool, you agree to these Terms. If you do not agree, please
        do not use the service.
      </p>

      <h2>Accounts</h2>
      <p>
        You are responsible for maintaining the security of your account and for all activity that
        occurs under it. You must provide accurate information, keep your credentials confidential,
        and be at least the age of majority in your jurisdiction (or have your guardian&apos;s consent).
        Notify us promptly of any unauthorized use of your account.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not use the service for any unlawful, harmful, deceptive, or fraudulent purpose.</li>
        <li>Do not encode or distribute malware, phishing, or content that infringes or violates others&apos; rights.</li>
        <li>Do not attempt to disrupt, overload, reverse engineer, or gain unauthorized access to the service or its API.</li>
        <li>Do not resell or abuse the service or exceed the limits of your plan.</li>
      </ul>
      <p>We may suspend or terminate accounts that violate these Terms.</p>

      <h2>Subscriptions &amp; billing</h2>
      <ul>
        <li>Paid plans are billed in advance on a recurring basis through Stripe until cancelled.</li>
        <li>You can cancel anytime from your billing page; access continues until the end of the current billing period.</li>
        <li>Except where required by law, payments are non-refundable and partial periods are not prorated.</li>
        <li>We may change plan features or pricing with reasonable advance notice.</li>
      </ul>

      <h2>Free tools</h2>
      <p>
        Our free, browser-based tools are provided for your convenience &quot;as is,&quot; without warranty
        of any kind. You are responsible for verifying any output before relying on it.
      </p>

      <h2>Your content</h2>
      <p>
        You retain ownership of the content you create with OhoTool. You are solely responsible for
        that content and for ensuring you have the right to use any data you encode. You grant us
        the limited rights needed to host and process your content in order to provide the service.
      </p>

      <h2>Dynamic QR codes &amp; links</h2>
      <p>
        Dynamic QR codes and short links depend on the continued operation of the service and your
        account remaining in good standing. If your account is cancelled, suspended, or terminated,
        the associated dynamic links may stop resolving.
      </p>

      <h2>Intellectual property</h2>
      <p>
        OhoTool and its branding, design, and software are owned by us and protected by applicable
        laws. These Terms do not grant you any rights to our trademarks or brand assets.
      </p>

      <h2>Service availability</h2>
      <p>
        We aim to keep OhoTool available and reliable, but we do not guarantee uninterrupted or
        error-free operation. We may modify, suspend, or discontinue any part of the service at any
        time.
      </p>

      <h2>Disclaimer &amp; limitation of liability</h2>
      <p>
        The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
        whether express or implied. To the maximum extent permitted by law, OhoTool will not be
        liable for any indirect, incidental, special, consequential, or punitive damages, or for
        any loss of data, revenue, or profits arising from your use of the service. Where liability
        cannot be excluded, it is limited to the amount you paid us in the 12 months before the
        claim.
      </p>

      <h2>Governing law</h2>
      <p>
        These Terms are governed by the laws applicable in the jurisdiction in which the operator of
        OhoTool is established, without regard to conflict-of-law rules. Any disputes will be
        subject to the courts of that jurisdiction.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these Terms from time to time. When we make material changes, we will update
        the &quot;Last updated&quot; date above. Your continued use of the service after changes take
        effect constitutes acceptance of the updated Terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms? Email us at{" "}
        <a href="mailto:support@ohotool.com">support@ohotool.com</a>.
      </p>
    </article>
  );
}
