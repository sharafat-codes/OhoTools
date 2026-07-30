import Link from "next/link";
import {
  ArrowRightIcon,
  CheckIcon,
  LayersIcon,
  TerminalIcon,
  ZapIcon,
  ShieldCheckIcon,
  SparklesIcon,
  FileTextIcon,
  ArrowLeftRightIcon,
  CalculatorIcon,
  TypeIcon,
  CodeIcon,
  GlobeIcon,
  QrCodeIcon,
  SendIcon,
  FilmIcon,
  AudioLinesIcon,
  CropIcon,
  NotebookPenIcon,
  type LucideIcon,
} from "lucide-react";

import { getCurrentUser } from "@/lib/dal";
import { qrToSvgString } from "@/modules/qr/render";
import { PLANS } from "@/lib/plans";
import {
  devTools,
  getTool,
  toolCategories,
  categorySlugForName,
} from "@/modules/tools/registry";
import { SITE_URL as siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/modules/marketing/components/site-header";

// Icon per category for the showcase (keyed by registry category name).
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  AI: SparklesIcon,
  "Video & GIF": FilmIcon,
  Audio: AudioLinesIcon,
  "Image Editing": CropIcon,
  Productivity: NotebookPenIcon,
  Developer: CodeIcon,
  "Web & SEO": GlobeIcon,
  Converters: ArrowLeftRightIcon,
  PDF: FileTextIcon,
  Calculators: CalculatorIcon,
  Text: TypeIcon,
  Generators: SparklesIcon,
};

// High-intent tools surfaced on the homepage — deep links that also spread
// internal-link equity to the pages we most want to rank.
const HERO_TILES = [
  "word-to-pdf",
  "image-to-text",
  "ai-summarizer",
  "merge-pdf",
  "qr-code",
  "compress-image",
  "pdf-to-word",
  "json-formatter",
  "online-notepad",
];

const POPULAR = [
  "word-to-pdf",
  "pdf-to-word",
  "merge-pdf",
  "ai-summarizer",
  "image-to-text",
  "image-converter",
  "compress-image",
  "ai-humanizer",
  "json-formatter",
  "qr-code",
  "password-generator",
  "invoice-generator",
];

const faqs = [
  {
    q: "Are OhoTool's tools really free?",
    a: "Most of our 130+ tools are free and unlimited — no ads, no sign-up. The AI tools include a free daily allowance, and Pro unlocks unlimited AI, advanced Office↔PDF conversions, dynamic QR analytics, and more.",
  },
  {
    q: "Do I need an account to use the tools?",
    a: "No. Every tool works instantly in your browser without an account. You only sign in if you want to save your work or use Pro features.",
  },
  {
    q: "Is my data uploaded to a server?",
    a: "For most tools, no — they run entirely in your browser, so your files never leave your device. A few advanced conversions are processed securely on our server and deleted immediately afterward.",
  },
  {
    q: "What file conversions do you support?",
    a: "Word, PowerPoint, and Excel to PDF; PDF to Word and PowerPoint; CSV↔Excel; HTML to PDF; images to and from PDF; HEIC to JPG/PNG; image conversion, compression, and editing; image-to-text (OCR); audio and video conversion; and Markdown/HTML/code conversions — among many others.",
  },
  {
    q: "What do I get with Pro?",
    a: "Unlimited AI writing tools, advanced document conversions (Office↔PDF, CSV↔Excel, and more), dynamic QR codes with scan analytics and branding, bulk generation, and an API.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely — manage or cancel your subscription in one click from the billing portal. No emails, no hassle.",
  },
];

export default async function Home() {
  const user = await getCurrentUser();

  const brandedQr = qrToSvgString({
    data: siteUrl,
    fgColor: "#6d28d9",
    fgColor2: "#db2777",
    gradient: true,
    bgColor: "#ffffff",
    moduleStyle: "rounded",
    size: 220,
    margin: 1,
    ecLevel: "M",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "OhoTool",
        url: siteUrl,
        logo: `${siteUrl}/logo-icon.png`,
        description:
          "OhoTool is a free platform of 130+ browser-based tools for PDF, images, audio, video, text, developers, AI writing, and QR codes — private, with no sign-up.",
        founder: { "@type": "Person", name: "Sharafat Ali" },
        sameAs: [
          "https://www.linkedin.com/in/sharafat-ali-04586028a/",
          "https://www.facebook.com/codes.ali",
        ],
      },
      {
        "@type": "WebSite",
        name: "OhoTool",
        url: siteUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/tools?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "OhoTool",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        url: siteUrl,
        description:
          "130+ free online tools — PDF & document converters, AI writing tools, image, audio & video tools, text utilities, calculators, developer tools, and QR codes.",
        offers: PLANS.map((p) => ({
          "@type": "Offer",
          name: p.name,
          price: String(p.price),
          priceCurrency: "USD",
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader isAuthed={!!user} />

      <main className="flex-1 overflow-x-clip">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-primary)/8%,transparent)]"
          />
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
            <div className="flex flex-col items-start">
              <Badge
                variant="secondary"
                className="mb-5 border-primary/30 bg-primary/10 text-primary"
              >
                <SparklesIcon className="size-3.5" />
                {devTools.length} tools · more added every week
              </Badge>
              <h1 className="font-heading text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
                Every online tool you need, in one place.
              </h1>
              <p className="mt-6 max-w-lg text-pretty text-lg text-muted-foreground">
                Convert PDFs, edit images, write with AI, wrangle text and code,
                crunch numbers, and generate QR codes.{" "}
                {devTools.length} fast tools — no sign-up, and most run right in
                your browser.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" render={<Link href="/tools" />}>
                  Explore all tools
                  <ArrowRightIcon />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<Link href={user ? "/dashboard" : "/signup"} />}
                >
                  {user ? "Go to dashboard" : "Create free account"}
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Free forever · No credit card · Runs in your browser
              </p>
            </div>

            {/* Tools wall — a taste of the breadth, each tile a real tool */}
            <div className="lg:justify-self-end">
              <div className="w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="grid grid-cols-3 gap-3">
                  {HERO_TILES.map((slug) => {
                    const t = getTool(slug);
                    if (!t) return null;
                    const TIcon = t.icon;
                    return (
                      <Link
                        key={slug}
                        href={`/tools/${slug}`}
                        className="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-background p-3 text-center transition-colors hover:border-primary/40 hover:bg-muted/40"
                      >
                        <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                          <TIcon className="size-4.5" />
                        </span>
                        <span className="text-[11px] font-medium leading-tight text-muted-foreground group-hover:text-foreground">
                          {t.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href="/tools"
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-muted/60 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  + {devTools.length - HERO_TILES.length} more tools
                  <ArrowRightIcon className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-muted/20 px-6 py-5 text-center sm:grid-cols-4">
              {[
                { value: `${devTools.length}`, label: "Free tools" },
                { value: `${toolCategories.length}`, label: "Categories" },
                { value: "100%", label: "Private by default" },
                { value: "$0", label: "To get started" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-heading text-2xl font-semibold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="border-t border-border/60 bg-muted/20 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Browse by category"
              title="A tool for every job"
              subtitle="Organized into clear categories so you can find what you need in seconds."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {toolCategories.map((cat) => {
                const CIcon = CATEGORY_ICONS[cat.name] ?? SparklesIcon;
                const catSlug = categorySlugForName(cat.name);
                return (
                  <Link
                    key={cat.name}
                    href={catSlug ? `/tools/${catSlug}` : "/tools"}
                    className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                        <CIcon className="size-5" />
                      </span>
                      <div>
                        <h3 className="font-heading font-medium">{cat.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {cat.slugs.length} tools
                        </p>
                      </div>
                      <ArrowRightIcon className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{cat.blurb}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Popular tools */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Popular tools"
              title="What people use most"
              subtitle="The go-to tools our visitors reach for every day."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {POPULAR.map((slug) => {
                const t = getTool(slug);
                if (!t) return null;
                const TIcon = t.icon;
                return (
                  <Link key={slug} href={`/tools/${slug}`} className="group">
                    <div className="flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <TIcon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-heading font-medium">
                          {t.name}
                          {t.pro && (
                            <Badge variant="secondary" className="border-primary/30 bg-primary/10 text-primary px-1.5 py-0 text-[10px]">
                              Pro
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 flex justify-center">
              <Button variant="outline" render={<Link href="/tools" />}>
                See all {devTools.length} tools
                <ArrowRightIcon />
              </Button>
            </div>
          </div>
        </section>

        {/* Why OhoTool */}
        <section className="border-t border-border/60 bg-muted/20 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Why OhoTool"
              title="Fast, private, and genuinely free"
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={ShieldCheckIcon}
                title="Private by default"
                body="Most tools run entirely in your browser — your files never leave your device."
              />
              <FeatureCard
                icon={ZapIcon}
                title="Instant, no sign-up"
                body="Open a tool and use it. No account, no install, no waiting."
              />
              <FeatureCard
                icon={SparklesIcon}
                title="Free & unlimited"
                body="The full core toolkit is free with no ads and no usage caps."
              />
              <FeatureCard
                icon={LayersIcon}
                title="Always growing"
                body="New tools and features ship regularly — this is just the start."
              />
            </div>
          </div>
        </section>

        {/* Send a file */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col items-start gap-5 rounded-2xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <SendIcon className="size-5" />
                </span>
                <div>
                  <h2 className="font-heading text-xl font-semibold tracking-tight">
                    Need to send a file?
                  </h2>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                    Share any file with a private, end-to-end encrypted link — free and no
                    sign-up. Add a password, and it auto-deletes within 24 hours.
                  </p>
                </div>
              </div>
              <Button className="shrink-0" render={<Link href="/send" />}>
                Send a file
                <ArrowRightIcon />
              </Button>
            </div>
          </div>
        </section>

        {/* Pro */}
        <section id="pro" className="scroll-mt-20 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="OhoTool Pro"
              title="Level up when you need more"
              subtitle="Everything free, plus unlimited AI writing tools, advanced document conversions, dynamic QR codes with analytics, and an API."
            />
            <div className="mt-12 grid gap-4 md:grid-cols-6">
              <FeatureCard
                className="md:col-span-3"
                icon={SparklesIcon}
                title="Unlimited AI tools"
                body="Summarize, paraphrase, humanize, translate, write emails, and 20+ more. Everyone gets a free daily allowance — Pro removes the cap."
              />
              <FeatureCard
                className="md:col-span-3"
                icon={ZapIcon}
                title="Dynamic QR + scan analytics"
                body="Point a printed code anywhere, then re-point it whenever you want. Track scans over time, by device and referrer."
              >
                <AnalyticsMock />
              </FeatureCard>
              <FeatureCard
                className="md:col-span-2"
                icon={FileTextIcon}
                title="Advanced conversions"
                body="Office↔PDF, CSV↔Excel, PDF→PowerPoint, and more — processed on our server."
              />
              <FeatureCard
                className="md:col-span-2"
                icon={QrCodeIcon}
                title="On-brand QR codes"
                body="Logo, colors, gradients, and shapes. Export PNG, SVG, or PDF."
              >
                <div
                  className="mx-auto mt-2 w-full max-w-32 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: brandedQr }}
                />
              </FeatureCard>
              <FeatureCard
                className="md:col-span-2"
                icon={TerminalIcon}
                title="Automate with the API"
                body="Generate codes programmatically with a simple REST endpoint."
              >
                <pre className="mt-2 min-w-0 max-w-full overflow-x-auto rounded-lg bg-foreground/90 p-3 text-xs text-background">
                  <code className="font-mono">{`curl -H "Authorization: Bearer oho_…" \\
  "${siteUrl}/api/v1/qr?data=hello" \\
  --output qr.png`}</code>
                </pre>
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 border-t border-border/60 bg-muted/20 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Pricing"
              title="Simple, honest pricing"
              subtitle="Start free. Upgrade when you need branding, analytics, and automation."
            />
            <div className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-2">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "relative flex flex-col rounded-xl border border-border bg-card p-6",
                    plan.popular && "border-primary/40 ring-2 ring-primary/20",
                  )}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2.5 left-6">Most popular</Badge>
                  )}
                  <h3 className="font-heading text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-heading text-4xl font-semibold">${plan.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
                  <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-6"
                    variant={plan.popular ? "default" : "outline"}
                    render={<Link href={user ? "/dashboard/billing" : "/signup"} />}
                  >
                    {plan.price === 0 ? "Get started" : `Choose ${plan.name}`}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <SectionHeading eyebrow="FAQ" title="Questions, answered" />
            <div className="mt-10 flex flex-col gap-3">
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-border bg-card p-4 [&_summary]:cursor-pointer"
                >
                  <summary className="flex items-center justify-between font-medium marker:content-none">
                    {item.q}
                    <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border/60 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
            <div className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-14 text-center">
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Pick a tool and get going
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                {devTools.length} free tools, ready in your browser. Upgrade
                anytime for QR analytics, advanced conversions, and the API.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" render={<Link href="/tools" />}>
                  Explore all tools
                  <ArrowRightIcon />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<Link href={user ? "/dashboard" : "/signup"} />}
                >
                  {user ? "Open dashboard" : "Create free account"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo size="sm" />
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <Link href="/tools" className="hover:text-foreground">Tools</Link>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/refunds" className="hover:text-foreground">Refunds</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} OhoTool
          </span>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-medium text-primary">{eyebrow}</p>
      <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
  className,
  children,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col rounded-xl border border-border bg-card p-5", className)}>
      <div className="mb-3 grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4.5" />
      </div>
      <h3 className="font-heading font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      {children}
    </div>
  );
}

function AnalyticsMock() {
  const bars = [30, 45, 38, 60, 52, 78, 66, 90, 72, 84, 58, 95];
  return (
    <div className="mt-4 rounded-lg border border-border bg-background p-4">
      <div className="mb-3 grid grid-cols-3 gap-3">
        {[
          { label: "Scans", value: "1,204" },
          { label: "This week", value: "312" },
          { label: "Countries", value: "18" },
        ].map((s) => (
          <div key={s.label}>
            <div className="font-heading text-lg font-semibold leading-none">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex h-20 items-end gap-1">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-primary/80" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}
