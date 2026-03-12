/**
 * ALL LLM PROMPTS FOR FLOWS 2, 4, 6
 *
 * Prompts are written to force Gemini to return ONLY valid JSON.
 * No preamble. No explanation. No markdown. Just JSON.
 */

/**
 * FLOW 2 — Event & Narrative Extraction
 * Input: document text + evidence chunks from Flow 1
 * Output: structured events + dominant narratives
 */
export function buildEventExtractionPrompt(documentText, evidenceChunks, signals) {
  const chunksText = evidenceChunks
    .map((c, i) => `[EVIDENCE ${i + 1}] (score: ${c.score || 'N/A'}): ${c.text}`)
    .join('\n');
  const signalsText = signals?.length > 0 ? signals.join(', ') : 'GENERAL';

  return `You are a geopolitical intelligence analyst. Analyze the document and evidence below.
Extract all significant geopolitical events and identify dominant narratives.

DOMAIN SIGNALS (focus areas): ${signalsText}

DOCUMENT TEXT:
${documentText}

EVIDENCE CHUNKS FROM INTELLIGENCE DATABASE:
${chunksText}

Return ONLY a valid JSON object. No explanation. No markdown. No preamble.

{
  "events": [
    {
      "id": "evt_001",
      "title": "Brief event title",
      "description": "Detailed description of what happened",
      "date": "YYYY-MM-DD or approximate period",
      "location": "Country or region",
      "actors": ["List", "of", "actors"],
      "category": "MILITARY | ECONOMIC | DIPLOMATIC | HUMANITARIAN | ENERGY | TRADE | POLITICAL",
      "severity": "LOW | MEDIUM | HIGH | CRITICAL",
      "signals": ["relevant", "signal", "tags"],
      "evidence_ids": [1, 2],
      "confidence": 0.85
    }
  ],
  "narratives": [
    {
      "id": "nar_001",
      "title": "Narrative title",
      "description": "What this narrative claims",
      "type": "OFFICIAL | COUNTER | PROPAGANDA | EMERGING | HISTORICAL",
      "actors_promoting": ["actors"],
      "supporting_events": ["evt_001"],
      "credibility_score": 0.7,
      "reach": "LOCAL | REGIONAL | GLOBAL"
    }
  ],
  "summary": {
    "total_events": 0,
    "dominant_signal": "Most prominent signal category",
    "threat_level": "LOW | ELEVATED | HIGH | CRITICAL",
    "key_actors": ["Main actors"],
    "time_range": "Period covered"
  }
}`;
}

export function buildRiskForecastingPrompt(events, impactMatrix, evidenceChunks) {
  return `You are a senior geopolitical risk analyst. Generate risk scenarios from the data below.

EXTRACTED EVENTS:
${JSON.stringify(events, null, 2)}

SYSTEMIC IMPACT MATRIX:
${impactMatrix ? JSON.stringify(impactMatrix, null, 2) : 'Not provided'}

SUPPORTING EVIDENCE:
${evidenceChunks.map((c, i) => `[EVIDENCE ${i + 1}]: ${c.text}`).join('\n')}

Return ONLY valid JSON. No explanation. No markdown.

{
  "risk_scenarios": [
    {
      "id": "risk_001",
      "title": "Risk scenario title",
      "description": "How this risk materializes",
      "probability": 0.75,
      "severity": "LOW | MEDIUM | HIGH | CATASTROPHIC",
      "timeframe": "IMMEDIATE (0-30 days) | SHORT_TERM (1-3 months) | MEDIUM_TERM (3-12 months) | LONG_TERM (1-3 years)",
      "category": "GEOPOLITICAL | ECONOMIC | MILITARY | HUMANITARIAN | ENERGY | CYBER | SOCIAL",
      "triggers": [{ "event": "trigger description", "likelihood": 0.6 }],
      "affected_systems": ["systems"],
      "affected_regions": ["regions"],
      "cascading_effects": ["effects"],
      "early_warning_indicators": ["indicators"],
      "mitigation_options": ["options"],
      "related_events": ["evt_001"],
      "evidence_support": [1],
      "confidence": 0.8
    }
  ],
  "risk_matrix": {
    "critical_risks": [],
    "high_risks": [],
    "medium_risks": [],
    "low_risks": []
  },
  "forecast_summary": {
    "overall_risk_level": "STABLE | ELEVATED | HIGH | CRITICAL",
    "primary_risk_domain": "domain",
    "forecast_horizon": "period",
    "key_uncertainties": ["uncertainties"],
    "recommended_monitoring": ["what to track"],
    "generated_at": "${new Date().toISOString()}"
  }
}`;
}

export function buildAssistantPrompt(userQuestion, context) {
  const { evidenceChunks = [], events = [], impactMatrix = null, riskScenarios = [] } = context;

  return `You are STRATOS, an advanced geopolitical intelligence assistant.
Answer the user's question using ONLY the context below. Always cite sources. Be precise and analytical.

=== USER QUESTION ===
${userQuestion}

=== INTELLIGENCE EVIDENCE (FAISS retrieved) ===
${evidenceChunks.map((c, i) => `[DOC_${i + 1}] ${c.text} (relevance: ${c.score || 'N/A'})`).join('\n')}

=== EXTRACTED EVENTS ===
${events.length > 0 ? events.map(e => `- [${e.id}] ${e.title} (${e.severity}): ${e.description}`).join('\n') : 'None provided'}

=== SYSTEMIC IMPACT MATRIX ===
${impactMatrix ? JSON.stringify(impactMatrix, null, 2) : 'Not provided'}

=== RISK SCENARIOS ===
${riskScenarios.length > 0 ? riskScenarios.map(r => `- [${r.id}] ${r.title} (${r.probability * 100}% probability): ${r.description}`).join('\n') : 'None provided'}

Return ONLY valid JSON. No markdown. No preamble.

{
  "answer": "comprehensive analytical answer",
  "reasoning_steps": ["step 1", "step 2", "step 3"],
  "evidence_citations": [
    { "source_id": "DOC_1", "excerpt": "brief quote", "relevance": "why relevant" }
  ],
  "related_events": ["evt_001"],
  "related_risks": ["risk_001"],
  "confidence_level": "LOW | MEDIUM | HIGH",
  "confidence_score": 0.85,
  "caveats": ["limitations"],
  "follow_up_questions": ["follow up question"],
  "intelligence_gaps": ["missing info"]
}`;
}