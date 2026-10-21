import { getCases, getQuotes, formatMonthYear } from "@/lib/portfolio";
import { getAllWritingMeta } from "@/lib/writing";
import { Rail } from "./_components/Rail";
import { Placeholder } from "./_components/Placeholder";
import { VideoFacade } from "./_components/VideoFacade";

const EMAIL = "avore@erova.com";
const LINKEDIN = "https://www.linkedin.com/in/chrisavore/";
// Brief wants /resume.pdf (step 7). Until it exists, point at the existing résumé page.
const RESUME = "/about/resume";
// Posts that exist at /writing but stay off the home page.
const HIDDEN_ESSAYS = new Set(["hello-avo"]);

export default function Home() {
  const cases = getCases().filter((c) => c.title);
  const quotes = getQuotes();
  const essays = getAllWritingMeta().filter((e) => !HIDDEN_ESSAYS.has(e.slug));

  const rail = [
    { id: "top", label: "Chris Avore" },
    { id: "glance", label: "At a glance" },
    { id: "work", label: "Selected work" },
    ...cases.map((c) => ({ id: `case-${c.slug}`, label: c.rail })),
    { id: "earlier", label: "Earlier work" },
    { id: "lead", label: "How I lead" },
    { id: "writing", label: "Writing & speaking" },
    { id: "contact", label: "Contact" },
  ];
  const [feature, ...rest] = cases;


  return (
    <div className="page">
      <Rail items={rail} />

      <header className="field field-green hero" id="top">
        <div className="hero-portrait rise" style={{ "--i": 4 } as React.CSSProperties}>
          <div className="hero-slab" aria-hidden="true" />
          <img
            src="/images/portrait/chris-cutout.webp"
            width={475}
            height={937}
            alt="Chris Avore, smiling, arms crossed, in a navy t-shirt."
            fetchPriority="high"
          />
        </div>
        <div className="container hero-inner">
          <p className="masthead rise" style={{ "--i": 0 } as React.CSSProperties}>
            Chris Avore
          </p>
          <h1 className="rise" style={{ "--i": 1 } as React.CSSProperties}>
            Design leadership for <em>products</em> that can&rsquo;t afford to be wrong.
          </h1>
          <div className="hero-lower">
            <p className="hero-now rise" style={{ "--i": 2 } as React.CSSProperties}>
              I lead design at Diligent, turning a governance, risk, and compliance portfolio
              used by most of the Fortune 1000 into an AI-first one. I still prototype in code.
              Before Diligent: Northwestern Mutual, Meta, and Nasdaq.
            </p>
            <p className="actions rise" style={{ "--i": 3 } as React.CSSProperties}>
              <a href={RESUME}>Download résumé (PDF)</a>
              <a href={LINKEDIN}>LinkedIn</a>
              <a href={`mailto:${EMAIL}`}>Email</a>
            </p>
          </div>
        </div>
      </header>

      <div className="page-main">
        <section className="section" id="glance" aria-labelledby="glance-h">
            <h2 id="glance-h">At a glance</h2>
            <dl className="glance">
              <dt>Diligent, 2024–</dt>
              <dd>
                VP &amp; Head of Design. [DECIDE: canonical team size] across 4 business units and
                5 countries; 5 directors.
              </dd>
              <dt>Northwestern Mutual, 2021–24</dt>
              <dd>VP &amp; Head of Design. Scaled the org from 60 to 120+.</dd>
              <dt>Meta, 2020–21</dt>
              <dd>Product Design Manager, recruiting platforms.</dd>
              <dt>Nasdaq, 2011–18</dt>
              <dd>Built the UX team from 1 to 35. 32 patents.</dd>
              <dt>Author</dt>
              <dd>
                <em>Liftoff! Practical Design Leadership</em> (Rosenfeld Media, with Russ Unger).
              </dd>
              <dt>Founder</dt>
              <dd>VibeSharing, a home for AI-generated prototypes.</dd>
              <dt>Research, accessibility, content</dt>
              <dd>
                [DECIDE: one concrete line each. A research practice I set up, a WCAG standard
                adopted across N products, a content design hire or guideline.]
              </dd>
            </dl>
        </section>

        <section id="work" aria-labelledby="work-h">
          <div className="container work-head">
            <h2 id="work-h">Selected work</h2>
          </div>

          {feature && (
            <article
              className="field field-rose feature"
              id={`case-${feature.slug}`}
              aria-labelledby={`case-${feature.slug}-h`}
            >
              <div className="container">
                <h3 id={`case-${feature.slug}-h`}>{feature.title}</h3>
                <p className="case-meta">
                  {feature.company}, {feature.years}
                </p>

                <div className="stage" data-stage>
                  <img
                    className="stage-main"
                    src="/work/agentic-vision/frame.webp"
                    width={2208}
                    height={1380}
                    alt="The prototype's home screen in a calm state. The headline reads 'Everything looks good right now', with a prompt box and recent activity below."
                    decoding="async"
                  />
                  <img
                    className="panel panel-prompt"
                    src="/work/agentic-vision/prompt.webp"
                    width={1720}
                    height={410}
                    alt="A prompt panel that has already framed the question: 'What should we review about INC-2847?', with suggested next steps."
                    decoding="async"
                  />
                  <img
                    className="panel panel-incident"
                    src="/work/agentic-vision/incident.webp"
                    width={1720}
                    height={480}
                    alt="An active security incident card marked high urgency. An agent has completed 5 of 8 response steps, with Assign and Review actions."
                    decoding="async"
                  />
                </div>

                <div className="feature-body">
                  <div>
                    <h4>The situation</h4>
                    <p>{feature.situation}</p>
                    <h4>What I did</h4>
                    <p>{feature.did}</p>
                  </div>
                  <div>
                    <h4>What changed</h4>
                    <ul>
                      {feature.outcomes.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                    {feature.asking && (
                      <>
                        <h4>What I&rsquo;m still asking</h4>
                        <p>{feature.asking}</p>
                      </>
                    )}
                    {feature.deepDive && (
                      <p>
                        <a href={`/work/${feature.slug}`}>Read the full case</a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )}

          <div className="container">
            {rest.map((c) => (
              <article className="case" key={c.slug} id={`case-${c.slug}`} aria-labelledby={`case-${c.slug}-h`}>
                <h3 id={`case-${c.slug}-h`}>{c.title}</h3>
                <p className="case-meta">
                  {c.company}, {c.years}
                </p>

                <h4>The situation</h4>
                <p>{c.situation}</p>

                <h4>What I did</h4>
                <p>{c.did}</p>

                <h4>What changed</h4>
                <ul>
                  {c.outcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>

                {c.asking && (
                  <>
                    <h4>What I&rsquo;m still asking</h4>
                    <p>{c.asking}</p>
                  </>
                )}

                <Placeholder label={c.media} />

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
              </article>
            ))}
          </div>
        </section>

        {quotes.length > 0 && (
          <section className="section" aria-labelledby="others">
            <h2 id="others">What others say</h2>
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
          <h2 id="earlier-h">Earlier work</h2>
          <div className="rows">
            <details>
              <summary>Northwestern Mutual, 2021–24</summary>
              <p>
                Took over a 120-person org with 36% annual attrition and low partner confidence.
                Rebuilt the operating model, leadership bench, and design KPIs. Attrition fell to
                [DECIDE: 3 people or a %]; engagement survey participation +44%, strategic clarity
                +46%.
              </p>
              <p>
                Programs my org partnered on: the Planning Experience reached 90% advisor adoption
                and 30,000+ plans in its first 90 days; accelerated underwriting cut issuance from
                four weeks to three days (MIT Sloan Management Review, March 2023); the mobile
                redesign grew MAU 20.3% YoY.
              </p>
              <p>
                <a href="/work/nm-mobile">Balancing vision and delivery in a flagship mobile redesign</a>
                <br />
                <a href="/work/nm-blueprint">Field Experience Blueprint</a>
              </p>
            </details>
            <details>
              <summary>Meta, 2020–21</summary>
              <p>
                Led design on a 0-to-1 recruiting effort: recruiters were sharing candidate PDFs
                in open Workplace groups. A structured, native sharing flow cut posts with file
                attachments from 23.9% to 4.2% in 30 days, without hurting sourcing or hiring
                metrics.
              </p>
            </details>
            <details>
              <summary>InVision, 2018–19</summary>
              <p>
                Co-authored <em>The New Design Frontier</em>, InVision&rsquo;s study of design
                maturity across thousands of companies, and co-developed the Design Maturity Model
                that came out of it. Ran executive workshops for Netflix, American Express, and
                Boeing.
              </p>
            </details>
            <details>
              <summary>Nasdaq, 2011–18</summary>
              <p>
                Built the UX team from 1 to 35, leading experience design for governance,
                compliance, and trading platforms behind 27%+ of company revenue. Credited on 32
                patents.
              </p>
            </details>
            <details>
              <summary>Before 2011</summary>
              <p>
                Independent consultant for Merck, FINRA, National Geographic, the National Park
                Service, and the Department of Defense.
              </p>
            </details>
          </div>
        </section>

        <section className="section" id="lead" aria-labelledby="lead-h">
          <h2 id="lead-h">How I lead</h2>
          <div className="columns">
            <div>
              <h3>Clarity</h3>
              <p>
                Saying what good looks like, and what it doesn&rsquo;t. Being direct about what
                design can and can&rsquo;t do. When strategic clarity isn&rsquo;t there, building
                it for the team instead of waiting for it.
              </p>
            </div>
            <div>
              <h3>Consistency</h3>
              <p>
                Being the same leader on good days and bad.* Not moving the goalposts on quality.
                Building the same kind of partnership with everyone, not just the people I click
                with.
              </p>
            </div>
            <div>
              <h3>Curiosity</h3>
              <p>
                Asking how something came to be before reacting to it. Changing my mind when the
                evidence warrants. Asking more questions than I answer.
              </p>
            </div>
          </div>
          <p className="footnote">*or try to</p>

          <h3 className="sub">People I&rsquo;ve grown</h3>
          <p>
            The part of the job I&rsquo;m proudest of is the people. At Diligent I started a
            manager apprenticeship program so we could grow leaders from inside, and the Boards
            team went from one designer to a bench of two directors, two senior managers, and an
            apprentice manager. At Northwestern Mutual, attrition fell from 36% to three departures
            in a year as we rebuilt career paths. [DECIDE: names and permission. People I&rsquo;ve
            managed now lead design at [company], [company], and [company].]
          </p>

          <h3 className="sub">One thing I got wrong</h3>
          <p>[DECIDE: pick the story. What I believed, what happened, what I do differently now.]</p>
        </section>

        <section id="writing" aria-labelledby="writing-h">
          <div className="field field-green speaking">
            <div className="container">
              <h2 id="writing-h">Writing &amp; speaking</h2>

              <div className="speaking-stage">
                <figure className="speaking-figure">
                  <img
                    className="speaking-photo"
                    src="/images/speaking/dls-stage-2400.webp"
                    srcSet="/images/speaking/dls-stage-1200.webp 1200w, /images/speaking/dls-stage-2400.webp 2400w"
                    sizes="(min-width: 1200px) 1120px, 100vw"
                    width={2400}
                    height={1597}
                    alt="Chris Avore speaking on a stage lit in magenta and blue, in a blue sweater and jeans, standing behind oversized concrete letters, with a laptop on a table to his right."
                    decoding="async"
                  />
                  <figcaption>[DECIDE: photographer credit and event]</figcaption>
                </figure>

                <div className="panel panel-card speaking-info">
                  <p className="panel-lede">Speaking since 2010: 24+ conferences in 10 countries.</p>
                  <p>
                    <a href="https://erova.com/public-speaking">Book a talk</a>
                  </p>
                </div>

                <div className="panel speaking-video">
                  <VideoFacade
                    id="pqI1OIaHbVg"
                    title="AI, Anxiety, and Actual Impact"
                    heading="Watch the talk"
                    caption="Design Leadership Summit, Toronto, 2025"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="section writing-body">
          <p>
            <strong>AI, Anxiety, and Actual Impact: Leading Design Teams Through the AI Era.</strong>{" "}
            Most recent delivery: Design Leadership Summit, Budapest, October 2026.
          </p>
          <p>[DECIDE: two-sentence abstract, and slides if available.]</p>

          {essays.length > 0 && (
            <>
              <h3 className="sub">Essays</h3>
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

          <h3 className="sub">Earlier talks</h3>
          <ul className="list">
            <li>
              <strong>UX Lisbon 2023.</strong> Redesigning the design org you inherit: revisiting
              the structures, roles, and rituals of an existing team so people can grow and do
              their best work.
            </li>
            <li>
              <strong>Design Success in Turbulent, Ambiguous Spaces</strong> [DECIDE: venue and
              year]. Practices leaders can use with business, product, and engineering partners
              when nothing is predictable.
            </li>
            <li>
              IA Conference, Interaction, Leading Design Festival London, Design Leadership Summit
              Toronto, IxDA South America, UXDX, Confab, MX, UX Week.
            </li>
          </ul>

          <h3 className="sub">
            <em>Liftoff!</em> and other publications
          </h3>
          <img
            className="book-cover"
            src="/images/speaking/liftoff-cover.webp"
            width={683}
            height={1024}
            alt="Cover of Liftoff! Practical Design Leadership to Elevate Your Team, Your Organization, and You, by Chris Avore and Russ Unger. A graphic coffee mug with a black number 1 on pink and light blue panels."
            decoding="async"
          />
          <p>
            <em>Liftoff! Practical Design Leadership to Elevate Your Team, Your Organization, and
            You</em>, with Russ Unger (Rosenfeld Media, July 2020), foreword by Kim Goodwin. A practical guide for new and
            experienced design managers: hiring and scaling teams, developing careers, why
            diversity matters to the business, and establishing design&rsquo;s place in the
            organization. It includes a step-by-step design charter workshop (Chapter 8) and ways
            to bring executives into common UX activities to build influence (Chapter 15).
          </p>
          <p>
            [DECIDE: Jesse James Garrett blurb text; verify any other endorsements against the
            printed book.]
          </p>
          <p>
            <a href="https://rosenfeldmedia.com/books/liftoff/">Rosenfeld Media book page</a>
            <br />[DECIDE: Rosenfeld podcast episode link]
          </p>
          <p>
            Also: <em>The New Design Frontier</em> (InVision, co-author); a case study chapter on
            Nasdaq IR Mobile in <em>Successful User Experience: Strategies and Roadmaps</em>{" "}
            (Morgan Kaufmann).
          </p>
          </div>
        </section>

        <section className="section" id="contact" aria-labelledby="contact-h">
          <h2 id="contact-h">Contact</h2>
          <p className="actions">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={LINKEDIN}>LinkedIn</a>
            <a href={RESUME}>Résumé</a>
          </p>
          <p>Based near the Jersey Shore, a ferry ride from Manhattan.</p>
          <p className="elsewhere">
            Elsewhere: <a href="/now">Scratchpad</a> of prototypes and experiments,{" "}
            <a href="/writing">all writing</a>, <a href="https://erova.com">erova.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
