import { callAI, parseAIJson } from "../utils/aiClient.js";


const SYSTEMS = [
  "Energy Supply", "Trade & Sanctions", "Shipping & Logistics",
  "Food & Commodities", "Regional Economy", "Military & Security",
];
const SEVERITY_LEVELS = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "NONE"];

function buildPrompt(evidenceChunks, signals) {
  const evidenceText = evidenceChunks
    .map((c, i) => `[CHUNK ${i + 1}]: ${c.text}`)
    .join("\n\n");

  const signalText = signals?.length > 0
    ? signals.map((s) => `${s.domain}: ${s.terms.join(", ")}`).join("\n")
    : "No signals.";

  return `You are STRATOS, a geopolitical impact analyst.

SIGNALS: ${signalText}

EVIDENCE:
${evidenceText}

Analyze impact on these 6 systems: ${SYSTEMS.join(", ")}

Keep reasoning under 2 sentences per system.

Respond ONLY with valid JSON, no extra text, no markdown:
{
  "summary": "2 sentence overall summary",
  "impacts": [
    {
      "system": "Energy Supply",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW|NONE",
      "confidence": "HIGH|MEDIUM|LOW",
      "headline": "one line",
      "reasoning": "max 2 sentences",
      "evidence_refs": ["short quote"],
      "affected_regions": ["region"]
    }
  ],
  "most_affected_system": "system name",
  "overall_severity": "CRITICAL|HIGH|MEDIUM|LOW"
}`;
}

export async function analyzeImpact({ evidenceChunks, signals }) {
  if (!evidenceChunks?.length) throw new Error("No evidence chunks provided.");

  console.log(`[STRATOS] Sending ${evidenceChunks.length} chunks to OpenRouter...`);
  const rawText = await callAI(buildPrompt(evidenceChunks, signals), { temperature: 0.2 });
  const parsed = parseAIJson(rawText);

  const impacts = (parsed.impacts || []).map((item) => ({
    system: item.system || "Unknown",
    severity: SEVERITY_LEVELS.includes(item.severity) ? item.severity : "LOW",
    confidence: item.confidence || "LOW",
    headline: item.headline || "",
    reasoning: item.reasoning || "",
    evidence_refs: Array.isArray(item.evidence_refs) ? item.evidence_refs : [],
    affected_regions: Array.isArray(item.affected_regions) ? item.affected_regions : [],
  }));

  return {
    summary: parsed.summary || "Impact analysis complete.",
    impacts,
    most_affected_system: parsed.most_affected_system || impacts[0]?.system || "Unknown",
    overall_severity: SEVERITY_LEVELS.includes(parsed.overall_severity) ? parsed.overall_severity : "LOW",
    systems_analyzed: SYSTEMS.length,
    analyzed_at: new Date().toISOString(),
  };
}