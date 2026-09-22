// Display constants for the one-time Pro pass, safe to import from both server
// components and client components. The server-only Paddle SDK config lives in
// lib/paddle.ts, which cannot be imported into the browser.
//
// PASS_PRICE is for DISPLAY ONLY — Paddle is the source of truth for what is
// actually charged. If you change the price in Paddle, change it here too, or
// the page will advertise a number the checkout does not honour.

export const PASS_DAYS = Number(process.env.NEXT_PUBLIC_PADDLE_PASS_DAYS || 30);
export const PASS_PRICE = (process.env.NEXT_PUBLIC_PADDLE_PASS_PRICE || "").trim();

/** True once a one-time price id is configured. Everything pass-related hides until then. */
export const isPaddlePassOffered = Boolean((process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_PASS || "").trim());
