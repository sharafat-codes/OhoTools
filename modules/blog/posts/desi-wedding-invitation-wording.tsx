import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "desi-wedding-invitation-wording",
  title: "Desi & Pakistani Wedding Invitation Wording in English (Examples)",
  description:
    "Copy-and-paste wedding invitation wording for Pakistani, Indian, and Muslim weddings in English — nikah, baraat, walima, mehndi — plus how to make a digital invite to share on WhatsApp.",
  keywords: [
    "pakistani wedding invitation wording",
    "desi wedding invitation wording",
    "muslim wedding invitation wording english",
    "nikah invitation wording",
    "walima invitation wording",
  ],
  date: "2026-08-14",
  readingMinutes: 6,
  tags: ["Cards & Invitations"],
  related: ["wedding-invitation-maker", "engagement-invitation-maker", "anniversary-card-maker"],
};

export function Body() {
  return (
    <>
      <p>
        Desi weddings have several events — mehndi, nikah, baraat, and walima — and each invite has its own tone.
        Below are wedding invitation wordings in English for Pakistani, Indian, and Muslim weddings that you can
        copy, adjust, and use. When you&apos;re ready, put them into the{" "}
        <Link href="/tools/wedding-invitation-maker">wedding invitation maker</Link> and share an animated card on{" "}
        <Link href="/blog/how-to-send-a-digital-invitation-on-whatsapp">WhatsApp</Link>.
      </p>

      <h2>What to include on a Desi wedding invite</h2>
      <ul>
        <li>The couple&apos;s names (and often the families / parents extending the invitation)</li>
        <li>The event name — Mehndi, Nikah, Baraat, or Walima</li>
        <li>Date, day, and time</li>
        <li>Venue with address</li>
        <li>RSVP contact, and any dress-code or dholki notes</li>
      </ul>

      <h2>Formal — from the families</h2>
      <ul>
        <li>
          &quot;Together with their families, [Bride] &amp; [Groom] request the honour of your presence at their
          wedding on [Date] at [Venue].&quot;
        </li>
        <li>
          &quot;Mr. &amp; Mrs. [Surname] cordially invite you to the wedding of their beloved [son/daughter],
          [Name], to [Name], on [Date] at [Venue].&quot;
        </li>
        <li>
          &quot;With the blessings of the Almighty, we invite you to share in the joy of the wedding of our
          children, [Names], on [Date].&quot;
        </li>
      </ul>

      <h2>Nikah</h2>
      <ul>
        <li>
          &quot;By the grace of Allah, we request your gracious presence at the Nikah ceremony of [Bride] &amp;
          [Groom]. [Date] · [Time] · [Venue].&quot;
        </li>
        <li>
          &quot;You are cordially invited to the Nikah of [Names]. Your presence and duas will make our day
          complete.&quot;
        </li>
        <li>
          &quot;In the name of Allah, the most Merciful — join us for the Nikah of [Bride] and [Groom] on
          [Date].&quot;
        </li>
      </ul>

      <h2>Baraat</h2>
      <ul>
        <li>
          &quot;The family of [Groom] joyfully invites you to the Baraat celebrating his marriage to [Bride].
          [Date] · [Time] · [Venue].&quot;
        </li>
        <li>
          &quot;With hearts full of joy, we invite you to the Baraat of [Names]. Come dance, dine, and
          celebrate!&quot;
        </li>
      </ul>

      <h2>Walima</h2>
      <ul>
        <li>
          &quot;[Groom] &amp; [Bride] request the pleasure of your company at their Walima reception on [Date] at
          [Venue].&quot;
        </li>
        <li>
          &quot;The family of [Groom] cordially invites you to the Walima in honour of the newlyweds. Your
          presence is a blessing.&quot;
        </li>
      </ul>

      <h2>Mehndi &amp; Dholki</h2>
      <ul>
        <li>
          &quot;Colours, music, and mehndi! Join us for [Bride]&apos;s Mehndi on [Date] at [Venue]. Dress code:
          [colour].&quot;
        </li>
        <li>
          &quot;Let&apos;s get the celebrations started — Dholki night for [Names]! [Date] · [Time]. Bring your
          dhol and your dance moves.&quot;
        </li>
      </ul>

      <h2>Short &amp; modern (great for WhatsApp)</h2>
      <ul>
        <li>&quot;[Bride] &amp; [Groom] are getting married! Join us [Date] at [Venue]. Details inside 💍&quot;</li>
        <li>&quot;We&apos;re tying the knot! Save the date — [Date]. Formal invite to follow.&quot;</li>
        <li>&quot;Two families, one celebration. [Names], [Date], [Venue]. We&apos;d be honoured to have you.&quot;</li>
      </ul>

      <h2>A note on tone and duas</h2>
      <p>
        Many families open with a line of gratitude — &quot;By the grace of Allah&quot; or &quot;With the
        blessings of the Almighty&quot; — and close by asking for prayers (&quot;Your presence and duas are
        requested&quot;). Match the wording to your family&apos;s style; the examples above are starting points,
        not rules.
      </p>

      <h2>Make and share your invitation</h2>
      <p>
        Pick your wording, open the{" "}
        <Link href="/tools/wedding-invitation-maker">wedding invitation maker</Link>, add your names, events, and a
        photo, and send the animated card by link. Having an engagement first? There&apos;s an{" "}
        <Link href="/tools/engagement-invitation-maker">engagement invitation maker</Link> too, and you can see
        all occasions under <Link href="/tools/cards">Card &amp; Invitation Makers</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>Should a Muslim wedding invite include a Quranic verse?</h3>
      <p>
        Many do (for example, a short verse about marriage), but it&apos;s optional. A simple &quot;By the grace
        of Allah&quot; opening is common and widely appropriate.
      </p>
      <h3>How do I word separate invites for different events?</h3>
      <p>
        Make one card per event (Mehndi, Nikah, Baraat, Walima) with that event&apos;s name, time, and venue — or
        list all events on a single card if guests are invited to everything.
      </p>
      <h3>Is a digital wedding invite acceptable for a Desi wedding?</h3>
      <p>
        Increasingly, yes — especially for reaching relatives abroad quickly. Many families send a digital invite
        on WhatsApp alongside printed cards for close elders.
      </p>
    </>
  );
}
