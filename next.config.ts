import type { NextConfig } from "next";

// Baseline security headers applied to every route. These are a minor trust /
// quality signal and harden the site without affecting rendering.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

// Embeddable tool pages (/embed/*) are meant to be framed by other sites, so
// they must NOT carry X-Frame-Options: SAMEORIGIN. We drop XFO for them and use
// CSP frame-ancestors * (the modern, per-route way to allow cross-site framing).
const embedHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Content-Security-Policy", value: "frame-ancestors *" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Hostinger builds on a shared machine with dozens of CPUs but a low cap on
  // processes and threads per account. Left alone, Next starts one build
  // worker per CPU (63 there) and each spawns its own native threads, which
  // hits the cap ("OS can't spawn worker thread", os error 11). Two workers
  // build reliably; the build is a little slower, never failed.
  experimental: { cpus: 2 },
  async headers() {
    return [
      // Everything except /embed/* gets the full hardening (incl. XFO).
      { source: "/((?!embed/).*)", headers: securityHeaders },
      // /embed/* is intentionally framable anywhere.
      { source: "/embed/:path*", headers: embedHeaders },
    ];
  },
};

export default nextConfig;
