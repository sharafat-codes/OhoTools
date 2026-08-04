import { Card, CardContent } from "@/components/ui/card";

// Small server-rendered bar chart (magnitude over time). Single series → no
// legend (the title names it); one brand hue; text stays in muted ink tokens.
export function MiniBarChart({
  title,
  total,
  data,
}: {
  title: string;
  total: number;
  data: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const slot = 24;
  const barW = 15;
  const plotH = 88;
  const padTop = 8;
  const H = padTop + plotH;
  const W = Math.max(1, data.length) * slot;

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">{title}</span>
          <span className="font-heading text-lg font-semibold tabular-nums">{total.toLocaleString()}</span>
        </div>

        {total === 0 ? (
          <p className="py-8 text-center text-xs text-muted-foreground">No data yet</p>
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label={title}>
            {data.map((d, i) => {
              const h = max > 0 ? (d.value / max) * plotH : 0;
              const drawn = d.value > 0 ? Math.max(h, 2) : 0;
              const x = i * slot + (slot - barW) / 2;
              const y = padTop + (plotH - drawn);
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={barW}
                  height={drawn}
                  rx={2}
                  className={d.value > 0 ? "fill-primary" : "fill-muted"}
                >
                  <title>
                    {d.label}: {d.value}
                  </title>
                </rect>
              );
            })}
          </svg>
        )}

        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>{data[0]?.label}</span>
          <span>{data[data.length - 1]?.label}</span>
        </div>
      </CardContent>
    </Card>
  );
}
