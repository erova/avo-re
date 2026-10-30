type Row = { org: string; years: string; total: number; directs: number; managers: number; note?: string };

/**
 * Management scope as stacked bars, one per role: my direct reports, the managers under them, and the
 * ICs under those. All bars share one scale, so a bar's length is its size. The counts are also written
 * out as text, so the figures never depend on reading a bar.
 */
export function ScopeChart({ title, lede, rows }: { title: string; lede?: string; rows: Row[] }) {
  const max = Math.max(...rows.map((r) => r.total));
  return (
    <figure className="scope">
      <figcaption className="scope-head">
        <h3 className="sub">{title}</h3>
        {lede && <p>{lede}</p>}
      </figcaption>
      <ul className="scope-key" aria-hidden="true">
        <li data-k="directs">My direct reports</li>
        <li data-k="managers">Managers reporting to them</li>
        <li data-k="ics">ICs under those managers</li>
      </ul>
      <ol className="scope-rows">
        {rows.map((r) => {
          const ics = Math.max(0, r.total - r.directs - r.managers);
          const pct = (n: number) => `${(n / max) * 100}%`;
          return (
            <li key={r.org} className="scope-row">
              <p className="scope-org">
                <strong>{r.org}</strong>
                <span>{r.years}</span>
              </p>
              <div className="scope-main">
                <div className="scope-bar" aria-hidden="true">
                  <span data-k="directs" style={{ width: pct(r.directs) }} />
                  <span data-k="managers" style={{ width: pct(r.managers) }} />
                  <span data-k="ics" style={{ width: pct(ics) }} />
                </div>
                <p className="scope-count">
                  <strong>{r.total} people</strong>
                  <span>
                    {r.managers === 0 && ics === 0
                      ? "All direct reports"
                      : `${r.directs} direct${r.directs === 1 ? "" : "s"}${r.managers > 0 ? ` · ${r.managers} managers` : ""}${ics > 0 ? ` · ${ics} ICs` : ""}`}
                  </span>
                  {r.note && <span className="scope-note">{r.note}</span>}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
