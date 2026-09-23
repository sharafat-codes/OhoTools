import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/dal";
import { createJazzCashCheckout, isJazzCashConfigured } from "@/lib/jazzcash";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Builds a signed JazzCash form for a Pro pass. The browser posts these fields
// straight to JazzCash — the signature is generated here and never in the
// client, since it depends on the integrity salt.
export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }
  if (!isJazzCashConfigured()) {
    return NextResponse.json({ error: "JazzCash isn't configured yet." }, { status: 503 });
  }

  try {
    const checkout = await createJazzCashCheckout({
      userId: (user as { id: string }).id,
      returnUrl: `${SITE_URL}/api/pay/jazzcash/return`,
    });
    return NextResponse.json(checkout);
  } catch (e) {
    console.error("[jazzcash] could not create checkout", e);
    return NextResponse.json(
      { error: "Couldn't start checkout. Please try again." },
      { status: 502 },
    );
  }
}
