import Link from "next/link";
import QRCode from "qrcode";
import {
  ArrowRightIcon,
  BarChart3Icon,
  CheckIcon,
  LayersIcon,
  PaletteIcon,
  ScanBarcodeIcon,
  SparklesIcon,
  TerminalIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";

import { getCurrentUser } from "@/lib/dal";
import { qrToSvgString } from "@/modules/qr/render";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/modules/marketing/components/site-header";

const siteUrl = process.env.BETTER_AUTH_URL || "https://oho-tools.vercel.app";

const faqs = [
  {
    q: "What's a dynamic QR code?",
    a: "A dynamic QR encodes a short link you own. You can change where it points at any time — even after it's printed — and every scan is tracked with analytics.",
  },
  {
    q: "Do the codes ever expire?",
    a: "Static QR codes never expire. Dynamic codes stay live as long as your account is active, and you can set an optional expiry date per code.",
  },
  {
    q: "Can I add my logo and brand colors?",
    a: "Yes. On Pro you can drop a logo in the center, choose rounded or dot module shapes, apply color gradients, and export as PNG, SVG, or PDF.",
  },
  {
    q: "Is there an API?",
    a: "Pro includes API keys and a REST endpoint so you can generate QR codes programmatically from your own apps and scripts.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Manage or cancel your subscription in one click from the billing portal — no emails, no hassle.",
  },
];

export default async function Home() {
  const user = await getCurrentUser();

  const heroQr = await QRCode.toString(siteUrl, {
    type: "svg",
    margin: 1,
    color: { dark: "#0a0a0a", light: "#ffffff" },
  });
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
      },
      {
        "@type": "SoftwareApplication",
        name: "OhoTool",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: siteUrl,
        description:
          "Generate dynamic QR codes and barcodes, track scans with analytics, add branding, export SVG/PDF, and automate with an API.",
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

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-primary)/8%,transparent)]"
          />
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
            <div className="flex flex-col items-start">
              <Badge variant="secondary" className="mb-5">
                <SparklesIcon className="size-3.5" />
                Now with dynamic QR + scan analytics
              </Badge>
              <h1 className="font-heading text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
                QR codes that work as hard as you do.
              </h1>
              <p className="mt-6 max-w-lg text-pretty text-lg text-muted-foreground">
                Create branded QR codes and barcodes, change where they point
                anytime, and track every scan. Plus bulk generation and an API —
                all from one modern dashboard.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" render={<Link href={user ? "/dashboard" : "/signup"} />}>
                  {user ? "Go to dashboard" : "Start for free"}
                  <ArrowRightIcon />
                </Button>
                <Button size="lg" variant="outline" render={<Link href="#features" />}>
                  See features
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Free forever plan · No credit card required
              </p>
            </div>

            {/* Real, scannable QR */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mx-auto w-52 [&>svg]:h-auto [&>svg]:w-full">
                  <div
                    className="overflow-hidden rounded-xl"
                    dangerouslySetInnerHTML={{ __html: heroQr }}
                  />
                </div>
                <p className="mt-4 text-center text-sm font-medium">Scan me →</p>
                <p className="text-center text-xs text-muted-foreground">
                  This is a live OhoTool QR code.
                </p>
                <div className="absolute -right-3 -top-3 flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium shadow-sm">
                  <BarChart3Icon className="size-3.5 text-primary" />
                  1,204 scans
                </div>
              </div>
            </div>
          </div>

          {/* Segments strip */}
          <div className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Built for restaurants · retail · events · agencies · creators
            </p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 border-t border-border/60 bg-muted/20 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Features"
              title="Everything you need to run QR at scale"
              subtitle="From a one-off code to thousands, with the branding, tracking, and automation that businesses actually need."
            />

            <div className="mt-12 grid gap-4 md:grid-cols-6">
              {/* Big: dynamic + analytics */}
              <FeatureCard
                className="md:col-span-4"
                icon={ZapIcon}
                title="Dynamic QR + scan analytics"
                body="Point a printed code anywhere, then re-point it whenever you want. Track scans over time, by device and referrer."
              >
                <AnalyticsMock />
              </FeatureCard>

              {/* Branding */}
              <FeatureCard
                className="md:col-span-2"
                icon={PaletteIcon}
                title="On-brand by default"
                body="Logo, colors, gradients, and shapes. Export PNG, SVG, or PDF."
              >
                <div className="mx-auto mt-2 w-32 [&>svg]:h-auto [&>svg]:w-full">
                  <div dangerouslySetInnerHTML={{ __html: brandedQr }} />
                </div>
              </FeatureCard>

              {/* API */}
              <FeatureCard
                className="md:col-span-3"
                icon={TerminalIcon}
                title="Automate with the API"
                body="Generate codes programmatically with a simple REST endpoint."
              >
                <pre className="mt-2 overflow-x-auto rounded-lg bg-foreground/90 p-3 text-xs text-background">
                  <code className="font-mono">{`curl -H "Authorization: Bearer oho_…" \\
  "${siteUrl}/api/v1/qr?data=hello" \\
  --output qr.png`}</code>
                </pre>
              </FeatureCard>

              {/* Bulk */}
              <FeatureCard
                className="md:col-span-3"
                icon={LayersIcon}
                title="Bulk generation"
                body="Upload a CSV and download hundreds of codes as a ZIP in one go."
              />

              {/* Barcode */}
              <FeatureCard
                className="md:col-span-3"
                icon={ScanBarcodeIcon}
                title="Barcodes too"
                body="Every major format — Code 128, EAN, UPC, and more."
              />

              {/* History */}
              <FeatureCard
                className="md:col-span-3"
                icon={SparklesIcon}
                title="Saved to the cloud"
                body="Your whole history in one place, searchable and re-downloadable."
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Pricing"
              title="Simple, honest pricing"
              subtitle="Start free. Upgrade when you need branding, analytics, and automation."
            />
            <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-3">
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
        <section id="faq" className="scroll-mt-20 border-t border-border/60 bg-muted/20 py-20 sm:py-28">
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
        <section className="py-20 sm:py-28">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
            <div className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-14 text-center">
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Start generating in seconds
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Free to start. Upgrade anytime for branding, analytics, and API
                access.
              </p>
              <Button size="lg" className="mt-8" render={<Link href={user ? "/dashboard" : "/signup"} />}>
                {user ? "Open dashboard" : "Create your free account"}
                <ArrowRightIcon />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2 font-heading font-semibold">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
              <SparklesIcon className="size-3.5" />
            </span>
            OhoTool
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
            <Link href="/login" className="hover:text-foreground">Log in</Link>
            <Link href="/signup" className="hover:text-foreground">Sign up</Link>
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
    <div className={cn("flex flex-col rounded-xl border border-border bg-card p-5", className)}>
      <div className="mb-3 grid size-9 place-items-center rounded-lg bg-muted text-foreground">
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
