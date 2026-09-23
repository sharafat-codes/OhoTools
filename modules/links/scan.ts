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

/**
 * Link-preview crawlers, search bots and scripted clients. These hit a short
 * link without a human ever seeing the destination, so counting them inflates a
 * customer's scan numbers — sharing a link in WhatsApp used to register a
 * "scan" before anybody had opened it, which makes the analytics actively
 * misleading on a paid feature.
 *
 * Deliberately a list of known agents rather than a broad heuristic: missing a
 * bot only leaves the old behaviour, but a false positive silently loses a real
 * scan, which is the worse failure. An absent User-Agent is NOT treated as a
 * bot for the same reason.
 */
const BOT_UA =
  /bot\b|crawler|spider|slurp|facebookexternalhit|facebot|whatsapp|telegram|slack-imgproxy|slackbot|discord|twitterbot|linkedinbot|pinterest|redditbot|skypeuripreview|viber|embedly|iframely|quora link|nuzzel|vkshare|applebot|googlebot|bingbot|yandex|baiduspider|duckduckbot|petalbot|uptimerobot|pingdom|statuscake|headlesschrome|lighthouse|curl\/|wget|python-requests|axios\/|node-fetch|go-http-client|okhttp|java\/|libwww|apache-httpclient|postmanruntime|insomnia/i;

export function isBotUserAgent(ua: string | null): boolean {
  if (!ua) return false;
  return BOT_UA.test(ua);
}
