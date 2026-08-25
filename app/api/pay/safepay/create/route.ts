import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/dal";
import { isSafepayConfigured, createProCheckout } from "@/lib/safepay";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Starts a Safepay hosted checkout for a Pro pass and returns the redirect URL.
export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  if (!isSafepayConfigured()) {
    return NextResponse.json({ error: "Safepay isn't configured yet." }, { status: 503 });
  }

  const userId = (user as { id: string }).id;
  // Encode the user in the order id so the webhook can attribute the payment.
  const orderId = `pro_${userId}_${Date.now()}`;

  try {
    const url = await createProCheckout({
      orderId,
      redirectUrl: `${SITE_URL}/dashboard/billing?safepay=success`,
      cancelUrl: `${SITE_URL}/pricing?safepay=cancel`,
    });
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Couldn't start checkout. Please try again." }, { status: 502 });
  }
}
