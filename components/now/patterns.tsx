import Link from "next/link";

export function PrimaryCta({
  href,
  children,
  subtext,
}: {
  href: string;
  children: React.ReactNode;
  subtext?: string;
}) {
  return (
    <div className="mt-6">
      <Link
        href={href}
        className="
          inline-flex items-center gap-2 rounded-xl
          bg-[rgb(var(--accent))] px-4 py-2
          text-sm font-medium text-black
          shadow-sm transition-opacity hover:opacity-90
        "
      >
        {children} <span aria-hidden>→</span>
      </Link>

      {subtext ? (
        <div className="mt-2 text-xs text-white/60">{subtext}</div>
      ) : null}
    </div>
  );
}
export function OutlineSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="h-1 bg-gradient-to-r from-[rgb(var(--accent))] via-purple-500 to-pink-400" />
      <div className="p-6">
        <h2 className="text-base font-semibold text-white/90">{title}</h2>
        <div className="mt-4 space-y-4 text-sm text-white/80">{children}</div>
      </div>
    </section>
  );
}