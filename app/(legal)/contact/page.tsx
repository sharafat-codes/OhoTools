import type { Metadata } from "next";

import { ContactForm } from "@/modules/marketing/components/contact-form";
import { TOOL_COUNT_LABEL } from "@/modules/tools/registry";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the OhoTool team — questions, bug reports, feature requests, or tool suggestions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <article>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Contact us</h1>
      <p className="mt-4">
        Have a question, found a bug, or want a tool we don&apos;t have yet? Send us a message and we&apos;ll
        reply by email. Tool suggestions are genuinely welcome — a lot of OhoTool exists because people asked.
      </p>

      <div className="my-8">
        <ContactForm />
      </div>

      <h2>Billing &amp; account help</h2>
      <p>
        For subscription questions, you can manage or cancel your plan anytime from the{" "}
        <a href="/dashboard/billing">billing page</a> in your dashboard.
      </p>

      <h2>Quick answers</h2>
      <h3>Are the tools really free?</h3>
      <p>
        Yes — {TOOL_COUNT_LABEL} tools are free with no sign-up, and most run entirely in your browser. A light Pro plan adds
        unlimited AI, advanced conversions, and QR analytics.
      </p>
      <h3>Is my data uploaded?</h3>
      <p>
        For most tools, no — files are processed locally in your browser and never leave your device. The few
        that need a server (like some document conversions and the AI tools) are clearly labeled.
      </p>
      <h3>How soon will I hear back?</h3>
      <p>OhoTool is run by a small team, so replies may take a little time — but every message is read.</p>
    </article>
  );
}
