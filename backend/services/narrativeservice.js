import { callAI, parseAIJson } from "../utils/aiClient.js";


const ALIGNMENT_LEVELS = ["ALIGNED", "PARTIAL", "CONTRADICTED", "UNVERIFIABLE"];

function buildPrompt(narratives, evidenceChunks) {
  const narrativeText = narratives
    .map((n, i) => `[NARRATIVE ${i + 1}] ID: ${n.id}\nTitle: ${n.title}\nDescription: ${n.description}`)
    .join("\n\n");

  const evidenceText = evidenceChunks
    .map((c, i) => `[EVIDENCE ${i + 1}]: ${c.text}`)
    .join("\n\n");

  return `You are STRATOS, a geopolitical narrative verification analyst.

NARRATIVES:
${narrativeText}

EVIDENCE:
${evidenceText}

Compare each narrative against evidence. Keep all text under 2 sentences.

Respond ONLY with valid JSON, no extra text, no markdown:
{
  "narrative_checks": [
    {
      "narrative_id": "NAR001",
      "narrative_title": "title",
      "alignment": "ALIGNED|PARTIAL|CONTRADICTED|UNVERIFIABLE",
      "alignment_score": 85,
      "verdict": "one sentence",
      "supporting_evidence": ["short quote"],
      "contradicting_evidence": ["short quote"],
      "divergence_explanation": "max 2 sentences",
      "misleading_elements": ["one element"],
      "reality_check": "max 2 sentences"
    }
  ],
  "overall_narrative_integrity": "HIGH|MEDIUM|LOW",
  "most_misleading_narrative": "title or null",
  "most_accurate_narrative": "title or null",
  "analysis_summary": "max 2 sentences"
}`;
}

export async function checkNarratives({ narratives, evidenceChunks }) {
  if (!narratives?.length) throw new Error("No narratives provided.");
  if (!evidenceChunks?.length) throw new Error("No evidence chunks provided.");

  console.log(`[STRATOS] Checking ${narratives.length} narratives against ${evidenceChunks.length} evidence chunks...`);
  const rawText = await callAI(buildPrompt(narratives, evidenceChunks), { temperature: 0.2 });
  const parsed = parseAIJson(rawText);

  const narrativeChecks = (parsed.narrative_checks || []).map((check) => ({
    narrative_id: check.narrative_id || "Unknown",
    narrative_title: check.narrative_title || "Unknown",
    alignment: ALIGNMENT_LEVELS.includes(check.alignment) ? check.alignment : "UNVERIFIABLE",
    alignment_score: Math.min(100, Math.max(0, Number(check.alignment_score) || 50)),
    verdict: check.verdict || "",
    supporting_evidence: Array.isArray(check.supporting_evidence) ? check.supporting_evidence : [],
    contradicting_evidence: Array.isArray(check.contradicting_evidence) ? check.contradicting_evidence : [],
    divergence_explanation: check.divergence_explanation || "",
    misleading_elements: Array.isArray(check.misleading_elements) ? check.misleading_elements : [],
    reality_check: check.reality_check || "",
  }));

  return {
    narrative_checks: narrativeChecks,
    narratives_analyzed: narrativeChecks.length,
    overall_narrative_integrity: parsed.overall_narrative_integrity || "MEDIUM",
    most_misleading_narrative: parsed.most_misleading_narrative || null,
    most_accurate_narrative: parsed.most_accurate_narrative || null,
    analysis_summary: parsed.analysis_summary || "",
    analyzed_at: new Date().toISOString(),
  };
}