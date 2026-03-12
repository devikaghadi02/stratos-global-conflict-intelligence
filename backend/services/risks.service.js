import { callGemini } from '../utils/geminiClient.js';
import { parseLLMJson } from '../utils/jsonParser.js';
import { buildRiskForecastingPrompt } from '../utils/promptBuilder.js';

export async function forecastRisks(events, impactMatrix, evidenceChunks) {
  if (!Array.isArray(events) || events.length === 0) throw new Error('events array required');
  if (!Array.isArray(evidenceChunks)) evidenceChunks = [];

  console.log(`[Flow4] Forecasting risks for ${events.length} events, ${evidenceChunks.length} chunks`);

  const prompt = buildRiskForecastingPrompt(events, impactMatrix, evidenceChunks);
  const rawResponse = await callGemini(prompt, { temperature: 0.3, maxTokens: 4096 });

  let parsed;
  try { parsed = parseLLMJson(rawResponse); }
  catch (e) { throw new Error(`JSON parse failed in Flow4: ${e.message}`); }

  parsed.risk_scenarios = parsed.risk_scenarios || [];
  parsed.risk_matrix = parsed.risk_matrix || {
    critical_risks: [], high_risks: [], medium_risks: [], low_risks: []
  };
  parsed.forecast_summary = parsed.forecast_summary || {
    overall_risk_level: 'UNKNOWN',
    generated_at: new Date().toISOString()
  };

  if (!parsed.risk_matrix.critical_risks.length && !parsed.risk_matrix.high_risks.length) {
    parsed.risk_scenarios.forEach(r => {
      const p = r.probability || 0;
      if (p >= 0.8) parsed.risk_matrix.critical_risks.push(r.id);
      else if (p >= 0.6) parsed.risk_matrix.high_risks.push(r.id);
      else if (p >= 0.35) parsed.risk_matrix.medium_risks.push(r.id);
      else parsed.risk_matrix.low_risks.push(r.id);
    });
  }

  parsed.metadata = {
    flow: 'Flow4-RiskForecasting',
    events_analyzed: events.length,
    evidence_chunks_used: evidenceChunks.length,
    impact_matrix_provided: !!impactMatrix,
    total_risks_generated: parsed.risk_scenarios.length,
    processed_at: new Date().toISOString()
  };

  console.log(`[Flow4] Generated ${parsed.risk_scenarios.length} risk scenarios`);
  return parsed;
}