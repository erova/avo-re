type Metric = {
  label: string;
  value: string;
  note?: string;
};

export function MetricTiles({
  items,
  columns = 3,
}: {
  items: Metric[];
  columns?: 2 | 3 | 4;
}) {
  const grid =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
      ? "md:grid-cols-4"
      : "md:grid-cols-3";

  return (
    <div className={`not-prose my-8 grid grid-cols-1 gap-3 ${grid}`}>
      {items.map((m, idx) => (
        <div
          key={idx}
          className="rounded-3xl border border-neutral-800/70 bg-neutral-900/30 p-5"
        >
          <div className="text-xs uppercase tracking-wider text-neutral-500">
            {m.label}
          </div>
          <div className="mt-2 text-2xl font-medium tracking-tight text-neutral-100">
            {m.value}
          </div>
          {m.note ? (
            <div className="mt-2 text-sm text-neutral-400">{m.note}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}