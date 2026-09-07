"use client";

// Lightweight score-over-time line chart for interview history — inline SVG, no
// chart library, theme-aware via currentColor + the primary token. Points are
// passed oldest → newest so the line reads left-to-right (improvement).
export function ProgressChart({ points }: { points: { score: number; label: string }[] }) {
  if (points.length < 2) return null;

  const w = 640;
  const h = 180;
  const pad = 28;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  const x = (i: number) => pad + (i * innerW) / (points.length - 1);
  const y = (score: number) => pad + (1 - score / 100) * innerH;

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.score)}`).join(" ");
  const area = `${line} L${x(points.length - 1)},${pad + innerH} L${x(0)},${pad + innerH} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full min-w-[420px]" role="img" aria-label="Interview score over time">
        {/* gridlines at 0/50/100 */}
        {[0, 50, 100].map((g) => (
          <g key={g}>
            <line x1={pad} x2={w - pad} y1={y(g)} y2={y(g)} className="stroke-border" strokeWidth={1} />
            <text x={4} y={y(g) + 4} className="fill-muted-foreground text-[10px]">{g}</text>
          </g>
        ))}
        {/* area + line */}
        <path d={area} className="fill-primary/10" />
        <path d={line} className="fill-none stroke-primary" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {/* points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.score)} r={4} className="fill-primary" />
            <text x={x(i)} y={y(p.score) - 10} textAnchor="middle" className="fill-foreground text-[11px] font-medium">
              {p.score}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
