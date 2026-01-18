export default function ComingSoonWriting() {
  return (
    <article className="relative mx-auto max-w-2xl px-6 py-24 min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
          Writing
        </div>

        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-100">
          Coming Soon
        </h1>

        <p className="mt-6 text-lg text-neutral-400 max-w-md mx-auto leading-relaxed">
          Notes, essays, and systems thinking — exploring AI UX patterns,
          design leadership, and building at scale.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <a
            href="mailto:chris@avo.re"
            className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--accent)/0.18)] text-[rgb(var(--accent))] border border-[rgb(var(--accent)/0.35)] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
          >
            Get in touch
          </a>
        </div>

        <div className="mt-16 text-xs text-neutral-600">
          Chris Avore · Design Leadership · AI Products
        </div>
      </div>
    </article>
  );
}
