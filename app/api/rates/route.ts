// Live exchange rates for the Currency Converter tool. Proxies a free, no-key
// provider and caches the upstream response for an hour so we don't hammer it.
export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return Response.json({ error: "Rates unavailable" }, { status: 502 });
    }
    const data = (await res.json()) as {
      rates?: Record<string, number>;
      time_last_update_utc?: string;
    };
    if (!data.rates) {
      return Response.json({ error: "Rates unavailable" }, { status: 502 });
    }
    return Response.json({
      base: "USD",
      rates: data.rates,
      updated: data.time_last_update_utc ?? "",
    });
  } catch {
    return Response.json({ error: "Rates unavailable" }, { status: 502 });
  }
}
