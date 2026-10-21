export type RiskLevel = "Low" | "Medium" | "High";
export type WorkflowStatus = "Draft" | "In review" | "Approved" | "Monitoring";

export type RiskRow = {
  riskName: string;
  riskId: string;
  inherent: RiskLevel;
  residual: RiskLevel;
  workflowStatus: WorkflowStatus;
  likelihood: RiskLevel;
  impact: RiskLevel;
  riskType: string;
  riskCategory: string;
  orgPath: string; // "Company / BU / Subsidiary"

  // Signals used by the insights/patterns prototypes
  recurring: boolean;
  stale: boolean;
};

// Single source of truth for table data in these prototypes
// NOTE: Keep this file deterministic. We seed a small set of hand-crafted rows,
// then generate additional rows to reach a realistic enterprise-scale set.

const BASE_RISKS: RiskRow[] = [
  {
    riskName: "Third-party access controls",
    riskId: "R-10421",
    inherent: "High",
    residual: "Medium",
    workflowStatus: "In review",
    likelihood: "High",
    impact: "High",
    riskType: "Cyber",
    riskCategory: "Access",
    orgPath: "Northbridge Financial / Technology & Operations / Vendor Management",
    recurring: true,
    stale: false,
  },
  {
    riskName: "Data retention policy gaps",
    riskId: "R-10218",
    inherent: "Medium",
    residual: "Medium",
    workflowStatus: "Approved",
    likelihood: "Medium",
    impact: "Medium",
    riskType: "Compliance",
    riskCategory: "Policy",
    orgPath: "Northbridge Financial / Risk & Compliance / Policy Operations",
    recurring: false,
    stale: false,
  },
  {
    riskName: "EU vendor subprocessors not reviewed",
    riskId: "R-10990",
    inherent: "High",
    residual: "High",
    workflowStatus: "Draft",
    likelihood: "Medium",
    impact: "High",
    riskType: "Privacy",
    riskCategory: "Third-party",
    orgPath: "Northbridge Financial / Commercial Banking / EMEA Vendor Oversight",
    recurring: true,
    stale: false,
  },
  {
    riskName: "Inconsistent incident severity rubric",
    riskId: "R-10077",
    inherent: "Medium",
    residual: "Low",
    workflowStatus: "Monitoring",
    likelihood: "Low",
    impact: "Medium",
    riskType: "Operational",
    riskCategory: "Process",
    orgPath: "Northbridge Financial / Technology & Operations / SRE",
    recurring: true,
    stale: false,
  },
  {
    riskName: "Subsidiary audit evidence delays",
    riskId: "R-11102",
    inherent: "Medium",
    residual: "Medium",
    workflowStatus: "In review",
    likelihood: "High",
    impact: "Medium",
    riskType: "Audit",
    riskCategory: "Evidence",
    orgPath: "Northbridge Financial / Risk & Compliance / Audit Evidence",
    recurring: false,
    stale: false,
  },
  {
    riskName: "Unpatched dependency exposure",
    riskId: "R-11235",
    inherent: "High",
    residual: "High",
    workflowStatus: "In review",
    likelihood: "High",
    impact: "High",
    riskType: "Cyber",
    riskCategory: "Vulnerability",
    orgPath: "Northbridge Financial / Technology & Operations / Engineering Platform",
    recurring: true,
    stale: false,
  },
  {
    riskName: "Regional BCP coverage gaps",
    riskId: "R-10701",
    inherent: "Medium",
    residual: "Medium",
    workflowStatus: "Approved",
    likelihood: "Medium",
    impact: "High",
    riskType: "Resilience",
    riskCategory: "BCP",
    orgPath: "Northbridge Financial / Consumer Banking / APAC Operations",
    recurring: false,
    stale: false,
  },
  {
    riskName: "SOX control mapping drift",
    riskId: "R-10544",
    inherent: "High",
    residual: "Medium",
    workflowStatus: "Monitoring",
    likelihood: "Low",
    impact: "High",
    riskType: "Compliance",
    riskCategory: "Controls",
    orgPath: "Northbridge Financial / Risk & Compliance / Corporate Controls",
    recurring: false,
    stale: true,
  },
  {
    riskName: "Entity ownership records outdated",
    riskId: "R-11310",
    inherent: "Medium",
    residual: "Low",
    workflowStatus: "Draft",
    likelihood: "Low",
    impact: "Medium",
    riskType: "Governance",
    riskCategory: "Records",
    orgPath: "Northbridge Financial / Wealth Management / Legal Entity Records",
    recurring: false,
    stale: true,
  },
  {
    riskName: "Vendor risk reassessment overdue",
    riskId: "R-11008",
    inherent: "High",
    residual: "High",
    workflowStatus: "In review",
    likelihood: "High",
    impact: "Medium",
    riskType: "Third-party",
    riskCategory: "Review cadence",
    orgPath: "Northbridge Financial / Commercial Banking / Vendor Management",
    recurring: true,
    stale: false,
  },
];

const ORG_PATHS = [
  "Northbridge Financial / Consumer Banking / North America Retail Ops",
  "Northbridge Financial / Consumer Banking / APAC Operations",
  "Northbridge Financial / Consumer Banking / EMEA Retail Controls",
  "Northbridge Financial / Commercial Banking / North America Corporate Lending",
  "Northbridge Financial / Commercial Banking / EMEA Vendor Oversight",
  "Northbridge Financial / Commercial Banking / APAC Trade Finance",
  "Northbridge Financial / Wealth Management / Advisory Operations",
  "Northbridge Financial / Wealth Management / Legal Entity Records",
  "Northbridge Financial / Risk & Compliance / Corporate Controls",
  "Northbridge Financial / Risk & Compliance / Policy Operations",
  "Northbridge Financial / Risk & Compliance / Audit Evidence",
  "Northbridge Financial / Technology & Operations / Engineering Platform",
  "Northbridge Financial / Technology & Operations / SRE",
  "Northbridge Financial / Technology & Operations / Identity & Access",
  "Northbridge Financial / Technology & Operations / Vendor Management",
] as const;

const RISK_TAXONOMY = [
  { riskType: "Cyber", riskCategory: "Access" },
  { riskType: "Cyber", riskCategory: "Vulnerability" },
  { riskType: "Cyber", riskCategory: "Detection" },
  { riskType: "Privacy", riskCategory: "Third-party" },
  { riskType: "Privacy", riskCategory: "Retention" },
  { riskType: "Compliance", riskCategory: "Controls" },
  { riskType: "Compliance", riskCategory: "Policy" },
  { riskType: "Audit", riskCategory: "Evidence" },
  { riskType: "Operational", riskCategory: "Process" },
  { riskType: "Resilience", riskCategory: "BCP" },
  { riskType: "Third-party", riskCategory: "Review cadence" },
  { riskType: "Governance", riskCategory: "Records" },
] as const;

const WORKFLOW: WorkflowStatus[] = ["Draft", "In review", "Approved", "Monitoring"];

const LEVELS: RiskLevel[] = ["Low", "Medium", "High"];

function levelByIndex(n: number): RiskLevel {
  return LEVELS[((n % 3) + 3) % 3];
}

function score(l: RiskLevel, i: RiskLevel) {
  // 1..9 like the heatmap: Low=0, Medium=1, High=2
  const li = l === "Low" ? 0 : l === "Medium" ? 1 : 2;
  const im = i === "Low" ? 0 : i === "Medium" ? 1 : 2;
  return 1 + li * 3 + im;
}

function inherentFromScore(s: number): RiskLevel {
  if (s >= 7) return "High";
  if (s >= 4) return "Medium";
  return "Low";
}

function residualFromScore(s: number, idx: number): RiskLevel {
  // Residual tends to be slightly better than inherent, but not always.
  // Deterministic “noise” via idx.
  if (s >= 8) return idx % 4 === 0 ? "High" : "Medium";
  if (s >= 6) return idx % 3 === 0 ? "High" : "Medium";
  if (s >= 4) return idx % 5 === 0 ? "Medium" : "Low";
  return "Low";
}

function makeSyntheticRow(n: number): RiskRow {
  // n is 11..72
  const i = n - 11; // 0-based

  // Deterministic distribution across the 3x3 grid
  const likelihood = levelByIndex(i);
  const impact = levelByIndex(i + 1);
  const s = score(likelihood, impact);

  const inherent = inherentFromScore(s);
  const residual = residualFromScore(s, i);

  const wf = WORKFLOW[i % WORKFLOW.length];
  const orgPath = ORG_PATHS[i % ORG_PATHS.length];
  const tax = RISK_TAXONOMY[i % RISK_TAXONOMY.length];

  // Recurrence/staleness: deterministic but sparse
  const recurring = i % 6 === 0 || i % 9 === 0;
  const stale = i % 11 === 0;

  const label = `${tax.riskType} ${tax.riskCategory}`;

  return {
    riskName: `${label} — signal cluster ${((i % 8) + 1).toString()}`,
    riskId: `R-${20000 + n}`,
    inherent,
    residual,
    workflowStatus: wf,
    likelihood,
    impact,
    riskType: tax.riskType,
    riskCategory: tax.riskCategory,
    orgPath,
    recurring,
    stale,
  };
}

const SYNTHETIC_RISKS: RiskRow[] = Array.from({ length: 62 }, (_, idx) =>
  makeSyntheticRow(11 + idx)
);

// Exported rows used across the in-situ + insights + patterns prototypes.
// Total = 72 (10 base + 62 synthetic)
export const RISK_ROWS: RiskRow[] = [...BASE_RISKS, ...SYNTHETIC_RISKS];

export const HEATMAP_LAST30_COUNTS: Record<
  `${"Low" | "Medium" | "High"}-${"Low" | "Medium" | "High"}`,
  number
> = {
  "High-Low": 2,
  "High-Medium": 5,
  "High-High": 4,
  "Medium-Low": 3,
  "Medium-Medium": 19,
  "Medium-High": 18,
  "Low-Low": 6,
  "Low-Medium": 5,
  "Low-High": 7,
};