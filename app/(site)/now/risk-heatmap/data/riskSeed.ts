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
  orgPath: string;
  recurring?: boolean;
  stale?: boolean;
};

type CellKey = `${RiskLevel}-${RiskLevel}`;

export const HEATMAP_CURRENT_COUNTS: Record<CellKey, number> = {
  "High-Low": 1,
  "High-Medium": 7,
  "High-High": 6,
  "Medium-Low": 4,
  "Medium-Medium": 21,
  "Medium-High": 22,
  "Low-Low": 7,
  "Low-Medium": 6,
  "Low-High": 8,
};

export const HEATMAP_LAST30_COUNTS: Record<CellKey, number> = {
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

const riskNameByCell: Record<CellKey, string[]> = {
  "High-Low": ["Third-party access controls"],
  "High-Medium": ["Regulatory change tracking", "Access policy drift"],
  "High-High": ["Incident response readiness", "Unpatched dependency exposure"],
  "Medium-Low": ["Evidence collection delays", "SLA monitoring gaps"],
  "Medium-Medium": ["Policy acknowledgement drift", "Training completion variance"],
  "Medium-High": ["Vendor reassessment overdue", "Audit evidence delays"],
  "Low-Low": ["Documentation hygiene", "Minor control variance"],
  "Low-Medium": ["Training completion variance", "Region-specific process variance"],
  "Low-High": ["BCP coverage gaps", "SOX control mapping drift"],
};

const riskTypePool = [
  "Cyber",
  "Compliance",
  "Privacy",
  "Operational",
  "Audit",
  "Resilience",
  "Governance",
  "Third-party",
];

const riskCategoryPool = [
  "Access",
  "Policy",
  "Third-party",
  "Process",
  "Evidence",
  "BCP",
  "Controls",
  "Records",
  "Vulnerability",
  "Review cadence",
];

const orgPool = [
  "Diligent / Platform / Vendor Mgmt",
  "Diligent / Governance / Boards",
  "Diligent / Compliance / EU Ops",
  "Diligent / Platform / SRE",
  "Diligent / Audit & Risk / Subsidiaries",
  "Diligent / Platform / Engineering",
  "Diligent / Operations / APAC",
  "Diligent / Compliance / Corporate",
  "Diligent / Governance / Entities",
];

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

function keyOf(likelihood: RiskLevel, impact: RiskLevel): CellKey {
  return `${likelihood}-${impact}`;
}

export function buildRiskRows(): RiskRow[] {
  const rows: RiskRow[] = [];
  const levels: RiskLevel[] = ["High", "Medium", "Low"];
  const impacts: RiskLevel[] = ["Low", "Medium", "High"];

  let idCounter = 10400;

  for (const likelihood of levels) {
    for (const impact of impacts) {
      const k = keyOf(likelihood, impact);
      const n = HEATMAP_CURRENT_COUNTS[k] ?? 0;
      const names = riskNameByCell[k] ?? ["Risk item"];

      for (let j = 0; j < n; j++) {
        idCounter += 1;

        const name = pick(names, j);
        const riskType = pick(riskTypePool, idCounter);
        const riskCategory = pick(riskCategoryPool, idCounter + 3);
        const orgPath = pick(orgPool, idCounter + 7);

        const inherent: RiskLevel =
          likelihood === "High" || impact === "High"
            ? "High"
            : likelihood === "Medium" || impact === "Medium"
            ? "Medium"
            : "Low";

        const residual: RiskLevel =
          likelihood === "High" && impact === "High"
            ? "High"
            : likelihood === "Medium" && impact === "High"
            ? "Medium"
            : likelihood === "High" && impact === "Medium"
            ? "Medium"
            : "Low";

        const workflowStatus = pick(
          ["Draft", "In review", "Approved", "Monitoring"] as const,
          idCounter
        );

        const recurring =
          (k === "Low-Medium" && j % 2 === 0) || (k === "Low-High" && j % 3 === 0);
        const stale = k === "Low-High" && j % 4 === 0;

        rows.push({
          riskName: name,
          riskId: `R-${idCounter}`,
          inherent,
          residual,
          workflowStatus,
          likelihood,
          impact,
          riskType,
          riskCategory,
          orgPath,
          recurring,
          stale,
        });
      }
    }
  }

  return rows;
}

export const RISK_ROWS: RiskRow[] = buildRiskRows();