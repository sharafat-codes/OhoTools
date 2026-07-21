/** The app's public base URL, used for building short links and redirects. */
export function getAppUrl() {
  return process.env.BETTER_AUTH_URL || "http://localhost:3000";
}
