import { NextResponse, type NextRequest } from "next/server";

import { completeJazzCashPayment } from "@/lib/jazzcash";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// JazzCash sends the customer's browser back here with a form POST carrying the
// result. The signature is verified before anything is granted, so this cannot
// be forged by pointing a browser at the URL.
//
// Always ends in a redirect: the customer is sitting in front of this, so they
// must land on a real page rather than see JSON.
async function handle(req: NextRequest) {
  const fields: Record<string, string> = {};

  try {
    if (req.method === "POST") {
      const form = await req.formData();
      for (const [k, v] of form.entries()) fields[k] = String(v);
    } else {
      req.nextUrl.searchParams.forEach((v, k) => {
        fields[k] = v;
      });
    }
  } catch {
    return NextResponse.redirect(`${SITE_URL}/dashboard/billing?jazzcash=error`, 303);
  }

  const result = await completeJazzCashPayment(fields);

  if (result.ok) {
    return NextResponse.redirect(`${SITE_URL}/dashboard/billing?checkout=success`, 303);
  }

  // Log the reason for support, but never show the customer a raw gateway code.
  console.error("[jazzcash] payment not completed", {
    reason: result.reason,
    txnRef: fields.pp_TxnRefNo,
    code: fields.pp_ResponseCode,
  });

  const status = result.reason.startsWith("declined") ? "declined" : "error";
  return NextResponse.redirect(`${SITE_URL}/dashboard/billing?jazzcash=${status}`, 303);
}

export const POST = handle;
export const GET = handle;
