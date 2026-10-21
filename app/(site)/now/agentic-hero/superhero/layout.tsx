import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enterprise Risk Management — Agentic Pipeline",
  description: "AI-powered ERM pipeline: extraction, validation, deck creation, 10K disclosure, and filing prep.",
};

export default function SuperheroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] overflow-auto bg-[#0d1117] text-[#f0f6fc]">
      {children}
    </div>
  );
}
