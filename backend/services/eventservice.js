import fetch from "node-fetch";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";

const EVENT_TYPES = [
  "MILITARY_ACTION",
  "DIPLOMATIC_EVENT",
  "ECONOMIC_SANCTION",
  "ENERGY_DISRUPTION",
  "TRADE_RESTRICTION",
  "HUMANITARIAN_CRISIS",
  "POLITICAL_DECISION",
  "INFRASTRUCTURE_ATTACK",
];

function buildPrompt(evidenceChunks, signals) {
  const evidenceText = evidenceChunks
    .map((c, i) => `[CHUNK ${i + 1}] (relevance: ${c.relevance})\n${c.text}`)
    .join("\n\n");

  const signalText =
    signals && signals.length > 0
      ? signals.map((s) => `${s.domain}: ${s.terms.join(", ")} (${s.count} mentions)`).join("\n")
      : "No signals detected.";

  return `You are STRATOS, a geopolitical intelligence analyst.

Analyze the following evidence chunks and extract events and narratives.

DETECTED SIGNALS:
${signalText}

EVIDENCE CHUNKS:
${evidenceText}

EVENT TYPES: ${EVENT_TYPES.join(", ")}

IMPORTANT: Keep descriptions short — max 2 sentences each. Limit to 4 events and 2 narratives maximum.

Respond ONLY with a valid JSON object. No extra text. No markdown. No code fences:
{
  "events": [
    {
      "id": "EVT001",
      "title": "short event title",
      "type": "one of the EVENT_TYPES",
      "actor": "who is doing this",
      "target": "who is affected",
      "location": "where",
      "description": "max 2 sentences",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "evidence_ref": "short quote from evidence"
    }
  ],
  "narratives": [
    {
      "id": "NAR001",
      "title": "narrative title",
      "description": "max 2 sentences",
      "framing": "one sentence framing",
      "supporting_events": ["EVT001"],
      "confidence": "HIGH|MEDIUM|LOW",
      "source_bias": "PRO_WEST|PRO_RUSSIA|NEUTRAL|UNCLEAR"
    }
  ],
  "event_count": 0,
  "narrative_count": 0,
  "dominant_narrative": "title of most prominent narrative",
  "timeline_summary": "one sentence summary"
}`;
}

async function callGemini(prompt, apiKey, retries = 3) {
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key) throw new Error("No Gemini API key available.");

  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`[STRATOS] Calling Gemini — attempt ${attempt}/${retries}`);

    const response = await fetch(`${GEMINI_API_URL}?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
      }),
    });

    if (response.status === 429) {
      const errBody = await response.text();
      console.log(`[STRATOS] Rate limited (429). Body: ${errBody}`);
      console.log(`[STRATOS] Waiting 10s...`);
      await new Promise((r) => setTimeout(r, 20000));
      continue;
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API error: ${response.status} — ${err.slice(0, 300)}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Gemini returned empty response.");
    return rawText;
  }

  throw new Error("Gemini API failed after 3 retries.");
}

function parseGeminiResponse(rawText) {
  let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error(`No JSON found: ${cleaned.slice(0, 200)}`);
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch (e) {
    throw new Error(`Failed to parse JSON: ${cleaned.slice(start, start + 200)}`);
  }
}

export async function extractEvents({ evidenceChunks, signals, geminiKey }) {
  if (!evidenceChunks || evidenceChunks.length === 0) {
    throw new Error("No evidence chunks provided.");
  }

  const prompt = buildPrompt(evidenceChunks, signals || []);
  console.log(`[STRATOS] Extracting events from ${evidenceChunks.length} chunks...`);

  const rawText = await callGemini(prompt, geminiKey);
  const parsed = parseGeminiResponse(rawText);

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
    events,
    narratives,
    event_count: events.length,
    narrative_count: narratives.length,
    dominant_narrative: parsed.dominant_narrative || narratives[0]?.title || "None",
    timeline_summary: parsed.timeline_summary || "",
    extracted_at: new Date().toISOString(),
  };
}