import { ReactNode } from "react";

type CalloutProps = {
  title?: string;
  tone?: "neutral" | "insight" | "warning";
  children: ReactNode;
};

const toneStyles = {
  neutral: {
    border: "border-neutral-800",
    bg: "bg-neutral-900/40",
    title: "text-neutral-200",
  },
  insight: {
    border: "border-emerald-800/60",
    bg: "bg-emerald-900/20",
    title: "text-emerald-300",
  },
  warning: {
    border: "border-amber-800/60",
    bg: "bg-amber-900/20",
    title: "text-amber-300",
  },
};

export function Callout({
  title,
  tone = "neutral",
  children,
}: CalloutProps) {
  const styles = toneStyles[tone];

  return (
    <div
      style={{
        border: "2px solid red",
        background: "rgba(255,0,0,0.08)",
        borderRadius: 24,
        padding: 20,
        margin: "24px 0",
      }}
    >
      {title ? <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div> : null}
      <div>{children}</div>
    </div>
  );
}