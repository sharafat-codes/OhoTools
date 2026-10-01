import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { sendEmail, renderActionEmail } from "@/lib/email";
import { sendMarketingEmail } from "@/lib/email-prefs";
import { SITE_URL } from "@/lib/site";

const origin = SITE_URL.replace(/\/$/, "");

// BETTER_AUTH_SECRET is read from the environment automatically.
//
// baseURL is passed explicitly rather than left to BETTER_AUTH_URL alone. When
// that variable is missing or wrong — which is easy to do when moving hosts —
// Better Auth infers an origin from the incoming request, and behind a reverse
// proxy that can come out as http://localhost. Every sign-in then fails with
// INVALID_ORIGIN, because the browser's Origin header no longer matches.
// Development still overrides it via BETTER_AUTH_URL=http://localhost:3000.
const baseURL = process.env.BETTER_AUTH_URL?.trim() || origin;

/**
 * Origins allowed to post to the auth endpoints (Better Auth's CSRF check).
 *
 * Covers both the apex and www forms of the canonical domain, since serving
 * both and only trusting one is an easy way to lock out half your visitors.
 * AUTH_TRUSTED_ORIGINS adds any extra host — a staging domain, or the
 * temporary one a host gives you before DNS is pointed — as a comma-separated
 * list. Keep it tight: anything listed here can drive a sign-in.
 */
const trustedOrigins = [
  ...new Set(
    [
      baseURL,
      origin,
      ...[baseURL, origin].flatMap((u) => {
        try {
          const { protocol, host } = new URL(u);
          const bare = host.replace(/^www\./, "");
          return [`${protocol}//${bare}`, `${protocol}//www.${bare}`];
        } catch {
          return [];
        }
      }),
      ...(process.env.AUTH_TRUSTED_ORIGINS ?? "")
        .split(",")
        .map((s) => s.trim().replace(/\/$/, ""))
        .filter(Boolean),
    ].filter(Boolean),
  ),
];

// Reuse the same Google OAuth client the Drive picker already uses
// (NEXT_PUBLIC_GOOGLE_CLIENT_ID) — only the server-side secret is new. A
// dedicated GOOGLE_CLIENT_ID still takes precedence if it's set. Sign-in turns
// on only once both an id and secret are present, so dev runs fine without them.
const googleClientId =
  process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const googleConfigured = !!googleClientId && !!process.env.GOOGLE_CLIENT_SECRET;

/** Whether Google social login is available — used to gate the UI button. */
export const isGoogleAuthEnabled = googleConfigured;

export const auth = betterAuth({
  baseURL,
  trustedOrigins,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    // Onboarding stays frictionless (verification is sent but not required).
    requireEmailVerification: false,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your OhoTool password",
        html: renderActionEmail({
          heading: "Reset your password",
          body: "We received a request to reset your OhoTool password. Click the button below to choose a new one. This link expires in 1 hour.",
          buttonLabel: "Reset password",
          buttonUrl: url,
          footnote:
            "If you didn't request a password reset, you can safely ignore this email.",
        }),
      });
    },
  },

  emailVerification: {
    // Send a verification email on sign-up (non-blocking — see
    // requireEmailVerification above).
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email for OhoTool",
        html: renderActionEmail({
          heading: "Confirm your email",
          body: "Welcome to OhoTool! Please confirm your email address to secure your account.",
          buttonLabel: "Verify email",
          buttonUrl: url,
          footnote:
            "If you didn't create a OhoTool account, you can ignore this email.",
        }),
      });
    },
  },

  socialProviders: googleConfigured
    ? {
        google: {
          clientId: googleClientId as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      }
    : undefined,

  // If someone signs up with email and later signs in with Google (or vice
  // versa) using the same verified email, link them into one account instead
  // of creating a duplicate. Google is trusted because it verifies emails.
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  // Surface OhoTool-specific columns back through the session. The values are
  // written by Prisma defaults (see prisma/schema.prisma); `input: false`
  // prevents clients from setting them at sign-up.
  user: {
    additionalFields: {
      role: { type: "string", required: false, input: false },
      plan: { type: "string", required: false, input: false },
    },
  },

  // Send a welcome/onboarding email right after any account is created (email
  // or Google). Best-effort — a send failure must never block sign-up.
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const firstName = (user.name || "").trim().split(/\s+/)[0] || "there";
            await sendMarketingEmail({
              userId: user.id,
              to: user.email,
              subject: "Welcome to OhoTool 👋",
              heading: `Welcome, ${firstName}!`,
              intro:
                "You've got 200+ free tools that run right in your browser — nothing is uploaded. A few worth trying first:",
              bullets: [
                "<strong>Convert &amp; compress</strong> PDFs, images, audio and video",
                "<strong>AI writing &amp; Chat with PDF</strong> — summarize, rewrite, translate, and ask documents questions",
                "<strong>AI Mock Interview</strong> — practice technical &amp; behavioral interviews and get a scored report",
                "<strong>Encrypted file sharing</strong> and a QR code generator",
              ],
              buttonLabel: "Explore the tools",
              buttonUrl: `${origin}/tools`,
              outro:
                "Need more? Pro unlocks unlimited AI, Office ↔ PDF conversions, and longer mock interviews.",
            });
          } catch {
            /* welcome email is best-effort */
          }
        },
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day
  },

  // nextCookies must be last: it forwards Set-Cookie headers for any auth calls
  // made from Server Actions / Route Handlers.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
