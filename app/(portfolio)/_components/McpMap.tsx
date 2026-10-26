type Group = { name: string; blurb: string; tools: string[] };
export type McpData = {
  eyebrow: string;
  title: string;
  tally: string;
  highlightNote: string;
  highlighted: string[];
  notes?: Record<string, string>;
  groups: Group[];
};

/** The MCP server as a map: tools grouped by the stage of a prototype's life. A real list, not an image. */
export function McpMap({ data }: { data: McpData }) {
  const key = new Set(data.highlighted);
  return (
    <div className="mcp">
      <header className="mcp-head">
        <div>
          <p className="mcp-eyebrow">{data.eyebrow}</p>
          <h4 className="mcp-title">{data.title}</h4>
        </div>
        <p className="mcp-tally">
          <strong>{data.tally}</strong>
          <span>
            <span className="mcp-key">{data.highlightNote.split(" ")[0]}</span>{" "}
            {data.highlightNote.split(" ").slice(1).join(" ")}
          </span>
        </p>
      </header>
      <div className="mcp-grid">
        {data.groups.map((g) => (
          <section className="mcp-group" key={g.name}>
            <h5>
              {g.name}
              <span aria-label={`${g.tools.length} items`}>{g.tools.length}</span>
            </h5>
            <p>{g.blurb}</p>
            <ul>
              {g.tools.map((t) => (
                <li key={t} className={key.has(t) ? "is-key" : undefined}>
                  {t}
                  {data.notes?.[t] && <small> ({data.notes[t]})</small>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
