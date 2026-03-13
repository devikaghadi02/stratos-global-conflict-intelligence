import { callAI, parseAIJson } from "../utils/aiClient.js";

const RISK_CATEGORIES = [
  "ENERGY_CRISIS", "SUPPLY_CHAIN_COLLAPSE", "FINANCIAL_CONTAGION",
  "HUMANITARIAN_EMERGENCY", "MILITARY_ESCALATION", "FOOD_SECURITY_THREAT",
  "DIPLOMATIC_BREAKDOWN", "INFRASTRUCTURE_FAILURE",
];
const TIMEFRAMES = ["0-30 days", "30-60 days", "60-90 days", "90+ days"];

function buildPrompt(impactData) {
  const impactText = impactData.impacts
    .filter((i) => i.severity !== "NONE")
    .map((i) => `[${i.system}] ${i.severity}: ${i.headline}`)
    .join("\n");

  return `You are STRATOS, a geopolitical risk forecasting analyst.

OVERALL SEVERITY: ${impactData.overall_severity}
MOST AFFECTED: ${impactData.most_affected_system}

IMPACTS:
${impactText}

Forecast exactly 4 risk scenarios. Keep all text under 2 sentences.

Respond ONLY with valid JSON, no extra text, no markdown:
{
  "risk_summary": "max 2 sentences",
  "risk_level": "CRITICAL|HIGH|MEDIUM|LOW",
  "risks": [
    {
      "id": "RSK001",
      "title": "short title",
      "category": "ENERGY_CRISIS",
      "description": "max 2 sentences",
      "probability": 85,
      "timeframe": "0-30 days",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "trigger_indicators": ["one trigger"],
      "affected_systems": ["one system"],
      "affected_regions": ["one region"],
      "mitigation": "one sentence"
    }
  ],
  "highest_probability_risk": "title",
  "most_severe_risk": "title",
  "stabilization_scenario": "one sentence"
}`;
}

export async function forecastRisks({ impactData, evidenceChunks, signals }) {
  if (!impactData?.impacts?.length) throw new Error("No impact data provided.");

  console.log(`[STRATOS] Forecasting risks from ${impactData.impacts.length} impact systems...`);
  const rawText = await callAI(buildPrompt(impactData), { temperature: 0.3 });
  const parsed = parseAIJson(rawText);

  const risks = (parsed.risks || []).map((r) => ({
    id: r.id || `RSK${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    title: r.title || "Untitled Risk",
    category: RISK_CATEGORIES.includes(r.category) ? r.category : "DIPLOMATIC_BREAKDOWN",
    description: r.description || "",
    probability: Math.min(100, Math.max(0, Number(r.probability) || 50)),
    timeframe: TIMEFRAMES.includes(r.timeframe) ? r.timeframe : "30-60 days",
    severity: r.severity || "MEDIUM",
    trigger_indicators: Array.isArray(r.trigger_indicators) ? r.trigger_indicators : [],
    affected_systems: Array.isArray(r.affected_systems) ? r.affected_systems : [],
    affected_regions: Array.isArray(r.affected_regions) ? r.affected_regions : [],
    mitigation: r.mitigation || "",
  }));

  risks.sort((a, b) => b.probability - a.probability);

  return {
    risk_summary: parsed.risk_summary || "Risk forecast complete.",
    risk_level: parsed.risk_level || "HIGH",
    risks,
    risk_count: risks.length,
    highest_probability_risk: parsed.highest_probability_risk || risks[0]?.title || "Unknown",
    most_severe_risk: parsed.most_severe_risk || risks[0]?.title || "Unknown",
    stabilization_scenario: parsed.stabilization_scenario || "",
    forecasted_at: new Date().toISOString(),
  };
}