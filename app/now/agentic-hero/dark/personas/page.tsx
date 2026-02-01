"use client";

import React from "react";

function DiligentLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 222 222" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path fill="#EE312E" d="M200.87,110.85c0,33.96-12.19,61.94-33.03,81.28c-0.24,0.21-0.42,0.43-0.66,0.64c-15.5,14.13-35.71,23.52-59.24,27.11l-1.59-1.62l35.07-201.75l1.32-3.69C178.64,30.36,200.87,65.37,200.87,110.85z"/>
        <path fill="#AF292E" d="M142.75,12.83l-0.99,1.47L0.74,119.34L0,118.65c0,0,0-0.03,0-0.06V0.45h85.63c5.91,0,11.64,0.34,17.19,1.01h0.21c14.02,1.66,26.93,5.31,38.48,10.78C141.97,12.46,142.75,12.83,142.75,12.83z"/>
        <path fill="#D3222A" d="M142.75,12.83L0,118.65v99.27v3.62h85.96c7.61,0,14.94-0.58,21.99-1.66C107.95,219.89,142.75,12.83,142.75,12.83z"/>
      </g>
    </svg>
  );
}

const domains = [
  {
    name: "Internal Audit",
    description: "Risk-based audit planning, execution, and follow-up across the audit lifecycle",
    color: "#58a6ff",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    personas: [
      {
        title: "Chief Audit Executive",
        subtitle: "Strategic oversight & board relationships",
        href: "/now/agentic-hero/dark/audit-executive",
        level: "Executive",
        focus: ["Audit universe governance", "Board reporting", "Enterprise risk alignment", "Resource allocation"],
      },
      {
        title: "Audit Manager",
        subtitle: "Team leadership & engagement supervision",
        href: "/now/agentic-hero/dark/audit-manager",
        level: "Manager",
        focus: ["Workpaper review", "Team capacity planning", "Quality oversight", "Stakeholder coordination"],
      },
      {
        title: "Auditor",
        subtitle: "Hands-on testing & evidence collection",
        href: "/now/agentic-hero/dark/auditor",
        level: "Doer",
        focus: ["Control testing", "Evidence gathering", "Finding documentation", "Interview execution"],
      },
      {
        title: "QA Reviewer",
        subtitle: "Standards compliance & quality assurance",
        href: "/now/agentic-hero/dark/audit-qa",
        level: "Specialist",
        focus: ["Methodology compliance", "Cross-audit patterns", "Process improvement", "Quality scoring"],
      },
    ],
  },
  {
    name: "Compliance",
    description: "Program management, policy governance, investigations, and third-party risk",
    color: "#a371f7",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    personas: [
      {
        title: "Chief Compliance Officer",
        subtitle: "Program defensibility & board readiness",
        href: "/now/agentic-hero/dark/compliance-cco",
        level: "Executive",
        focus: ["DOJ framework alignment", "Culture oversight", "Regulatory strategy", "Third-party risk posture"],
      },
      {
        title: "Compliance Director",
        subtitle: "Operational management & policy workflows",
        href: "/now/agentic-hero/dark/compliance-director",
        level: "Manager",
        focus: ["Policy lifecycle", "Attestation campaigns", "Vendor onboarding", "Training deployment"],
      },
      {
        title: "Investigations Lead",
        subtitle: "Case management & speak-up channel",
        href: "/now/agentic-hero/dark/compliance-investigations",
        level: "Manager",
        focus: ["Case triage", "Investigation SLAs", "Retaliation monitoring", "Trend analysis"],
      },
      {
        title: "Compliance Analyst",
        subtitle: "Policy drafting & operational support",
        href: "/now/agentic-hero/dark/compliance-analyst",
        level: "Doer",
        focus: ["Policy authoring", "DDQ follow-up", "Attestation tracking", "Evidence collection"],
      },
      {
        title: "Corporate Secretary",
        subtitle: "Entity management & governance records",
        href: "/now/agentic-hero/dark/compliance-entity",
        level: "Specialist",
        focus: ["Filing deadlines", "KYC fulfillment", "Jurisdiction compliance", "Structure changes"],
      },
    ],
  },
  {
    name: "Legal",
    description: "Legal operations, matter management, and cross-functional counsel",
    color: "#3fb950",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    personas: [
      {
        title: "General Counsel",
        subtitle: "Legal strategy & enterprise risk",
        href: "/now/agentic-hero/dark/general-counsel",
        level: "Executive",
        focus: ["Litigation oversight", "Regulatory matters", "Contract governance", "Board advisory"],
      },
    ],
  },
];

const levelColors: Record<string, { bg: string; text: string; border: string }> = {
  Executive: { bg: "bg-[#da3633]/10", text: "text-[#ff7b72]", border: "border-[#da3633]/30" },
  Manager: { bg: "bg-[#f0883e]/10", text: "text-[#f0883e]", border: "border-[#f0883e]/30" },
  Doer: { bg: "bg-[#3fb950]/10", text: "text-[#3fb950]", border: "border-[#3fb950]/30" },
  Specialist: { bg: "bg-[#a371f7]/10", text: "text-[#a371f7]", border: "border-[#a371f7]/30" },
};

export default function PersonaPathwayPage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Header */}
      <div className="border-b border-[#30363d] bg-[#0d1117]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <DiligentLogo className="h-8 w-auto" />
            <div>
              <h1 className="text-lg font-semibold text-[#f0f6fc]">Agentic GRC Command Centers</h1>
              <p className="text-sm text-[#8b949e]">Near-term Vision Prototypes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e]">
              10 Personas
            </span>
            <span className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e]">
              3 Domains
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-semibold text-[#f0f6fc]">
            One platform. Every GRC role.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#8b949e]">
            AI-powered command centers tailored to how each persona actually works—from executives 
            focused on board readiness to practitioners managing day-to-day operations.
          </p>
        </div>

        {/* Role level legend */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
          <span className="text-xs font-medium uppercase tracking-wider text-[#6e7681]">Role Levels:</span>
          {Object.entries(levelColors).map(([level, colors]) => (
            <span
              key={level}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}
            >
              {level}
            </span>
          ))}
        </div>

        {/* Domains */}
        <div className="space-y-12">
          {domains.map((domain) => (
            <section key={domain.name}>
              <div className="mb-6 flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${domain.color}15`, color: domain.color }}
                >
                  {domain.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[#f0f6fc]">{domain.name}</h3>
                  <p className="text-sm text-[#8b949e]">{domain.description}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {domain.personas.map((persona) => {
                  const levelStyle = levelColors[persona.level];
                  return (
                    <a
                      key={persona.href}
                      href={persona.href}
                      className="group relative overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22] p-5 transition-all hover:border-[#58a6ff]/50 hover:bg-[#21262d]"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h4 className="text-base font-semibold text-[#f0f6fc] group-hover:text-[#58a6ff]">
                            {persona.title}
                          </h4>
                          <p className="mt-0.5 text-sm text-[#8b949e]">{persona.subtitle}</p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}
                        >
                          {persona.level}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {persona.focus.map((item) => (
                          <div key={item} className="flex items-center gap-2 text-xs text-[#8b949e]">
                            <span
                              className="h-1 w-1 rounded-full"
                              style={{ backgroundColor: domain.color }}
                            />
                            {item}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#58a6ff] opacity-0 transition-opacity group-hover:opacity-100">
                        View prototype
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>

                      {/* Hover accent */}
                      <div
                        className="absolute inset-x-0 bottom-0 h-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ backgroundColor: domain.color }}
                      />
                    </a>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Summary matrix */}
        <div className="mt-16 rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[#f0f6fc]">Persona Coverage Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#30363d]">
                  <th className="pb-3 text-left font-medium text-[#8b949e]">Domain</th>
                  <th className="pb-3 text-center font-medium text-[#8b949e]">Executive</th>
                  <th className="pb-3 text-center font-medium text-[#8b949e]">Manager</th>
                  <th className="pb-3 text-center font-medium text-[#8b949e]">Doer</th>
                  <th className="pb-3 text-center font-medium text-[#8b949e]">Specialist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                <tr>
                  <td className="py-3 font-medium text-[#f0f6fc]">Internal Audit</td>
                  <td className="py-3 text-center text-[#8b949e]">CAE</td>
                  <td className="py-3 text-center text-[#8b949e]">Audit Manager</td>
                  <td className="py-3 text-center text-[#8b949e]">Auditor</td>
                  <td className="py-3 text-center text-[#8b949e]">QA Reviewer</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-[#f0f6fc]">Compliance</td>
                  <td className="py-3 text-center text-[#8b949e]">CCO</td>
                  <td className="py-3 text-center text-[#8b949e]">Director, Investigations</td>
                  <td className="py-3 text-center text-[#8b949e]">Analyst</td>
                  <td className="py-3 text-center text-[#8b949e]">Corp Secretary</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-[#f0f6fc]">Legal</td>
                  <td className="py-3 text-center text-[#8b949e]">General Counsel</td>
                  <td className="py-3 text-center text-[#6e7681]">—</td>
                  <td className="py-3 text-center text-[#6e7681]">—</td>
                  <td className="py-3 text-center text-[#6e7681]">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-[#30363d] pt-8 text-center">
          <p className="text-sm text-[#6e7681]">
            Near-term Vision · Users navigate to Diligent products to complete tasks
          </p>
          <p className="mt-1 text-xs text-[#6e7681]">
            Prototype built January 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
