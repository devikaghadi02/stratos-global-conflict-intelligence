import { callAI, parseAIJson } from "../utils/aiClient.js";

const EVENT_TYPES = [
  "MILITARY_ACTION", "DIPLOMATIC_EVENT", "ECONOMIC_SANCTION",
  "ENERGY_DISRUPTION", "TRADE_RESTRICTION", "HUMANITARIAN_CRISIS",
  "POLITICAL_DECISION", "INFRASTRUCTURE_ATTACK",
];

function buildPrompt(evidenceChunks, signals) {
  const evidenceText = evidenceChunks
    .map((c, i) => `[CHUNK ${i + 1}] (relevance: ${c.relevance})\n${c.text}`)
    .join("\n\n");

  const signalText = signals?.length > 0
    ? signals.map((s) => `${s.domain}: ${s.terms.join(", ")}`).join("\n")
    : "No signals.";

  return `You are STRATOS, a geopolitical intelligence analyst.

SIGNALS: ${signalText}

EVIDENCE:
${evidenceText}

Extract events and narratives. Limit to 4 events and 2 narratives. Keep all text under 2 sentences.

Respond ONLY with valid JSON, no extra text, no markdown:
{
  "events": [
    {
      "id": "EVT001",
      "title": "short title",
      "type": "ENERGY_DISRUPTION",
      "actor": "who",
      "target": "who affected",
      "location": "where",
      "description": "max 2 sentences",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "evidence_ref": "short quote"
    }
  ],
  "narratives": [
    {
      "id": "NAR001",
      "title": "narrative title",
      "description": "max 2 sentences",
      "framing": "one sentence",
      "supporting_events": ["EVT001"],
      "confidence": "HIGH|MEDIUM|LOW",
      "source_bias": "PRO_WEST|PRO_RUSSIA|NEUTRAL|UNCLEAR"
    }
  ],
  "event_count": 0,
  "narrative_count": 0,
  "dominant_narrative": "title",
  "timeline_summary": "one sentence"
}`;
}

export async function extractEvents({ evidenceChunks, signals }) {
  if (!evidenceChunks?.length) throw new Error("No evidence chunks provided.");

  console.log(`[STRATOS] Extracting events from ${evidenceChunks.length} chunks...`);
  const rawText = await callAI(buildPrompt(evidenceChunks, signals), { temperature: 0.2 });
  const parsed = parseAIJson(rawText);

  const events = (parsed.events || []).map((e) => ({
    id: e.id || `EVT${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    title: e.title || "Untitled Event",
    type: EVENT_TYPES.includes(e.type) ? e.type : "POLITICAL_DECISION",
    actor: e.actor || "Unknown",
    target: e.target || "Unknown",
    location: e.location || "Unknown",
    description: e.description || "",
    severity: e.severity || "MEDIUM",
    evidence_ref: e.evidence_ref || "",
  }));

  const narratives = (parsed.narratives || []).map((n) => ({
    id: n.id || `NAR${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    title: n.title || "Untitled Narrative",
    description: n.description || "",
    framing: n.framing || "",
    supporting_events: Array.isArray(n.supporting_events) ? n.supporting_events : [],
    confidence: n.confidence || "LOW",
    source_bias: n.source_bias || "UNCLEAR",
  }));

  return {
    events, narratives,
    event_count: events.length,
    narrative_count: narratives.length,
    dominant_narrative: parsed.dominant_narrative || narratives[0]?.title || "None",
    timeline_summary: parsed.timeline_summary || "",
    extracted_at: new Date().toISOString(),
  };
}