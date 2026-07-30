import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { sendEmail, renderActionEmail } from "@/lib/email";

// BETTER_AUTH_SECRET and BETTER_AUTH_URL are read from the environment
// automatically by Better Auth.

// Google sign-in turns on only when its OAuth credentials are present, so the
// app (and local dev) runs fine before they're configured.
const googleConfigured =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

/** Whether Google social login is available — used to gate the UI button. */
export const isGoogleAuthEnabled = googleConfigured;

export const auth = betterAuth({
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
          clientId: process.env.GOOGLE_CLIENT_ID as string,
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

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day
  },

  // nextCookies must be last: it forwards Set-Cookie headers for any auth calls
  // made from Server Actions / Route Handlers.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
