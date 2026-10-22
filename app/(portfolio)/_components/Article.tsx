import { MDXRemote } from "next-mdx-remote/rsc";
import { Rail } from "./Rail";
import { articleComponents } from "./articleMdx";
import { tocFromBody } from "@/lib/article";

type Fact = { label: string; value: string };

/**
 * Shared frame for case-study deep dives and essays: a ruled color-field header
 * (kicker, title, standfirst, facts bar), then the body in the reading column.
 */
export function Article({
  tone,
  kicker,
  title,
  standfirst,
  facts,
  back,
  body,
}: {
  tone: "rose" | "green";
  kicker: string;
  title: string;
  standfirst?: string;
  facts: Fact[];
  back: { label: string; href: string };
  body: string;
}) {
  const toc = tocFromBody(body);
  const rail = [{ id: "top", label: title }, ...toc.map((t) => ({ id: t.id, label: t.title }))];

  return (
    <div className="page">
      <Rail items={rail} />

      <header className={`field field-${tone} article-head`} id="top">
        <div className="container">
          <div className="masthead-bar">
            <p className="masthead">
              <a className="masthead-name" href="/">
                Chris Avore
              </a>
            </p>
            <nav className="hero-actions plain" aria-label="Back">
              <a href={back.href}>{back.label}</a>
            </nav>
          </div>

          <div className="case-head">
            <p className="case-kicker">
              <span>{kicker}</span>
            </p>
            <h1>{title}</h1>
            {standfirst && <p className="standfirst">{standfirst}</p>}
            <dl className="case-facts">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <div className="article-body">
        <div className="container article-grid">
          <div className="prose">
            <MDXRemote source={body} options={{ blockJS: false }} components={articleComponents} />
          </div>
        </div>
      </div>
    </div>
  );
}
