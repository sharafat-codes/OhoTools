import { Card, CardContent } from "@/components/ui/card";

export function StatTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 font-heading text-2xl font-semibold">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export function DailyBars({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div>
      <div className="flex h-36 items-end gap-px">
        {data.map((d) => (
          <div key={d.date} className="flex h-full flex-1 items-end" title={`${d.date}: ${d.count} scan${d.count === 1 ? "" : "s"}`}>
            <div
              className="w-full rounded-t bg-primary/85 transition-all hover:bg-primary"
              style={{ height: `${Math.max((d.count / max) * 100, d.count > 0 ? 4 : 0)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

export function Breakdown({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: { label: string; value: number }[];
  empty: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm font-medium">{title}</p>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty}</p>
        ) : (
          rows.map((r) => (
            <div key={r.label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="truncate">{r.label}</span>
                <span className="tabular-nums text-muted-foreground">{r.value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(r.value / max) * 100}%` }} />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
