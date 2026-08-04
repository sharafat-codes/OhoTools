import { Card, CardContent } from "@/components/ui/card";

// Small server-rendered bar chart (magnitude over time). Single series → no
// legend (the title names it); one brand hue; text stays in muted ink tokens.
// Fixed compact height + a baseline so bars sit grounded, not floating.
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
  const barW = 14;
  const H = 100;
  const top = 8;
  const plotH = H - top;
  const W = Math.max(1, data.length) * slot;

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">{title}</span>
          <span className="font-heading text-lg font-semibold tabular-nums">{total.toLocaleString()}</span>
        </div>

        {total === 0 ? (
          <div className="mt-3 flex h-24 items-center justify-center rounded-md border border-dashed border-border">
            <span className="text-xs text-muted-foreground">No data yet</span>
          </div>
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="mt-3 h-24 w-full" role="img" aria-label={title}>
            {/* baseline */}
            <line
              x1="0"
              y1={H - 0.5}
              x2={W}
              y2={H - 0.5}
              className="stroke-border"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            {data.map((d, i) => {
              const h = (d.value / max) * plotH;
              const drawn = d.value > 0 ? Math.max(h, 3) : 0;
              const x = i * slot + (slot - barW) / 2;
              const y = top + (plotH - drawn);
              return (
                <rect key={i} x={x} y={y} width={barW} height={drawn} rx="1.5" className="fill-primary">
                  <title>
                    {d.label}: {d.value}
                  </title>
                </rect>
              );
            })}
          </svg>
        )}

        <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
          <span>{data[0]?.label}</span>
          <span>{data[data.length - 1]?.label}</span>
        </div>
      </CardContent>
    </Card>
  );
}
