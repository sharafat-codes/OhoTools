import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "OhoTool's refund policy for Pro subscriptions.",
  alternates: { canonical: "/refunds" },
};

export default function RefundsPage() {
  return (
    <article>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Refund Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 23, 2026</p>

      <p className="mt-6">
        This policy explains refunds for <strong>OhoTool Pro</strong>, our paid subscription. All 60+
        OhoTool tools that are free stay free — this policy only concerns paid Pro subscriptions.
      </p>

      <h2>Payments &amp; billing</h2>
      <p>
        Pro is a recurring subscription billed in advance (monthly). Payments are processed by our
        authorized reseller and Merchant of Record, <strong>Paddle</strong>, which appears on your
        statement and issues receipts.
      </p>

      <h2>Cancellations</h2>
      <p>
        You can cancel anytime from your billing page. When you cancel, your subscription stays active
        until the end of the current billing period, and you are not charged again. Cancelling does not
        automatically refund the current period.
      </p>

      <h2>14-day money-back guarantee</h2>
      <p>
        If you&apos;re not satisfied with Pro, contact us within <strong>14 days</strong> of a charge and
        we&apos;ll refund that payment. This applies to the most recent charge; earlier billing periods
        that were used are not refundable.
      </p>

      <h2>Exceptions</h2>
      <ul>
        <li>Renewal charges after the first 14 days are generally non-refundable — cancel before renewal to avoid the next charge.</li>
        <li>Refunds may be declined in cases of clear abuse or violations of our <a href="/terms">Terms of Service</a>.</li>
      </ul>

      <h2>How to request a refund</h2>
      <p>
        Email <a href="mailto:support@ohotool.com">support@ohotool.com</a> from the address on your
        account, and we&apos;ll process eligible refunds to your original payment method (this is handled
        through Paddle). You can also request help via Paddle&apos;s buyer support.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about billing or refunds? Reach us at{" "}
        <a href="mailto:support@ohotool.com">support@ohotool.com</a>.
      </p>
    </article>
  );
}
