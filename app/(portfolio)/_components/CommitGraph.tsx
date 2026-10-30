import commits from "../../../content/portfolio/commits.json";

const CELL = 12;
const GAP = 3;
const PITCH = CELL + GAP;
const LEFT = 30;
const TOP = 20;
const ROWS = 7;
const DAY_LABELS: Record<number, string> = { 1: "Mon", 3: "Wed", 5: "Fri" };

/** A contribution graph drawn as vector shapes, so it stays sharp at any size and takes the field's colors. */
export function CommitGraph({ label }: { label: string }) {
  const weeks = commits.weeks;
  const width = LEFT + weeks.length * PITCH - GAP;
  const legendY = TOP + ROWS * PITCH + 10;
  const height = legendY + CELL + 2;
  const months = commits.months as Record<string, string>;
  const legendX = width - (5 * PITCH + 62);

  return (
    <svg className="commit-graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      {Object.entries(months).map(([i, m]) => (
        <text key={m} className="cg-label" x={LEFT + Number(i) * PITCH} y={11}>
          {m}
        </text>
      ))}
      {Object.entries(DAY_LABELS).map(([r, d]) => (
        <text key={d} className="cg-label" x={0} y={TOP + Number(r) * PITCH + CELL - 2}>
          {d}
        </text>
      ))}
      {weeks.map((w, c) =>
        [...w].map((ch, r) =>
          ch === "." ? null : (
            <rect
              key={`${c}-${r}`}
              className="cg-cell"
              data-level={ch}
              x={LEFT + c * PITCH}
              y={TOP + r * PITCH}
              width={CELL}
              height={CELL}
              rx={3}
            />
          ),
        ),
      )}
      <text className="cg-label" x={legendX} y={legendY + CELL - 2}>
        Less
      </text>
      {[0, 1, 2, 3, 4].map((l) => (
        <rect key={l} className="cg-cell" data-level={l} x={legendX + 32 + l * PITCH} y={legendY} width={CELL} height={CELL} rx={3} />
      ))}
      <text className="cg-label" x={legendX + 32 + 5 * PITCH + 3} y={legendY + CELL - 2}>
        More
      </text>
    </svg>
  );
}
