import fetch from "node-fetch";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const ALIGNMENT_LEVELS = ["ALIGNED", "PARTIAL", "CONTRADICTED", "UNVERIFIABLE"];

// ─────────────────────────────────────────
// Build the Gemini prompt
// ─────────────────────────────────────────

function buildPrompt(narratives, evidenceChunks) {
  const narrativeText = narratives
    .map(
      (n, i) =>
        `[NARRATIVE ${i + 1}] ID: ${n.id}\nTitle: ${n.title}\nDescription: ${n.description}\nFraming: ${n.framing}\nBias: ${n.source_bias}`
    )
    .join("\n\n");

  const evidenceText = evidenceChunks
    .map((c, i) => `[EVIDENCE ${i + 1}]: ${c.text}`)
    .join("\n\n");

  return `You are STRATOS, a geopolitical narrative verification analyst.

Your task is to compare each narrative against the available evidence and determine if the narrative is supported, partially supported, contradicted, or unverifiable.

NARRATIVES TO VERIFY:
${narrativeText}

AVAILABLE EVIDENCE:
${evidenceText}

ALIGNMENT LEVELS:
- ALIGNED: narrative is fully supported by evidence
- PARTIAL: narrative is partially supported but exaggerated or incomplete
- CONTRADICTED: narrative directly conflicts with evidence
- UNVERIFIABLE: not enough evidence to confirm or deny

IMPORTANT: Keep all text fields short — max 2 sentences. Analyze each narrative separately.

Respond ONLY with valid JSON. No extra text. No markdown. No code fences:
{
  "narrative_checks": [
    {
      "narrative_id": "NAR001",
      "narrative_title": "title of narrative",
      "alignment": "ALIGNED|PARTIAL|CONTRADICTED|UNVERIFIABLE",
      "alignment_score": 85,
      "verdict": "one sentence verdict",
      "supporting_evidence": ["short quote from evidence that supports this narrative"],
      "contradicting_evidence": ["short quote from evidence that contradicts this narrative"],
      "divergence_explanation": "max 2 sentences explaining the gap between narrative and reality",
      "misleading_elements": ["specific element of the narrative that is misleading or exaggerated"],
      "reality_check": "max 2 sentences on what the evidence actually shows"
    }
  ],
  "overall_narrative_integrity": "HIGH|MEDIUM|LOW",
  "most_misleading_narrative": "title of most misleading narrative or null",
  "most_accurate_narrative": "title of most accurate narrative or null",
  "analysis_summary": "max 2 sentences overall summary"
}`;
}

// ─────────────────────────────────────────
// Call Gemini API with retry
// ─────────────────────────────────────────

async function callGemini(prompt, retries = 3) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not set in your .env file.");
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`[STRATOS] Calling Gemini — attempt ${attempt}/${retries}`);

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (response.status === 429) {
      console.log(`[STRATOS] Rate limited. Waiting 10s before retry...`);
      await new Promise((r) => setTimeout(r, 10000));
      continue;
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API error: ${response.status} — ${err.slice(0, 300)}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error("Gemini returned an empty response.");

    return rawText;
  }

  throw new Error("Gemini API failed after 3 retries.");
}

// ─────────────────────────────────────────
// Parse Gemini JSON response safely
// ─────────────────────────────────────────

function parseGeminiResponse(rawText) {
  let cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error(`No JSON found in Gemini response: ${cleaned.slice(0, 200)}`);
  }

  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch (e) {
    throw new Error(`Failed to parse Gemini JSON: ${cleaned.slice(start, start + 200)}`);
  }
}

// ─────────────────────────────────────────
// Main service function
// ─────────────────────────────────────────

export async function checkNarratives({ narratives, evidenceChunks }) {
  if (!narratives || narratives.length === 0) {
    throw new Error("No narratives provided. Run event extraction first.");
  }

  if (!evidenceChunks || evidenceChunks.length === 0) {
    throw new Error("No evidence chunks provided. Run document ingestion first.");
  }

  console.log(
    `[STRATOS] Checking ${narratives.length} narratives against ${evidenceChunks.length} evidence chunks...`
  );

  const prompt = buildPrompt(narratives, evidenceChunks);
  const rawText = await callGemini(prompt);
  const parsed = parseGeminiResponse(rawText);

  // Sanitize narrative checks
  const narrativeChecks = (parsed.narrative_checks || []).map((check) => ({
    narrative_id: check.narrative_id || "Unknown",
    narrative_title: check.narrative_title || "Unknown",
    alignment: ALIGNMENT_LEVELS.includes(check.alignment)
      ? check.alignment
      : "UNVERIFIABLE",
    alignment_score: Math.min(100, Math.max(0, Number(check.alignment_score) || 50)),
    verdict: check.verdict || "",
    supporting_evidence: Array.isArray(check.supporting_evidence)
      ? check.supporting_evidence
      : [],
    contradicting_evidence: Array.isArray(check.contradicting_evidence)
      ? check.contradicting_evidence
      : [],
    divergence_explanation: check.divergence_explanation || "",
    misleading_elements: Array.isArray(check.misleading_elements)
      ? check.misleading_elements
      : [],
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