import "server-only";

import { Environment, Paddle } from "@paddle/paddle-node-sdk";

// Paddle (Merchant of Record) — used alongside Stripe. Server-side config only.
// The browser uses NEXT_PUBLIC_PADDLE_* vars via the checkout button.

// Trim defensively — a stray space/newline in the env value produces
// Paddle's "authentication_malformed" and breaks every server-side call.
const PADDLE_API_KEY = process.env.PADDLE_API_KEY?.trim();

export const isPaddleConfigured = Boolean(PADDLE_API_KEY);

export const paddleEnvironment: Environment =
  process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
    ? Environment.production
    : Environment.sandbox;

let cached: Paddle | null = null;

export function getPaddle(): Paddle {
  if (!PADDLE_API_KEY) {
    throw new Error("PADDLE_API_KEY is not set");
  }
  if (!cached) {
    cached = new Paddle(PADDLE_API_KEY, { environment: paddleEnvironment });
  }
  return cached;
}
