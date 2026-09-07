import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Delete one saved interview session. Ownership is enforced in the where clause,
// so a user can only ever delete their own.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  await prisma.interviewSession.deleteMany({
    where: { id, userId: (user as { id: string }).id },
  });

  return NextResponse.json({ ok: true });
}
