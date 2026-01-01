import Link from "next/link";
import { getAllWritingMeta } from "@/lib/writing";

function Arrow() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="opacity-60 group-hover:opacity-100 transition"
      aria-hidden="true"
    >
      <path
        d="M7 17L17 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10 7H17V14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CardLink({
  href,
  eyebrow,
  title,
  desc,
  meta,
}: {
  href: string;
  eyebrow: string;
  title: string;
  desc: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-neutral-800/70 bg-neutral-950/30 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-neutral-700/80"
    >
      {/* subtle “sheen” */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
        <div className="absolute -inset-24 bg-gradient-to-tr from-white/0 via-white/6 to-white/0 rotate-12" />
      </div>

      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-neutral-500">
              {eyebrow}
            </div>
            <div className="mt-2 text-lg md:text-xl font-medium tracking-tight text-neutral-100">
              {title}
            </div>
          </div>
          <div className="mt-1">
            <Arrow />
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-neutral-400">{desc}</p>

        <div className="mt-5 text-xs text-neutral-500">{meta}</div>
      </div>
    </Link>
  );
}

function parseDate(d?: string) {
  if (!d) return 0;
  const t = Date.parse(d);
  return Number.isFinite(t) ? t : 0;
}

export default function Home() {
  const writing = getAllWritingMeta();
  const latest = [...writing]
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .find((p) => p.title);

  return (
    <article className="relative mx-auto max-w-6xl px-6 py-16">
      <div className="pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* LEFT: statement */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="max-w-xl">
              <div className="text-xs uppercase tracking-wider text-neutral-500">
                Design leadership • AI products • Systems &amp; operations
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl leading-[1.05] font-medium tracking-tight">
                Designing calm, high-craft enterprise software.
              </h1>

              <p className="mt-5 text-base leading-relaxed text-neutral-400">
                Work, writing, and experiments across AI, fintech, GRC, and
                complex enterprise systems by Chris Avore.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--accent)/0.18)] text-[rgb(var(--accent))] border border-[rgb(var(--accent)/0.35)] px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                >
                  Explore work <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/writing"
                  className="inline-flex items-center gap-2 px-1 py-2 text-sm font-medium text-neutral-400 hover:text-neutral-100 transition"
                >
                  Essays &amp; notes <span aria-hidden="true">→</span>
                </Link>
              </div>

              {latest ? (
                <section className="mt-10">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-neutral-500">
                    <span className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-neutral-800/80 to-transparent" />
                    <span>Latest</span>
                    <span className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-neutral-800/80 to-transparent" />
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/writing/${latest.slug}`}
                      className="block text-base md:text-lg font-medium tracking-tight text-neutral-100 hover:text-neutral-50 transition"
                    >
                      {latest.title}
                    </Link>

                    <div className="mt-2 text-sm text-neutral-500">
                      in <span className="italic text-neutral-400">Writing</span>
                      {latest.date ? (
                        <>
                          {" "}| posted <span className="italic text-neutral-400">{latest.date}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </section>
              ) : null}
            </div>
          </div>

          {/* RIGHT: cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardLink
                href="/work"
                eyebrow="Work"
                title="Case studies & outcomes"
                desc="Case studies with decisions, artifacts, and measurable outcomes."
                meta="3–6 minute reads • real work, real experience"
              />
              <CardLink
                href="/writing"
                eyebrow="Writing"
                title="Notes, essays, and book reviews"
                desc="Systems thinking, AI UX patterns, and leading design orgs at scale."
                meta="Short posts • occasional longform"
              />
              <CardLink
                href="/now"
                eyebrow="Now"
                title="What I’m building"
                desc="Current experiments and prototypes — tinkering and iterating in code"
                meta="visuals + prototypes"
              />
              <CardLink
                href="/about"
                eyebrow="About"
                title="Bio & tenets"
                desc="How I work: clarity, craft, and operational excellence — the principles behind the decisions."
                meta="Resume • Principles • Liftoff!"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}