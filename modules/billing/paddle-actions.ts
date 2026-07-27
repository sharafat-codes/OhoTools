"use server";

import { requireUser } from "@/lib/dal";
import { getPaddle, isPaddleConfigured } from "@/lib/paddle";

type ActionResult = { url: string } | { error: string };

/**
 * Opens the Paddle customer portal (manage / cancel a subscription).
 * We look the customer up by email at click-time, so no Paddle customer ID
 * needs to be stored in our database.
 */
export async function createPaddlePortalSession(): Promise<ActionResult> {
  const user = await requireUser();
  if (!isPaddleConfigured) return { error: "Billing isn't configured yet." };

  try {
    const paddle = getPaddle();

    const collection = paddle.customers.list({ email: [user.email] });
    const customers = await collection.next();
    const customer = customers?.[0];
    if (!customer) {
      return { error: "No Paddle subscription was found for your account." };
    }

    const session = await paddle.customerPortalSessions.create(customer.id, []);
    const url = session.urls?.general?.overview;
    if (!url) return { error: "Could not open the billing portal." };
    return { url };
  } catch (err) {
    const e = err as { code?: string; detail?: string; message?: string };
    const detail = e.detail || e.message || e.code;
    return {
      error: detail
        ? `Could not open the billing portal: ${detail}`
        : "Could not open the billing portal. Try again.",
    };
  }
}
