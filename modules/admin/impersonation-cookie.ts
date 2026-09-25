/**
 * Name of the one impersonation cookie the browser is allowed to read.
 *
 * It holds nothing but the label shown in the banner ("alice@example.com") —
 * the credentials live in separate httpOnly, signed cookies. Kept in its own
 * module because the server actions in ./impersonation.ts carry a "use server"
 * directive, and such a file may only export async functions.
 */
export const IMPERSONATION_COOKIE = "oho_imp";
