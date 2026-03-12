import fetch from "node-fetch";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEMS = [
  "Energy Supply",
  "Trade & Sanctions",
  "Shipping & Logistics",
  "Food & Commodities",
  "Regional Economy",
  "Military & Security",
];

const SEVERITY_LEVELS = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "NONE"];

function buildPrompt(evidenceChunks, signals) {
  const evidenceText = evidenceChunks
    .map((c, i) => `[CHUNK ${i + 1}] (relevance: ${c.relevance})\n${c.text}`)
    .join("\n\n");

  const signalText =
    signals.length > 0
      ? signals.map((s) => `${s.domain}: ${s.terms.join(", ")} (${s.count} mentions)`).join("\n")
      : "No signals detected.";

  return `You are STRATOS, a geopolitical intelligence analyst.
Analyze the following evidence chunks and determine the systemic impact on global systems.

DETECTED SIGNALS:
${signalText}

EVIDENCE CHUNKS:
${evidenceText}

TASK:
For each of the following global systems, analyze the impact based ONLY on the evidence provided:
${SYSTEMS.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Respond ONLY with a valid JSON object. No extra text. No markdown. No code fences:
{
  "summary": "2-3 sentence overall impact summary",
  "impacts": [
    {
      "system": "system name",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW|NONE",
      "confidence": "HIGH|MEDIUM|LOW",
      "headline": "one line impact description",
      "reasoning": "2-3 sentences explaining why based on evidence",
      "evidence_refs": ["direct quote or phrase from evidence chunks"],
      "affected_regions": ["list of regions or countries affected"]
    }
  ],
  "most_affected_system": "name of most impacted system",
  "overall_severity": "CRITICAL|HIGH|MEDIUM|LOW"
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
        generationConfig: { temperature: 0.2, maxOutputTokens: 4096 },
      }),
    });

    if (response.status === 429) {
      console.log(`[STRATOS] Rate limited. Waiting 10s...`);
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

export async function analyzeImpact({ evidenceChunks, signals, geminiKey }) {
  if (!evidenceChunks || evidenceChunks.length === 0) {
    throw new Error("No evidence chunks provided.");
  }

  const prompt = buildPrompt(evidenceChunks, signals || []);
  console.log(`[STRATOS] Sending ${evidenceChunks.length} chunks to Gemini...`);

  const rawText = await callGemini(prompt, geminiKey);
  const parsed = parseGeminiResponse(rawText);

  const impacts = (parsed.impacts || []).map((item) => ({
    system: item.system || "Unknown",
    severity: SEVERITY_LEVELS.includes(item.severity) ? item.severity : "LOW",
    confidence: item.confidence || "LOW",
    headline: item.headline || "No headline provided",
    reasoning: item.reasoning || "No reasoning provided",
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