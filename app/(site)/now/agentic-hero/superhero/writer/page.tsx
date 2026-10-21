"use client";
import React from "react";
import {
  PipelineBanner,
  AgentNav,
  PipelineStepper,
  AgentPageShell,
  SectionHeader,
  CTAButton,
  MetricCard,
  DocumentPreview,
  Icons,
  cn,
} from "../shared";

/* ------------------------------------------------------------------ */
/*  Prior Year Risk Factor Content                                     */
/* ------------------------------------------------------------------ */

const PRIOR_YEAR_RISKS = [
  {
    title: "Cybersecurity and Data Privacy Risks",
    body: "We face risks related to cybersecurity threats and data privacy obligations across multiple jurisdictions. A breach of our information systems could result in the loss of confidential information, disruption to our business operations, and significant reputational harm. We invest in security infrastructure and employee training programs; however, no assurance can be given that our measures will prevent all cyber incidents.",
  },
  {
    title: "Market and Competition Risks",
    body: "Our business operates in highly competitive markets that are subject to rapid technological change and evolving customer demands. We compete with both established companies and emerging market entrants, and our failure to anticipate market trends or respond to competitive pressures could materially impact our revenue and market share.",
  },
  {
    title: "Regulatory and Compliance Risks",
    body: "We are subject to a wide range of laws and regulations in the jurisdictions in which we operate. Changes in these laws, or our failure to comply with existing requirements, could result in fines, penalties, litigation, or restrictions on our business activities. Regulatory developments may also increase our compliance costs and operational complexity.",
  },
  {
    title: "Operational and Supply Chain Risks",
    body: "Our operations depend on the continuous and uninterrupted performance of our supply chain and key operational processes. Disruptions caused by natural disasters, geopolitical events, or failures of key vendors could adversely affect our ability to deliver products and services to our customers.",
  },
  {
    title: "Financial and Economic Risks",
    body: "We are exposed to macroeconomic conditions including interest rate fluctuations, inflation, and foreign exchange volatility. Adverse economic conditions could reduce demand for our products and services, increase our borrowing costs, and negatively impact our financial results.",
  },
];

/* ------------------------------------------------------------------ */
/*  New Draft Risk Factor Content (with inline diffs)                  */
/* ------------------------------------------------------------------ */

function DiffAdd({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-[#3fb950]/20 text-[#3fb950] px-0.5 rounded-sm">
      {children}
    </span>
  );
}

function DiffRemove({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-[#f85149]/20 text-[#f85149] line-through px-0.5 rounded-sm">
      {children}
    </span>
  );
}

function DiffModify({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-[#d29922]/20 text-[#d29922] px-0.5 rounded-sm">
      {children}
    </span>
  );
}

function NewDraftContent() {
  return (
    <div className="space-y-5 text-xs leading-relaxed">
      {/* Risk Factor 1 */}
      <div>
        <div className="font-semibold text-[#f0f6fc] mb-1.5 text-sm">
          1. Cybersecurity and Data Privacy Risks
        </div>
        <p className="text-[#c9d1d9]">
          We face risks related to cybersecurity threats and data privacy
          obligations across multiple jurisdictions.{" "}
          <DiffAdd>
            These risks are heightened by our reliance on third-party service
            providers, including cloud infrastructure and SaaS vendors, whose
            security practices may be outside our direct control.
          </DiffAdd>{" "}
          A breach of our information systems{" "}
          <DiffModify>
            or those of our third-party partners
          </DiffModify>{" "}
          could result in the loss of confidential information, disruption to our
          business operations, and significant reputational harm. We invest in
          security infrastructure and employee training programs; however, no
          assurance can be given that our measures will prevent all cyber
          incidents.{" "}
          <DiffAdd>
            Additionally, our increasing deployment of artificial intelligence
            and machine learning models introduces data governance risks,
            including model bias, data leakage, and adversarial manipulation,
            which require ongoing oversight and governance frameworks.
          </DiffAdd>
        </p>
      </div>

      {/* Risk Factor 2 */}
      <div>
        <div className="font-semibold text-[#f0f6fc] mb-1.5 text-sm">
          2. Market and Competition Risks
        </div>
        <p className="text-[#c9d1d9]">
          Our business operates in highly competitive markets that are subject to
          rapid technological change and evolving customer demands.{" "}
          <DiffAdd>
            Our planned expansion into Asia-Pacific markets, including Southeast
            Asia, exposes us to new competitive dynamics, local incumbents, and
            market entry barriers that differ significantly from our established
            markets.
          </DiffAdd>{" "}
          We compete with both established companies and emerging market
          entrants, and our failure to anticipate market trends or respond to
          competitive pressures could materially impact our revenue and market
          share.{" "}
          <DiffAdd>
            Furthermore, geopolitical developments in the European Union,
            including the Digital Markets Act and evolving trade policies, may
            create additional compliance costs and competitive uncertainty in our
            EU-based operations, which represent approximately 28% of annual
            revenue.
          </DiffAdd>
        </p>
      </div>

      {/* Risk Factor 3 */}
      <div>
        <div className="font-semibold text-[#f0f6fc] mb-1.5 text-sm">
          3. Regulatory and Compliance Risks
        </div>
        <p className="text-[#c9d1d9]">
          We are subject to a wide range of laws and regulations in the
          jurisdictions in which we operate. Changes in these laws, or our
          failure to comply with existing requirements, could result in fines,
          penalties, litigation, or restrictions on our business activities.{" "}
          <DiffAdd>
            The European Union&apos;s Artificial Intelligence Act, which
            establishes risk-based requirements for AI systems, may require
            significant changes to our AI development and deployment practices,
            including model inventory, risk classification, and ongoing
            monitoring obligations.
          </DiffAdd>{" "}
          Regulatory developments may also increase our compliance costs and
          operational complexity.{" "}
          <DiffModify>
            We are also subject to evolving environmental, social, and governance
            (ESG) reporting requirements, including the EU Corporate
            Sustainability Reporting Directive (CSRD) and SEC climate-related
            disclosure rules, which will require additional data collection,
            assurance processes, and reporting infrastructure.
          </DiffModify>
        </p>
      </div>

      {/* Risk Factor 4 */}
      <div>
        <div className="font-semibold text-[#f0f6fc] mb-1.5 text-sm">
          4. Operational and Supply Chain Risks
        </div>
        <p className="text-[#c9d1d9]">
          Our operations depend on the continuous and uninterrupted performance
          of our supply chain and key operational processes.{" "}
          <DiffModify>
            Approximately 68% of our cost of goods sold is concentrated with two
            primary suppliers, and lead times have increased approximately 22%
            year-over-year.
          </DiffModify>{" "}
          Disruptions caused by natural disasters, geopolitical events, or
          failures of key vendors could adversely affect our ability to deliver
          products and services to our customers.{" "}
          <DiffAdd>
            We also face risks related to the retention of key personnel,
            including senior executives with approaching equity vesting
            milestones and critical engineering talent in a competitive labor
            market. Our succession planning for certain executive roles remains
            in development.
          </DiffAdd>
        </p>
      </div>

      {/* Risk Factor 5 */}
      <div>
        <div className="font-semibold text-[#f0f6fc] mb-1.5 text-sm">
          5. Financial and Economic Risks
        </div>
        <p className="text-[#c9d1d9]">
          We are exposed to macroeconomic conditions including interest rate
          fluctuations, inflation, and foreign exchange volatility.{" "}
          <DiffModify>
            Our top three clients represent approximately 42% of annual revenue,
            representing material concentration risk. Historical analysis
            suggests one such client is at elevated risk of non-renewal.
          </DiffModify>{" "}
          Adverse economic conditions could reduce demand for our products and
          services, increase our borrowing costs, and negatively impact our
          financial results.{" "}
          <DiffAdd>
            Our unhedged foreign exchange exposure has grown approximately 15%
            in connection with our Asia-Pacific expansion plans, and our current
            hedge ratio covers only 40% of projected international revenue.
          </DiffAdd>
        </p>
      </div>

      {/* Risk Factor 6 - NEW */}
      <div className="rounded-lg border border-[#3fb950]/30 bg-[#3fb950]/5 p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-semibold text-[#f0f6fc] text-sm">
            6. Artificial Intelligence and Technology Risks
          </span>
          <span className="rounded-full bg-[#3fb950]/10 border border-[#3fb950]/30 px-1.5 py-0 text-[9px] text-[#3fb950] font-medium">
            NEW
          </span>
        </div>
        <p className="text-[#3fb950]">
          We are increasingly integrating artificial intelligence and machine
          learning technologies into our products, services, and internal
          operations. These technologies present unique risks, including the
          potential for biased or inaccurate outputs, intellectual property
          concerns related to training data, and evolving regulatory frameworks
          such as the EU Artificial Intelligence Act and the NIST AI Risk
          Management Framework. Our AI systems may produce results that are
          unreliable or inconsistent, which could lead to flawed business
          decisions, customer dissatisfaction, or reputational harm. The rapid
          pace of AI development may also outstrip our ability to establish
          adequate governance, testing, and monitoring frameworks. We do not
          currently maintain a comprehensive AI model inventory or formal risk
          classification process, and the absence of such frameworks could
          expose us to regulatory, operational, and reputational risks as
          regulatory scrutiny of AI systems intensifies.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AI Alignment Notes Data                                            */
/* ------------------------------------------------------------------ */

const ALIGNMENT_NOTES = [
  {
    reference: 'Item 1A, Risk Factor 1: "Cybersecurity and Data Privacy"',
    mapping:
      "Third-Party Cyber Risk (score 18), AI/ML Model Governance (score 14)",
  },
  {
    reference: 'Item 1A, Risk Factor 3: "Regulatory and Compliance"',
    mapping:
      "Updated to reflect EU AI Act timeline and ESG reporting requirements",
  },
  {
    reference: 'Item 1A, Risk Factor 6: "AI and Technology Risks"',
    mapping:
      "NEW \u2014 Maps to AI/ML Model Governance risk identified in board materials",
  },
];

/* ------------------------------------------------------------------ */
/*  Counsel Comments Data                                              */
/* ------------------------------------------------------------------ */

const COUNSEL_COMMENTS = [
  {
    author: "Sarah Morrison, Davis Polk",
    comment:
      "The AI risk factor section should reference specific regulatory frameworks. Suggest adding EU AI Act and NIST AI RMF.",
    status: "Accepted" as const,
  },
  {
    author: "Sarah Morrison, Davis Polk",
    comment:
      "Consider strengthening the forward-looking language in the cybersecurity section to address the Meridian vendor incident.",
    status: "Accepted" as const,
  },
  {
    author: "James Park, GC",
    comment:
      "Need to verify the FX exposure numbers with Treasury before finalizing.",
    status: "Pending" as const,
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function WriterPage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <PipelineBanner />
      <AgentNav activeAgent="writer" />

      <main className="mx-auto max-w-7xl px-6 py-6">
        <AgentPageShell
          agentId="writer"
          title="The Writer"
          subtitle="10K Disclosure Draft \u2014 Ready for counsel review"
          status="complete"
        >
          {/* ---- Metrics Row ---- */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Risk Factors"
              value="12"
              trend="2 new, 1 removed"
              trendDirection="neutral"
            />
            <MetricCard
              label="Words"
              value="4,280"
              trend="+340 vs prior year"
              trendDirection="up"
            />
            <MetricCard
              label="Counsel Comments"
              value="3"
              trend="2 accepted, 1 pending"
              trendDirection="neutral"
            />
            <MetricCard
              label="Compliance Score"
              value="96%"
              trend="SEC Item 1A aligned"
              trendDirection="up"
            />
          </div>

          {/* ---- Split View: Prior Year vs New Draft ---- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Prior Year 10K */}
            <DocumentPreview
              title="FY2025 10K \u2014 Risk Factors (Item 1A)"
              type="Prior Year"
            >
              <div className="space-y-5 text-xs leading-relaxed">
                {PRIOR_YEAR_RISKS.map((risk, i) => (
                  <div key={risk.title}>
                    <div className="font-semibold text-[#f0f6fc] mb-1.5 text-sm">
                      {i + 1}. {risk.title}
                    </div>
                    <p className="text-[#8b949e]">{risk.body}</p>
                  </div>
                ))}
              </div>
            </DocumentPreview>

            {/* Right: New Draft */}
            <DocumentPreview
              title="FY2026 10K Draft \u2014 Risk Factors (Item 1A)"
              type="AI Draft"
            >
              <NewDraftContent />
            </DocumentPreview>
          </div>

          {/* ---- AI Alignment Notes ---- */}
          <div>
            <SectionHeader
              title="AI Alignment Notes"
              subtitle="Mapping draft language to validated risk entries"
            />
            <div className="space-y-3">
              {ALIGNMENT_NOTES.map((note) => (
                <div
                  key={note.reference}
                  className="flex items-start gap-3 rounded-xl border border-[#30363d] bg-[#161b22] p-4 border-l-[3px] border-l-[#58a6ff]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-[#f0f6fc]">
                      {note.reference}
                    </div>
                    <div className="text-xs text-[#8b949e] mt-1">
                      {note.mapping}
                    </div>
                  </div>
                  <span className="text-[#58a6ff] flex-shrink-0 mt-0.5">
                    {Icons.route}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ---- Counsel Review Status ---- */}
          <div>
            <SectionHeader
              title="Counsel Review Status"
              subtitle="External counsel collaboration via Boards secure workspace"
            />

            {/* Shared Status */}
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#30363d] bg-[#161b22] px-4 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-[#3fb950]" />
              <span className="text-xs text-[#f0f6fc]">
                Shared with Davis Polk via Boards secure workspace
              </span>
              <span className="ml-auto text-[10px] text-[#484f58]">
                Sent Feb 10, 2026 at 2:15 PM
              </span>
            </div>

            {/* Comment Threads */}
            <div className="space-y-3">
              {COUNSEL_COMMENTS.map((comment, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#30363d] bg-[#161b22] p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#21262d] text-[10px] font-semibold text-[#8b949e]">
                        {comment.author
                          .split(",")[0]
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="text-xs font-medium text-[#f0f6fc]">
                        {comment.author}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        comment.status === "Accepted" &&
                          "bg-[#3fb950]/10 text-[#3fb950] border-[#3fb950]/30",
                        comment.status === "Pending" &&
                          "bg-[#d29922]/10 text-[#d29922] border-[#d29922]/30"
                      )}
                    >
                      {comment.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#8b949e] leading-relaxed">
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ---- CTA ---- */}
          <div className="mt-6 flex justify-end">
            <CTAButton href="/now/agentic-hero/superhero/finisher">
              Incorporate edits & finalize {"\u2192"}
            </CTAButton>
          </div>
        </AgentPageShell>
      </main>
    </div>
  );
}
