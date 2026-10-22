import type { ReactNode } from "react";
import { slugifyHeading } from "@/lib/article";

type Props = { children?: ReactNode };

function text(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(text).join("");
  return text((node as { props?: Props }).props?.children);
}

type Metric = { label: string; value: string; note?: string };

export const articleComponents = {
  h2: ({ children }: Props) => <h2 id={slugifyHeading(text(children))}>{children}</h2>,

  MetricTiles: ({ items }: { items: Metric[] }) => (
    <dl className="stats">
      {items.map((m) => (
        <div key={m.label}>
          <dt>{m.label}</dt>
          <dd>{m.value}</dd>
          {m.note && <p>{m.note}</p>}
        </div>
      ))}
    </dl>
  ),

  OutlineSection: ({ title, children }: { title: string; children?: ReactNode }) => (
    <section className="outline">
      <h3>{title}</h3>
      {children}
    </section>
  ),

  Callout: ({ title, children }: { title?: string; children?: ReactNode }) => (
    <aside className="outline">
      {title && <h3>{title}</h3>}
      {children}
    </aside>
  ),

  Disclaimer: ({ children }: Props) => (
    <footer className="disclaimer">
      <strong>Disclaimer</strong>
      {children}
    </footer>
  ),
};
