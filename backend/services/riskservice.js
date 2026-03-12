import fetch from "node-fetch";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";

const RISK_CATEGORIES = [
  "ENERGY_CRISIS",
  "SUPPLY_CHAIN_COLLAPSE",
  "FINANCIAL_CONTAGION",
  "HUMANITARIAN_EMERGENCY",
  "MILITARY_ESCALATION",
  "FOOD_SECURITY_THREAT",
  "DIPLOMATIC_BREAKDOWN",
  "INFRASTRUCTURE_FAILURE",
];

const TIMEFRAMES = ["0-30 days", "30-60 days", "60-90 days", "90+ days"];

function buildPrompt(impactData, evidenceChunks, signals) {
  const impactText = impactData.impacts
    .filter((i) => i.severity !== "NONE")
    .map((i) => `[${i.system}] ${i.severity}: ${i.headline}`)
    .join("\n");

  const signalText =
    signals && signals.length > 0
      ? signals.map((s) => `${s.domain}: ${s.terms.join(", ")}`).join("\n")
      : "No signals.";

  return `You are STRATOS, a geopolitical risk forecasting analyst.

CURRENT OVERALL SEVERITY: ${impactData.overall_severity}
MOST AFFECTED SYSTEM: ${impactData.most_affected_system}

CURRENT IMPACTS:
${impactText}

SIGNALS:
${signalText}

TASK: Forecast exactly 4 risk scenarios. Keep all text fields short — max 2 sentences each.

RISK CATEGORIES: ${RISK_CATEGORIES.join(", ")}
TIMEFRAMES: ${TIMEFRAMES.join(", ")}

Respond ONLY with valid JSON. No extra text. No markdown. No code fences:
{
  "risk_summary": "max 2 sentences",
  "risk_level": "CRITICAL|HIGH|MEDIUM|LOW",
  "risks": [
    {
      "id": "RSK001",
      "title": "short title",
      "category": "one of RISK_CATEGORIES",
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
        generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
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

export async function forecastRisks({ impactData, evidenceChunks, signals, geminiKey }) {
  if (!impactData || !impactData.impacts || impactData.impacts.length === 0) {
    throw new Error("No impact data provided.");
  }

  const prompt = buildPrompt(impactData, evidenceChunks || [], signals || []);
  console.log(`[STRATOS] Forecasting risks from ${impactData.impacts.length} impact systems...`);

  const rawText = await callGemini(prompt, geminiKey);
  const parsed = parseGeminiResponse(rawText);

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