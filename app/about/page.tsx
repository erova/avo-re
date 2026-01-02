import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="rounded-2xl border border-neutral-800/60 bg-neutral-950/40 p-8 shadow-sm">
        <p className="text-sm text-neutral-400">About</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Chris Avore</h1>
        <p className="mt-3 max-w-2xl text-neutral-300">
          Executive product design leader building modern, AI-native enterprise experiences.
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-neutral-800/60 bg-neutral-950/20 p-8">
        <div className="prose prose-invert prose-neutral max-w-none prose-headings:tracking-tight prose-p:leading-relaxed">
          <p>
            I lead large, global design organizations—integrating product design, research, content,
            accessibility, and design systems into enterprise strategy—and build high-performing
            leadership teams that embed design into business priorities and deliver measurable product
            impact.
          </p>
          <p>
            I’m especially focused on agentic AI patterns, design systems as a delivery engine, and
            building operating models where design is a multiplier—faster execution, higher quality,
            and clearer narrative with executives and customers.
          </p>
          <p>
            Outside of the day job, I publish experiments and writing at avo.re, and I co-authored
            <em> Liftoff!</em> (Rosenfeld Media) on design leadership and inclusive teams.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-neutral-500">
          <span className="h-px flex-1 bg-neutral-800" />
          <span>More</span>
          <span className="h-px flex-1 bg-neutral-800" />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              href: "/about/tenets",
              title: "Tenets",
              desc: "Principles and tenets that guide my work.",
            },
            {
              href: "/about/resume",
              title: "Resume",
              desc: "Executive product design leadership.",
            },
            { href: "/about/book", title: "My book", desc: "Liftoff! + resources." },
            {
              href: "https://erova.com",
              title: "erova.com",
              desc: "My evergreen design leadership portfolio site.",
            },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-2xl border border-neutral-800/60 bg-neutral-950/30 p-6 transition hover:-translate-y-0.5 hover:border-neutral-700 hover:bg-neutral-950/40"
            >
              <h2 className="text-lg font-semibold tracking-tight text-neutral-100">{c.title}</h2>
              <p className="mt-2 text-sm text-neutral-300">{c.desc}</p>
              <p className="mt-4 text-sm text-neutral-400">View →</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}