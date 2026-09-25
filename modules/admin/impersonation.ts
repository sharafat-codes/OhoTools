"use server";

import { cookies } from "next/headers";
import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

import { auth } from "@/lib/auth";
import { isAdmin, requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { IMPERSONATION_COOKIE } from "@/modules/admin/impersonation-cookie";
import type { AdminResult } from "@/modules/admin/actions";

/**
 * "Log in as this user" — support impersonation.
 *
 * Better Auth has no impersonation endpoint in the core package (only the admin
 * plugin does, and adopting that plugin would mean new columns, a new set of
 * public /api/auth/admin/* endpoints, and a lowercase role vocabulary this
 * schema doesn't use). So the session is issued here instead, in exactly the
 * format Better Auth itself issues:
 *
 *   - a row in `session` with a random token and a short expiry;
 *   - the session cookie set to `token.hmacSha256(token, secret)`, base64 —
 *     the same signed-cookie scheme better-call writes and verifies;
 *   - the `dont_remember` cookie set, which is what stops Better Auth's daily
 *     refresh from quietly extending the 60-minute session to the full 7 days.
 *
 * The admin's own session is never destroyed. A signed, httpOnly cookie records
 * its row id so stopping hands the browser straight back to it.
 */

/** How long a "log in as" session lasts before it simply stops working. */
const IMPERSONATION_MINUTES = 60;

const enc = new TextEncoder();

async function hmacKey(secret: string, usages: KeyUsage[]) {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, usages);
}

/** `value.signature`, the shape better-call's signed cookies use. */
async function sign(value: string, secret: string) {
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret, ["sign"]), enc.encode(value));
  return `${value}.${btoa(String.fromCharCode(...new Uint8Array(sig)))}`;
}

/** Returns the signed value, or null if it is missing, malformed or forged. */
async function unsign(raw: string | undefined, secret: string): Promise<string | null> {
  if (!raw) return null;
  const at = raw.lastIndexOf(".");
  if (at < 1) return null;
  const value = raw.slice(0, at);
  let sig: Uint8Array<ArrayBuffer>;
  try {
    const bin = atob(raw.slice(at + 1));
    sig = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) sig[i] = bin.charCodeAt(i);
  } catch {
    return null;
  }
  const ok = await crypto.subtle.verify("HMAC", await hmacKey(secret, ["verify"]), sig, enc.encode(value));
  return ok ? value : null;
}

/** base64url, so the token never contains the "." that splits a signed value. */
function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

type AuthAttrs = {
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  maxAge?: number;
  sameSite?: "Strict" | "Lax" | "None" | "strict" | "lax" | "none";
};

/**
 * Better Auth's cookie attributes in the shape Next's cookie jar accepts.
 *
 * `session: true` drops the lifetime so the cookie dies with the browser — an
 * impersonation must not outlive the tab it was started in.
 */
function attrs(a: AuthAttrs, opts: { session?: boolean; maxAge?: number } = {}) {
  return {
    domain: a.domain,
    path: a.path ?? "/",
    secure: a.secure,
    httpOnly: a.httpOnly,
    sameSite: a.sameSite?.toLowerCase() as "lax" | "strict" | "none" | undefined,
    maxAge: opts.session ? undefined : (opts.maxAge ?? a.maxAge),
  };
}

/**
 * Expires a cookie by overwriting it rather than calling jar.delete(), which
 * omits Secure — and a browser refuses to overwrite a `__Secure-` cookie with
 * an insecure one, so the delete would be silently dropped in production.
 */
function expire(jar: ResponseCookies, name: string, a: AuthAttrs) {
  jar.set(name, "", { ...attrs(a), maxAge: 0 });
}

/** Cookie names, attributes and signing secret, straight from Better Auth. */
async function authCookies() {
  const ctx = await auth.$context;
  return {
    secret: ctx.secret,
    session: ctx.authCookies.sessionToken,
    dontRemember: ctx.authCookies.dontRememberToken,
    // Named apart from the admin plugin's own "admin_session" so the two could
    // never be mistaken for one another.
    back: ctx.createAuthCookie("admin_return"),
  };
}

/**
 * Starts impersonating a user. The caller is expected to do a full page load
 * afterwards — every server component has to re-render against the new session.
 */
export async function impersonateUser(userId: string): Promise<AdminResult> {
  const admin = await requireAdmin();
  if (admin.id === userId) return { ok: false, error: "That account is already you." };

  const { secret, session, dontRemember, back } = await authCookies();
  const jar = await cookies();

  // Nesting would overwrite the one pointer back to the admin session and
  // strand whoever started it.
  if (jar.get(back.name)) {
    return { ok: false, error: "You're already logged in as someone else. Stop that first." };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!target) return { ok: false, error: "That user no longer exists." };
  if (target.role === "ADMIN") {
    return { ok: false, error: "Admin accounts can't be logged into this way." };
  }

  // Point at the admin's session by row id, not by its token: a second copy of
  // a live token in the browser would be a second credential to lose.
  const adminToken = await unsign(jar.get(session.name)?.value, secret);
  const adminSession = adminToken
    ? await prisma.session.findUnique({ where: { token: adminToken }, select: { id: true, userId: true } })
    : null;
  if (!adminSession || adminSession.userId !== admin.id) {
    return { ok: false, error: "Couldn't identify your own session. Please sign in again." };
  }

  const token = randomToken();
  await prisma.session.create({
    data: {
      id: randomToken(),
      token,
      userId: target.id,
      expiresAt: new Date(Date.now() + IMPERSONATION_MINUTES * 60_000),
      // Nothing in the app reads userAgent, so it doubles as the audit trail:
      // this row is visibly not a real sign-in.
      userAgent: `impersonated by ${admin.email}`,
    },
  });

  const wasDontRemember = await unsign(jar.get(dontRemember.name)?.value, secret);

  jar.set(back.name, await sign(`${adminSession.id}:${wasDontRemember ? "1" : ""}`, secret), attrs(back.attributes, { session: true }));
  jar.set(session.name, await sign(token, secret), attrs(session.attributes, { session: true }));
  // Better Auth skips its refresh pass when this is set. Without it the first
  // request would push expiresAt out to the full 7 days.
  jar.set(dontRemember.name, await sign("true", secret), attrs(dontRemember.attributes, { session: true }));
  // Readable by the banner. Label only — no credential.
  jar.set(IMPERSONATION_COOKIE, target.name?.trim() || target.email, {
    path: "/",
    sameSite: "lax",
    secure: session.attributes.secure,
    httpOnly: false,
  });

  return { ok: true };
}

/**
 * Hands the browser back to the admin session and deletes the impersonated one.
 *
 * Called from a banner that renders on every page, so it has to be safe to call
 * from a signed-out or half-expired state: anything it can't verify ends in a
 * clean sign-out rather than leaving the browser as somebody else.
 */
export async function stopImpersonating(): Promise<AdminResult> {
  const { secret, session, dontRemember, back } = await authCookies();
  const jar = await cookies();

  const payload = await unsign(jar.get(back.name)?.value, secret);
  const currentToken = await unsign(jar.get(session.name)?.value, secret);

  // The marker goes first and on every path, or a failure would leave the
  // banner up with no way to dismiss it.
  expire(jar, IMPERSONATION_COOKIE, { path: "/", secure: session.attributes.secure });
  expire(jar, back.name, back.attributes);

  async function signOut(error: string): Promise<AdminResult> {
    if (currentToken) await prisma.session.deleteMany({ where: { token: currentToken } });
    expire(jar, session.name, session.attributes);
    expire(jar, dontRemember.name, dontRemember.attributes);
    return { ok: false, error };
  }

  if (!payload) return signOut("Couldn't find your admin session. Please sign in again.");

  const split = payload.indexOf(":");
  const adminSessionId = split === -1 ? payload : payload.slice(0, split);
  const keepDontRemember = split !== -1 && payload.slice(split + 1) === "1";

  const adminSession = await prisma.session.findUnique({
    where: { id: adminSessionId },
    select: { token: true, expiresAt: true, user: { select: { role: true, email: true } } },
  });
  if (!adminSession || adminSession.expiresAt <= new Date()) {
    return signOut("Your admin session expired. Please sign in again.");
  }
  // Re-checked rather than trusted: the account could have been demoted while
  // the impersonation was open.
  if (!isAdmin(adminSession.user)) return signOut("That account is no longer an admin.");

  if (currentToken && currentToken !== adminSession.token) {
    await prisma.session.deleteMany({ where: { token: currentToken } });
  }

  jar.set(session.name, await sign(adminSession.token, secret), attrs(session.attributes, { session: keepDontRemember }));
  if (keepDontRemember) {
    jar.set(dontRemember.name, await sign("true", secret), attrs(dontRemember.attributes, { session: true }));
  } else {
    expire(jar, dontRemember.name, dontRemember.attributes);
  }

  return { ok: true };
}
