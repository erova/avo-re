type Group = { name: string; blurb: string; tools: string[] };
export type McpData = {
  intro?: string[];
  notes?: Record<string, string>;
  groups: Group[];
};

/** The MCP server as a map: tools grouped by the stage of a prototype's life. A real list, not an image; the section heading above already names it. */
export function McpMap({ data }: { data: McpData }) {
  return (
    <div className="mcp">
      {data.intro && (
        <div className="mcp-intro">
          {data.intro.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
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
                <li key={t}>
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
