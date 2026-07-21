import type { NextRequest } from "next/server";

import { authenticateApiKey } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await authenticateApiKey(req);
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }
  return Response.json({ user: { id: auth.userId, plan: auth.plan } });
}
