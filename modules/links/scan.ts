export function parseDevice(ua: string | null): string {
  if (!ua) return "Unknown";
  if (/ipad|tablet|playbook|silk/i.test(ua)) return "Tablet";
  if (/mobi|iphone|android.*mobile|phone/i.test(ua)) return "Mobile";
  return "Desktop";
}

export function parseReferrer(referer: string | null): string {
  if (!referer) return "Direct";
  try {
    return new URL(referer).hostname.replace(/^www\./, "") || "Direct";
  } catch {
    return "Direct";
  }
}
