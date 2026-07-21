import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the OhoTool team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <article>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Contact us</h1>
      <p className="mt-4">
        We&apos;d love to hear from you — whether it&apos;s a question, a bug report, a
        feature request, or feedback on OhoTool.
      </p>

      <h2>Email</h2>
      <p>
        Reach us at{" "}
        <a href="mailto:support@ohotool.com">support@ohotool.com</a> and we&apos;ll get
        back to you as soon as we can.
      </p>

      <h2>Billing &amp; account help</h2>
      <p>
        For subscription questions, you can manage or cancel your plan anytime from
        the <a href="/dashboard/billing">billing page</a> in your dashboard.
      </p>
    </article>
  );
}
