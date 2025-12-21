"use client";

import { motion } from "framer-motion";
import { stagger, fadeUp, cardIn, hoverLift } from "@/components/motion";





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
    <motion.a
      variants={cardIn}
      href={href}
      className="..."
      whileHover={hoverLift.hover}
      whileTap={hoverLift.tap}
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

        <p className="mt-3 text-sm leading-relaxed text-neutral-400">
          {desc}
        </p>

        <div className="mt-5 text-xs text-neutral-500">
          {meta}
        </div>
      </div>
    </motion.a>
  );
}

export default function Home() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="pb-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* LEFT: statement */}
        <div className="lg:col-span-5 lg:sticky lg:top-8">
          <motion.div variants={fadeUp} className="max-w-xl">
            <div className="text-xs uppercase tracking-wider text-neutral-500">
              Design Leadership • AI Product Dev • Operations & Systems
            </div>

            <h1 className="mt-4 text-4xl md:text-5xl leading-[1.05] font-medium tracking-tight">
          Designing calm, high-craft enterprise software —
              with a pinch of sense and gobs of rigor.
            </h1>

            <p className="mt-5 text-base leading-relaxed text-neutral-400">
              thinking, experiments, and case studies by Chris Avore
              
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/work"
                className="
                  inline-flex items-center gap-2 rounded-full
                  bg-[rgb(var(--accent)/0.18)] text-[rgb(var(--accent))] border border-[rgb(var(--accent)/0.35)]
                  px-4 py-2 text-sm font-medium
                  hover:opacity-90 transition
                "
              >
                Explore work <span aria-hidden="true">→</span>
              </a>
              <a
                href="/writing"
                className="
                  inline-flex items-center gap-2 rounded-full
                  border border-neutral-800
                  px-4 py-2 text-sm font-medium text-neutral-200
                  hover:border-neutral-700 hover:text-neutral-100 transition
                "
              >
                Read writing <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                ["80+", "Design org scale"],
                ["AI", "Patterns + systems"],
                ["GRC", "Enterprise domain"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-2xl border border-neutral-800/70 bg-neutral-900/30 p-4"
                >
                  <div className="text-lg font-medium">{k}</div>
                  <div className="mt-1 text-xs text-neutral-500">{v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT: cards */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardLink
              href="/work"
              eyebrow="Work"
              title="Case studies & outcomes"
              desc="Portfolio stories with artifacts, decisions, and the measurable impact."
              meta="3–6 minute reads • visuals + prototypes"
            />
            <CardLink
              href="/writing"
              eyebrow="Writing"
              title="Notes, essays, and strategy"
              desc="Systems thinking, AI UX patterns, and leading design orgs at scale."
              meta="Short posts • occasional longform"
            />
            <CardLink
              href="/now"
              eyebrow="Now"
              title="What I’m building"
              desc="Current experiments: motion system, MDX components, and a clean publishing flow."
              meta="Changelog style • WIP"
            />
            <CardLink
              href="/about"
              eyebrow="About"
              title="Bio & principles"
              desc="How I work: clarity, craft, and operational excellence—without losing humanity."
              meta="Leadership • product • systems"
            />
          </div>

          <motion.div variants={fadeUp} className="mt-8">
            <div className="rounded-3xl border border-neutral-800/70 bg-neutral-900/30 p-6 md:p-7">
              <div className="text-sm font-medium">Featured</div>
              <div className="mt-2 text-sm text-neutral-400">
                Next: we’ll wire MDX posts + a Work template so these cards are real content,
                not placeholders.
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {["Motion tokens", "MDX components", "Case-study template", "RSS + SEO"].map(
                  (t) => (
                    <span
                      key={t}
                      className="text-xs rounded-full border border-neutral-800 px-3 py-1 text-neutral-300"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}