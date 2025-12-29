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
  orgPath: string; // Org / BU / Subsidiary
  recurring?: boolean;
  stale?: boolean;
};

// Single source of truth for table data in these prototypes
export const RISK_ROWS: RiskRow[] = [
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
    orgPath: "Diligent / Platform / Vendor Mgmt",
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
    orgPath: "Diligent / Governance / Boards",
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
    orgPath: "Diligent / Compliance / EU Ops",
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
    orgPath: "Diligent / Platform / SRE",
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
    orgPath: "Diligent / Audit & Risk / Subsidiaries",
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
    orgPath: "Diligent / Platform / Engineering",
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
    orgPath: "Diligent / Operations / APAC",
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
    orgPath: "Diligent / Compliance / Corporate",
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
    orgPath: "Diligent / Governance / Entities",
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
    orgPath: "Diligent / Platform / Vendor Mgmt",
  },
];
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