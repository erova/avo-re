import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VibeSharing – GRC Prototypes",
  description: "Agentic GRC Command Center prototypes for Internal Audit, Compliance, and Legal personas",
  openGraph: {
    title: "VibeSharing – GRC Prototypes",
    description: "AI-powered command centers tailored to how each GRC persona actually works",
    siteName: "VibeSharing",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeSharing – GRC Prototypes",
    description: "AI-powered command centers for every GRC role",
  },
};

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Fixed full-viewport container that covers the parent layout's header/footer
    <div className="fixed inset-0 z-[100] overflow-auto bg-[#0d1117]">
      {children}
    </div>
  );
}
