import type { Metadata } from "next";

import { CookiePreferencesButton } from "@/components/cookie-consent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How OhoTool collects, uses, and protects your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: August 15, 2026</p>

      <p className="mt-6">
        This Privacy Policy explains how OhoTool (&quot;OhoTool&quot;, &quot;we&quot;, &quot;us&quot;) collects,
        uses, and safeguards your information when you visit{" "}
        <a href="https://ohotool.com">ohotool.com</a> and use our tools and services. By using
        OhoTool, you agree to the practices described here.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Account information</strong> — your name and email address when you create an account. Passwords are never stored in plain text; they are kept only as a secure one-way hash.</li>
        <li><strong>Content you create</strong> — the QR codes, barcodes, and links you generate and choose to save to your account, along with their settings.</li>
        <li><strong>Scan data</strong> — for dynamic QR codes, each scan is logged with its timestamp, device/browser type, referring source, and approximate country, so we can show you scan analytics. We do not store full IP addresses.</li>
        <li><strong>Billing information</strong> — processed by our payment provider, Stripe. We receive your subscription status and limited billing metadata, but never your full card number.</li>
        <li><strong>Usage &amp; analytics data</strong> — aggregate, privacy-friendly usage statistics (see &quot;Analytics&quot; below) and basic technical information needed to operate and secure the service.</li>
      </ul>

      <h2>Free browser tools</h2>
      <p>
        Our free utilities (formatters, converters, calculators, generators, and similar) run
        entirely in your browser. The text, files, and values you enter into them are processed
        on your device and are <strong>not uploaded to or stored on our servers</strong>.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To provide, maintain, secure, and improve the service.</li>
        <li>To process subscriptions and payments.</li>
        <li>To send account-related emails such as verification and password resets.</li>
        <li>To generate scan analytics for your dynamic QR codes.</li>
        <li>To detect, prevent, and respond to fraud, abuse, and security issues.</li>
      </ul>

      <h2>Analytics</h2>
      <p>
        We use Vercel Web Analytics and Speed Insights to understand aggregate traffic and page
        performance. These are privacy-friendly and <strong>cookieless</strong> — they do not use
        cross-site tracking cookies and do not collect personally identifiable information.
      </p>
      <p>
        We also use <strong>Google Analytics (GA4)</strong> to measure aggregate traffic. GA4 sets
        cookies; where your consent is required (see &quot;Your cookie choices&quot; below), these
        are disabled until you accept. We do not sell your personal data.
      </p>

      <h2>Advertising</h2>
      <p>
        On our free tier we display ads served by <strong>Google AdSense</strong>. Google and its
        partners use cookies and similar technologies to serve and measure ads, including
        personalized ads based on your prior visits to this and other websites. Third-party vendors,
        including Google, use cookies to serve ads based on your interests.
      </p>
      <ul>
        <li>
          Google&apos;s use of advertising cookies is governed by the{" "}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google Ads policies</a>.
        </li>
        <li>
          You can opt out of personalized advertising in your{" "}
          <a href="https://myadcenter.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>, or opt out of
          third-party vendor cookies at{" "}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener">aboutads.info/choices</a>.
        </li>
        <li><strong>Pro subscribers see no ads</strong> — upgrading removes advertising entirely.</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use a strictly necessary session cookie to keep you signed in. On the free tier, our
        advertising partner Google and its vendors may set cookies to serve and measure ads, as
        described under &quot;Advertising&quot; above, and Google Analytics sets cookies to measure
        aggregate traffic. We do not set our own cross-site tracking cookies.
      </p>

      <h2>Your cookie choices</h2>
      <p>
        The first time you visit, a banner asks whether to allow non-essential (advertising and
        analytics) cookies. Essential sign-in cookies are always used and cannot be turned off. You
        can change your choice at any time using the button below.
      </p>
      <p>
        <CookiePreferencesButton className="inline-flex rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted" />
      </p>
      <p>
        We implement <strong>Google Consent Mode</strong>. For visitors in the EEA, the UK, and
        Switzerland, advertising and analytics cookies are <strong>disabled by default</strong> until
        you accept. Rejecting non-essential cookies means you may see non-personalized ads and are
        not included in analytics.
      </p>

      <h2>Email notifications &amp; updates</h2>
      <p>
        When you make a card, you can optionally enter your email to be{" "}
        <strong>notified when the card is opened</strong>. We store that email only to send that
        notification. If you also tick the optional box, we may send you occasional product updates
        (new templates, seasonal cards). Every such email includes an{" "}
        <strong>unsubscribe</strong> link, and you can opt out at any time. We never sell your email.
      </p>

      <h2>Service providers</h2>
      <p>We share data only with the providers that help us operate OhoTool:</p>
      <ul>
        <li><strong>Supabase</strong> — database hosting for your account and saved content.</li>
        <li><strong>Vercel</strong> — application hosting and privacy-friendly analytics.</li>
        <li><strong>Stripe</strong> — payment processing and subscription management.</li>
        <li><strong>Resend</strong> — delivery of transactional emails.</li>
        <li><strong>Google AdSense</strong> — advertising on the free tier (see &quot;Advertising&quot;).</li>
        <li><strong>OpenAI</strong> — powers our AI tools; text you submit to an AI tool is sent to process that request and is not used to train models.</li>
      </ul>
      <p>
        Each provider processes data only as needed to deliver its service and under its own terms
        and security commitments.
      </p>

      <h2>Data retention</h2>
      <p>
        We retain your account information and saved content for as long as your account is active.
        You can delete individual saved items at any time from your dashboard, and you may request
        deletion of your entire account by contacting us. Some records may be retained where
        required for legal, accounting, or security purposes.
      </p>

      <h2>International data transfers</h2>
      <p>
        Our providers may process and store data in countries other than your own. Where this
        happens, we rely on those providers&apos; safeguards for lawful international data transfers.
      </p>

      <h2>Security</h2>
      <p>
        We use industry-standard measures to protect your data, including encrypted connections
        (HTTPS), hashed passwords, and access controls. No method of transmission or storage is
        completely secure, but we work to protect your information and to promptly address any
        issues we discover.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        OhoTool is not directed to children under 13 (or the minimum age required in your
        jurisdiction), and we do not knowingly collect their personal data. If you believe a child
        has provided us information, please contact us and we will remove it.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live (for example under the GDPR or CCPA), you may have the right to
        access, correct, export, restrict, or delete your personal data, and to object to certain
        processing. To exercise any of these rights, email us at the address below and we will
        respond within a reasonable time.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. When we make material changes, we will update
        the &quot;Last updated&quot; date above and, where appropriate, notify you.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or requests about your privacy? Email us at{" "}
        <a href="mailto:sharafat.codes@gmail.com">sharafat.codes@gmail.com</a>.
      </p>
    </article>
  );
}
