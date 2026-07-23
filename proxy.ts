import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Next.js 16: this file replaces `middleware.ts`. It runs on the Node runtime.
//
// This is an OPTIMISTIC check only — it reads the presence of the session cookie
// without validating it against the database, so it stays fast on every request.
// Real authorization lives in lib/dal.ts (requireUser), which every protected
// page and Server Action must still call.

const AUTH_PAGES = ["/login", "/signup"];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(getSessionCookie(req));

  // Signed-out users cannot reach the dashboard or admin (role checked in DAL).
  if (!hasSession && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Signed-in users skip the login/signup screens.
  if (hasSession && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],
};
