import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";

// BETTER_AUTH_SECRET and BETTER_AUTH_URL are read from the environment
// automatically by Better Auth.
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    // Phase 1 keeps onboarding frictionless. Flip to true once Resend is wired
    // in Phase 3 so verification emails can actually be delivered.
    requireEmailVerification: false,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      // TODO (Phase 3): send via Resend. Until then, the link is logged to the
      // server console so the reset flow is fully testable in development.
      console.log(
        `\n[ToolPilot] Password reset for ${user.email}:\n${url}\n`,
      );
    },
  },

  // Surface ToolPilot-specific columns back through the session. The values are
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
