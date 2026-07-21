import type { NextRequest } from "next/server";
import type Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { syncStripeForCustomer } from "@/lib/stripe-sync";

// Stripe requires the raw request body to verify the signature, so we read
// text() rather than json().
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) {
    return new Response("Webhook not configured", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const obj = event.data.object as
          | Stripe.Checkout.Session
          | Stripe.Subscription;
        const customerId =
          typeof obj.customer === "string"
            ? obj.customer
            : (obj.customer?.id ?? null);
        if (customerId) await syncStripeForCustomer(customerId);
        break;
      }
      default:
        break;
    }
  } catch {
    // Return 500 so Stripe retries.
    return new Response("Handler error", { status: 500 });
  }

  return new Response(null, { status: 200 });
}
