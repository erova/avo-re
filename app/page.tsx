export default function ComingSoon() {
  return (
    <article className="relative mx-auto max-w-2xl px-6 py-24 min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
          avo.re
        </div>

        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-100">
          Coming Soon
        </h1>

        <p className="mt-6 text-lg text-neutral-400 max-w-md mx-auto leading-relaxed">
          A new portfolio experience is in the works — work, writing, and
          experiments in design leadership and AI products.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <a
            href="mailto:chris@avo.re"
            className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--accent)/0.18)] text-[rgb(var(--accent))] border border-[rgb(var(--accent)/0.35)] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
          >
            Get in touch
          </a>
          <a
            href="https://www.linkedin.com/in/chrisavore/"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-neutral-500 hover:text-neutral-300 transition"
          >
            LinkedIn
          </a>
        </div>

        <div className="mt-16 text-xs text-neutral-600">
          Chris Avore · Design Leadership · AI Products
        </div>
      </div>
    </article>
  );
}
