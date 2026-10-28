type Pt = { label: string; value: number };
export type AtlasData = {
  source: string;
  usage: {
    title: string;
    lede: string;
    note: string;
    points: Pt[];
    stats: { value: string; label: string }[];
  };
  layers: {
    title: string;
    lede: string;
    from: { heading: string; items: string[] };
    core: {
      heading: string;
      name: string;
      items: { name: string; note?: string }[];
      served: string;
      servedMore?: string;
    };
    to: { heading: string; items: { name: string; note?: string; next?: boolean }[] };
    legendLive: string;
    legendNext: string;
  };
  adoption: {
    title: string;
    lede: string;
    legend: { lens: string; ld: string; legacy: string; none: string };
    units: { name: string; counts: [number, number, number, number] }[];
    totalLabel: string;
    totalNote?: string;
    caption?: string;
  };
};

const fmt = new Intl.NumberFormat("en-US");

function Head({ title, lede, id }: { title: string; lede: string; id: string }) {
  return (
    <>
      <h4 className="afig-title" id={id}>
        {title}
      </h4>
      <p className="afig-lede">{lede}</p>
    </>
  );
}

function Usage({ d, source }: { d: AtlasData["usage"]; source: string }) {
  const W = 600;
  const H = 300;
  const base = 250;
  const top = 30;
  const max = Math.max(...d.points.map((p) => p.value));
  const xs = d.points.map((_, i) => 40 + (i * 520) / (d.points.length - 1));
  const ys = d.points.map((p) => base - (p.value / max) * (base - top));
  const last = d.points.length - 1;
  const aria = `Line chart. Calls per working day: ${d.points.map((p) => `${p.label}, ${p.value}`).join(". ")}.`;
  return (
    <figure className="mcp afig" aria-labelledby="atlas-usage-h">
      <Head title={d.title} lede={d.lede} id="atlas-usage-h" />
      <div className="usage">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={aria}>
          <line className="usage-base" x1="20" y1={base} x2="590" y2={base} />
          <polyline className="usage-line" pathLength={1} points={xs.map((x, i) => `${x},${ys[i]}`).join(" ")} />
          {d.points.map((p, i) => (
            <circle key={p.label} style={{ "--i": i } as React.CSSProperties} className={i === last ? "usage-dot is-last" : "usage-dot"} cx={xs[i]} cy={ys[i]} r={i === last ? 6 : 5} />
          ))}
          {d.points.map((p, i) => (
            <text
              key={`v${p.label}`}
              style={{ "--i": i } as React.CSSProperties}
              className="usage-val"
              x={i === last ? xs[i] - 20 : xs[i]}
              y={i === last ? ys[i] + 5 : ys[i] - 17}
              textAnchor={i === last ? "end" : "middle"}
            >
              {p.value}
            </text>
          ))}
          <text className="usage-note" x="300" y="80" textAnchor="end">
            {d.note}
          </text>
          {d.points.map((p, i) => (
            <text key={`a${p.label}`} className="usage-axis" x={xs[i]} y="276" textAnchor="middle">
              {p.label}
            </text>
          ))}
        </svg>
        <div className="side-stats">
          {d.stats.map((s) => (
            <div key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <figcaption>{source}</figcaption>
    </figure>
  );
}

function Layers({ d, source }: { d: AtlasData["layers"]; source: string }) {
  return (
    <figure className="mcp afig" aria-labelledby="atlas-layers-h">
      <Head title={d.title} lede={d.lede} id="atlas-layers-h" />
      <div className="layers">
        <div className="layer-col">
          <h5>{d.from.heading}</h5>
          <ul>
            {d.from.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
        <div className="layer-col flow">
          <div className="atlas-core">
            <h5>{d.core.heading}</h5>
            <p className="atlas-name">{d.core.name}</p>
            <ul>
              {d.core.items.map((i) => (
                <li key={i.name}>
                  {i.name}
                  {i.note && <small>{i.note}</small>}
                </li>
              ))}
            </ul>
            <p className="served">
              {d.core.served}
              {d.core.servedMore && <span> {d.core.servedMore}</span>}
            </p>
          </div>
        </div>
        <div className="layer-col">
          <h5>{d.to.heading}</h5>
          <ul>
            {d.to.items.map((i) => (
              <li key={i.name} className={i.next ? "next" : undefined}>
                {i.name}
                {i.note && <small>{i.note}</small>}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="afig-legend">
        <span>
          <i /> {d.legendLive}
        </span>
        <span>
          <i className="dash" /> {d.legendNext}
        </span>
      </p>
      <figcaption>{source}</figcaption>
    </figure>
  );
}

const SEGS = ["lens", "ld", "legacy", "none"] as const;

function Adoption({ d, source }: { d: AtlasData["adoption"]; source: string }) {
  const totals = d.units.map((u) => u.counts.reduce((a, b) => a + b, 0));
  const max = Math.max(...totals);
  const all = totals.reduce((a, b) => a + b, 0);
  const current = d.units.reduce((a, u) => a + u.counts[0] + u.counts[1], 0);
  const names = {
    lens: d.legend.lens,
    ld: d.legend.ld,
    legacy: d.legend.legacy,
    none: d.legend.none,
  };
  return (
    <figure className="mcp afig" aria-labelledby="atlas-adoption-h">
      <Head title={d.title} lede={d.lede} id="atlas-adoption-h" />
      <p className="afig-legend bars-legend" aria-hidden="true">
        {SEGS.map((s) => (
          <span key={s}>
            <i className={`k-${s}`} /> {names[s]}
          </span>
        ))}
      </p>
      <div className="bars">
        {d.units.map((u, n) => (
          <div className="bar-row" key={u.name}>
            <div className="bar-label">
              {u.name}
              <small>
                {totals[n]} {totals[n] === 1 ? "product" : "products"}
              </small>
            </div>
            <div
              className="track"
              style={{ width: `${(totals[n] / max) * 100}%` }}
              role="img"
              aria-label={`${u.name}: ${SEGS.map((s, i) => `${u.counts[i]} ${names[s]}`).filter((_, i) => u.counts[i] > 0).join(", ")}`}
            >
              {SEGS.map((s, i) =>
                u.counts[i] > 0 ? (
                  <div key={s} className={`seg s-${s}`} style={{ flex: u.counts[i] }}>
                    {u.counts[i]}
                  </div>
                ) : null,
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="afig-total">
        <b>
          {fmt.format(current)} of {fmt.format(all)}
        </b>{" "}
        {d.totalLabel} {d.totalNote}
      </p>
      <figcaption>
        {source}
        {d.caption ? ` ${d.caption}` : ""}
      </figcaption>
    </figure>
  );
}

export function AtlasView({ view, data }: { view: string; data: AtlasData }) {
  if (view === "atlas-usage") return <Usage d={data.usage} source={data.source} />;
  if (view === "atlas-layers") return <Layers d={data.layers} source={data.source} />;
  if (view === "atlas-adoption") return <Adoption d={data.adoption} source={data.source} />;
  return null;
}
