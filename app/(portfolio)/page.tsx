import {
  getCases,
  getEarlier,
  getQuotes,
  formatMonthYear,
  readPortfolio,
  splitSections,
  type Case,
} from "@/lib/portfolio";
import { getAllWritingMeta } from "@/lib/writing";
import { Rail } from "./_components/Rail";
import { GatedStage } from "./_components/GatedStage";
import { Placeholder } from "./_components/Placeholder";
import { ShowcaseTabs } from "./_components/ShowcaseTabs";
import { McpMap, type McpData } from "./_components/McpMap";
import { AtlasView, type AtlasData } from "./_components/AtlasFigures";
import { VideoFacade } from "./_components/VideoFacade";
import { Md, MdInline, Emph } from "./_components/Md";

// Posts that exist at /writing but stay off the home page.
const HIDDEN_ESSAYS = new Set(["hello-avo"]);

type Link = { label: string; href: string };
type Img = { src: string; width: number; height: number; alt: string };

function CaseHead({ c, n, total }: { c: Case; n: number; total: number }) {
  const num = String(n).padStart(2, "0");
  return (
    <header className="case-head">
      <p className="case-kicker">
        <span>Case study</span>
        <span>
          {num} / {String(total).padStart(2, "0")}
        </span>
      </p>
      <h3 id={`case-${c.slug}-h`}>{c.title}</h3>
      <dl className="case-facts">
        <div>
          <dt>Organization</dt>
          <dd>{c.company}</dd>
        </div>
        <div>
          <dt>Years</dt>
          <dd>{c.years}</dd>
        </div>
        {c.tags.length > 0 && (
          <div>
            <dt>Focus</dt>
            <dd>{c.tags.join(" · ")}</dd>
          </div>
        )}
      </dl>
    </header>
  );
}

function CaseRows({ c }: { c: Case }) {
  return (
    <div className="case-rows">
      <section className="case-row">
        <h4>The situation</h4>
        <div>
          <p>{c.situation}</p>
        </div>
      </section>
      <section className="case-row">
        <h4>My role</h4>
        <div>
          <p>{c.did}</p>
        </div>
      </section>
      <section className="case-row">
        <h4>What changed</h4>
        <div>
          <ul>
            {c.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
      </section>
      {c.asking && (
        <section className="case-row">
          <h4>Open questions</h4>
          <div>
            <p className="case-asking">{c.asking}</p>
          </div>
        </section>
      )}
      {(c.link || c.deepDive) && (
        <section className="case-row case-links">
          <h4>Go further</h4>
          <div>
            {c.link && (
              <p>
                <a href={c.link}>{c.linkLabel ?? c.link}</a>
              </p>
            )}
            {c.deepDive && (
              <p>
                <a href={`/work/${c.slug}`}>Read the full case</a>
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

const img = ({ src, width, height, alt }: Img) => ({ src, width, height, alt });

function Showcase({ c, mcp, atlas }: { c: Case; mcp: McpData; atlas: AtlasData }) {
  if (!c.showcase) return null;
  const tabs = c.showcase.tabs.map((t) => ({
    id: t.id,
    label: t.label,
    content: t.main ? (
      <div className="stage">
        <div className="stage-main pane" style={{ aspectRatio: `${t.main.width} / ${t.main.height}` }}>
          <img {...img(t.main)} decoding="async" />
          {t.main.caption && <span className="pane-label">{t.main.caption}</span>}
        </div>
        {(t.panels ?? []).map((p, i) => (
          <div
            key={p.src}
            className={`panel pane panel-${i === 0 ? "a" : "b"}`}
            style={{ aspectRatio: `${p.width} / ${p.height}` }}
          >
            <img {...img(p)} decoding="async" loading="lazy" />
            {p.caption && <span className="pane-label">{p.caption}</span>}
          </div>
        ))}
      </div>
    ) : t.view?.startsWith("atlas-") ? (
      <AtlasView view={t.view} data={atlas} />
    ) : (
      <McpMap data={mcp} />
    ),
  }));
  return <ShowcaseTabs label={c.showcase.label} tabs={tabs} />;
}

export default function Home() {
  const cases = getCases();
  const quotes = getQuotes();
  const essays = getAllWritingMeta().filter((e) => !HIDDEN_ESSAYS.has(e.slug));

  const latest = essays[0];

  const titles = readPortfolio<Record<string, string>>("sections").data;
  const hero = readPortfolio<{
    name: string;
    descriptor?: string;
    positioning: string;
    links: Link[];
    portrait: Img;
  }>("hero");
  const glance = splitSections(readPortfolio("glance").body);
  const earlier = getEarlier();
  const lead = readPortfolio<{ footnote?: string }>("lead");
  const principles = splitSections(lead.body);
  const people = readPortfolio<{ title: string }>("people");
  const wrong = readPortfolio<{ title: string }>("wrong");
  const speaking = readPortfolio<{
    photo: Img & { srcSet: string; credit: string };
    card: { lede: string; linkLabel: string; linkHref: string };
    videos: { id: string; title: string; heading: string; caption: string }[];
  }>("speaking");
  const talks = readPortfolio<{ title: string }>("talks");
  const pubs = readPortfolio<{ title: string; cover: Img }>("publications");
  const gate = readPortfolio<{
    note: string;
    request: string;
    requestHref: string;
    label: string;
    button: string;
    error: string;
  }>("gate");
  const contact = readPortfolio<{ links: Link[] }>("contact");
  const mcp = readPortfolio<McpData>("mcp-map").data;
  const atlas = readPortfolio<AtlasData>("atlas-figures").data;

  const rail = [
    { id: "top", label: hero.data.name },
    { id: "glance", label: titles.glance },
    { id: "work", label: titles.work },
    ...cases.map((c) => ({ id: `case-${c.slug}`, label: c.rail })),
    { id: "earlier", label: titles.earlier },
    { id: "lead", label: titles.lead },
    { id: "writing", label: titles.writing },
    { id: "contact", label: titles.contact },
  ];

  return (
    <div className="page">
      <Rail items={rail} />

      <header className="field field-green hero" id="top">
        <div className="hero-portrait rise" style={{ "--i": 4 } as React.CSSProperties}>
          <div className="hero-slab" aria-hidden="true" />
          <img {...hero.data.portrait} fetchPriority="high" />
        </div>
        <div className="container hero-inner">
          <div className="masthead-bar rise" style={{ "--i": 0 } as React.CSSProperties}>
            <p className="masthead">
              <span className="masthead-name">{hero.data.name}</span>
              {hero.data.descriptor && (
                <>
                  <span className="masthead-pipe" aria-hidden="true">
                    |
                  </span>
                  <span className="masthead-desc">{hero.data.descriptor}</span>
                </>
              )}
            </p>
            <nav className="hero-actions" aria-label="Résumé and contact">
              {hero.data.links.map((l) => (
                <a key={l.href} href={l.href}>
                  {l.label}
                </a>
              ))}
            </nav>
            {latest && (
              <p className="latest">
                <span className="latest-kicker">Latest writing</span>
                <a href={`/writing/${latest.slug}`}>{latest.title}</a>
                <span className="latest-date">{formatMonthYear(latest.date)}</span>
              </p>
            )}
          </div>
          <h1 className="rise" style={{ "--i": 1 } as React.CSSProperties}>
            <Emph text={hero.data.positioning} />
          </h1>
          <div className="hero-lower">
            <div className="hero-now rise" style={{ "--i": 2 } as React.CSSProperties}>
              <Md source={hero.body} />
            </div>
          </div>
        </div>
      </header>

      <div className="page-main">
        <section className="section" id="glance" aria-labelledby="glance-h">
          <h2 id="glance-h">{titles.glance}</h2>
          <dl className="glance">
            {glance.map((g) => (
              <div className="glance-row" key={g.title}>
                <dt>{g.title}</dt>
                <dd>
                  <MdInline source={g.body} />
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="work" aria-labelledby="work-h">
          <div className="container work-head">
            <h2 id="work-h">{titles.work}</h2>
          </div>

          {cases.map((c, i) => (
            <article
              className="field field-rose feature"
              key={c.slug}
              id={`case-${c.slug}`}
              aria-labelledby={`case-${c.slug}-h`}
              style={{ "--step": i } as React.CSSProperties}
            >
              <div className="container">
                <CaseHead c={c} n={i + 1} total={cases.length} />
                {c.stage ? (
                  <GatedStage main={c.stage.main} panels={c.stage.panels} gate={gate.data} />
                ) : c.showcase ? (
                  <Showcase c={c} mcp={mcp} atlas={atlas} />
                ) : (
                  <Placeholder label={c.media} />
                )}
                <CaseRows c={c} />
              </div>
            </article>
          ))}
        </section>

        {quotes.length > 0 && (
          <section className="section" aria-labelledby="others">
            <h2 id="others">{titles.others}</h2>
            {quotes.map((q) => (
              <figure className="quote" key={q.name}>
                <blockquote>
                  <p>{q.quote}</p>
                </blockquote>
                <figcaption>
                  {q.name}, {q.title}. {q.relationship}
                </figcaption>
              </figure>
            ))}
          </section>
        )}

        <section className="section" id="earlier" aria-labelledby="earlier-h">
          <h2 id="earlier-h">{titles.earlier}</h2>
          <div className="rows">
            {earlier.map((job) => (
              <details key={job.title}>
                <summary>{job.title}</summary>
                <Md source={job.body} />
              </details>
            ))}
          </div>
        </section>

        <section className="section" id="lead" aria-labelledby="lead-h">
          <h2 id="lead-h">{titles.lead}</h2>
          <div className="columns">
            {principles.map((p) => (
              <div key={p.title}>
                <h3>{p.title}</h3>
                <Md source={p.body} />
              </div>
            ))}
          </div>
          {lead.data.footnote && <p className="footnote">{lead.data.footnote}</p>}

          <h3 className="sub">{people.data.title}</h3>
          <Md source={people.body} />

          <h3 className="sub">{wrong.data.title}</h3>
          <Md source={wrong.body} />
        </section>

        <section id="writing" aria-labelledby="writing-h">
          <div className="field field-green speaking">
            <div className="container">
              <h2 id="writing-h">{titles.writing}</h2>

              <div className="speaking-stage">
                <figure className="speaking-figure">
                  <img
                    className="speaking-photo"
                    src={speaking.data.photo.src}
                    srcSet={speaking.data.photo.srcSet}
                    sizes="(min-width: 1200px) 1120px, 100vw"
                    width={speaking.data.photo.width}
                    height={speaking.data.photo.height}
                    alt={speaking.data.photo.alt}
                    decoding="async"
                  />
                  <figcaption>{speaking.data.photo.credit}</figcaption>
                </figure>

                <div className="panel panel-card speaking-info">
                  <p className="panel-lede">{speaking.data.card.lede}</p>
                  <p>
                    <a href={speaking.data.card.linkHref}>{speaking.data.card.linkLabel}</a>
                  </p>
                </div>

                {speaking.data.videos.map((v, i) => (
                  <div className={`panel speaking-video speaking-video-${i + 1}`} key={v.id}>
                    <VideoFacade {...v} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="section writing-body">
            <Md source={speaking.body} />

            {essays.length > 0 && (
              <>
                <h3 className="sub">{titles.essays}</h3>
                <ul className="list">
                  {essays.map((e) => (
                    <li key={e.slug}>
                      <a href={`/writing/${e.slug}`}>{e.title}</a>
                      <span className="item-date">{formatMonthYear(e.date)}</span>
                      {e.summary && <p>{e.summary}</p>}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h3 className="sub">{talks.data.title}</h3>
            <Md className="md-list" source={talks.body} />

            <h3 className="sub">
              <Emph text={pubs.data.title} />
            </h3>
            <img className="book-cover" {...pubs.data.cover} decoding="async" />
            <Md source={pubs.body} />
          </div>
        </section>

        <section className="section" id="contact" aria-labelledby="contact-h">
          <h2 id="contact-h">{titles.contact}</h2>
          <p className="actions">
            {contact.data.links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </p>
          <Md className="md-contact" source={contact.body} />
        </section>
      </div>
    </div>
  );
}
