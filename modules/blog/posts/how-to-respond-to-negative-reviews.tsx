import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-respond-to-negative-reviews",
  title: "How to Respond to Negative Reviews (With Examples)",
  description:
    "A calm, professional framework for replying to bad reviews — what to say, what to avoid, and examples — plus a free AI review response generator.",
  keywords: [
    "how to respond to negative reviews",
    "reply to bad reviews",
    "review response examples",
    "respond to google reviews",
    "review response generator",
    "handle negative feedback",
  ],
  date: "2026-09-10",
  readingMinutes: 4,
  tags: ["Business", "AI"],
  related: ["review-response-generator", "ai-email-writer", "faq-generator"],
};

export function Body() {
  return (
    <>
      <p>
        A negative review isn&apos;t a disaster — your <em>reply</em> is what future customers judge. A calm,
        genuine response can turn a bad review into proof that you care. Here&apos;s the framework.
      </p>

      <h2>Draft a reply in seconds</h2>
      <p>
        Paste the review into the <Link href="/tools/review-response-generator">AI Review Response Generator</Link>{" "}
        and get a professional, empathetic reply you can tweak and post — for Google, Yelp, or anywhere.
      </p>

      <h2>The 4-step framework</h2>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li><strong>Thank them</strong> — for the feedback, even when it stings.</li>
        <li><strong>Acknowledge &amp; apologize</strong> — name their specific issue and say sorry, sincerely.</li>
        <li><strong>Make it right</strong> — offer a fix or invite them to continue the conversation offline.</li>
        <li><strong>Stay brief and calm</strong> — you&apos;re writing for the next reader, not to win an argument.</li>
      </ol>

      <h2>What to avoid</h2>
      <ul>
        <li><strong>Getting defensive</strong> — arguing makes you look worse to everyone watching.</li>
        <li><strong>Copy-paste replies</strong> — generic responses feel like you don&apos;t care.</li>
        <li><strong>Oversharing</strong> — don&apos;t reveal private customer details in public.</li>
        <li><strong>Ignoring it</strong> — an unanswered complaint stands unchallenged.</li>
      </ul>

      <h2>Example</h2>
      <p>
        &ldquo;Hi Sam, thank you for letting us know — I&apos;m sorry your order arrived late, that&apos;s not
        the experience we want. I&apos;d like to make it right; please email us at [email] and we&apos;ll sort
        it out. Thanks for giving us the chance to improve.&rdquo;
      </p>

      <h2>Don&apos;t forget positive reviews</h2>
      <p>Reply to good reviews too — a quick, warm thank-you builds loyalty and encourages more reviews.</p>

      <h2>FAQ</h2>
      <h3>Should I respond to every review?</h3>
      <p>Yes — especially negative ones. It shows prospective customers you&apos;re engaged and fair.</p>
      <h3>How fast should I reply?</h3>
      <p>Within a day or two. A prompt, calm response limits the damage and impresses onlookers.</p>
    </>
  );
}
