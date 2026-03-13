import { ingestDocument } from "./ingestionservice.js";
import { extractEvents } from "./eventservice.js";
import { analyzeImpact } from "./impactservice.js";
import { forecastRisks } from "./riskservice.js";
import { checkNarratives } from "./narrativeservice.js";

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function runFullAnalysis({ text, query }) {
  console.log("[STRATOS] Starting full analysis pipeline...");

  // ── FLOW 1 — Document ingestion (no API call)
  console.log("[STRATOS] Flow 1 — Ingesting document...");
  const ingestResult = await ingestDocument({ text, query });
  console.log(`[STRATOS] Flow 1 done — ${ingestResult.document_stats.total_chunks} chunks`);

  const { evidence_chunks, geopolitical_signals } = ingestResult;

  // ── FLOW 2 — Event Extraction
  console.log("[STRATOS] Flow 2 — Extracting events...");
  let events = { events: [], narratives: [], event_count: 0, narrative_count: 0, error: null };
  try {
    events = await extractEvents({ evidenceChunks: evidence_chunks, signals: geopolitical_signals });
    console.log(`[STRATOS] Flow 2 done — ${events.event_count} events`);
  } catch (err) {
    events.error = err.message;
    console.error("[STRATOS] Flow 2 failed:", err.message);
  }

  await wait(2000); // Safety gap

  // ── FLOW 3 — Impact Analysis
  console.log("[STRATOS] Flow 3 — Analyzing impact...");
  let impact = { impacts: [], error: null };
  try {
    impact = await analyzeImpact({ evidenceChunks: evidence_chunks, signals: geopolitical_signals });
    console.log(`[STRATOS] Flow 3 done — overall severity: ${impact.overall_severity}`);
  } catch (err) {
    impact.error = err.message;
    console.error("[STRATOS] Flow 3 failed:", err.message);
  }

  await wait(2000);

  // ── FLOW 4 — Risk Forecasting
  console.log("[STRATOS] Flow 4 — Forecasting risks...");
  let forecast = { risks: [], error: null };
  if (impact.impacts?.length > 0) {
    try {
      forecast = await forecastRisks({ impactData: impact, evidenceChunks: evidence_chunks, signals: geopolitical_signals });
      console.log(`[STRATOS] Flow 4 done — ${forecast.risk_count} risks`);
    } catch (err) {
      forecast.error = err.message;
      console.error("[STRATOS] Flow 4 failed:", err.message);
    }
  }

  await wait(2000);

  // ── FLOW 5 — Narrative Analysis
  console.log("[STRATOS] Flow 5 — Checking narratives...");
  let narrativeCheck = { narrative_checks: [], error: null };
  const narrativesForCheck = events.narratives || [];
  if (narrativesForCheck.length > 0) {
    try {
      narrativeCheck = await checkNarratives({ narratives: narrativesForCheck, evidenceChunks: evidence_chunks });
      console.log(`[STRATOS] Flow 5 done — integrity: ${narrativeCheck.overall_narrative_integrity}`);
    } catch (err) {
      narrativeCheck.error = err.message;
      console.error("[STRATOS] Flow 5 failed:", err.message);
    }
  }

  const flow2Status = events.error ? "failed" : "success";
  const flow3Status = impact.error ? "failed" : "success";
  const flow4Status = forecast.error ? "failed" : "success";
  const flow5Status = narrativeCheck.error ? "failed" : "success";

  console.log(`[STRATOS] Pipeline complete — Flow1: success | Flow2: ${flow2Status} | Flow3: ${flow3Status} | Flow4: ${flow4Status} | Flow5: ${flow5Status}`);

  return {
    ingestion: {
      document_stats: ingestResult.document_stats,
      evidence_chunks: ingestResult.evidence_chunks,
      geopolitical_signals: ingestResult.geopolitical_signals,
      query_used: ingestResult.query_used,
      processed_at: ingestResult.processed_at,
    },
    intelligence: {
      events: events.events || [],
      narratives: events.narratives || [],
      event_count: events.event_count || 0,
      narrative_count: events.narrative_count || 0,
      dominant_narrative: events.dominant_narrative || null,
      timeline_summary: events.timeline_summary || null,
      extracted_at: events.extracted_at || null,
      error: events.error || null,
    },
    impact: {
      summary: impact.summary || null,
      overall_severity: impact.overall_severity || null,
      most_affected_system: impact.most_affected_system || null,
      impacts: impact.impacts || [],
      systems_analyzed: impact.systems_analyzed || 0,
      analyzed_at: impact.analyzed_at || null,
      error: impact.error || null,
    },
    forecast: {
      risk_summary: forecast.risk_summary || null,
      risk_level: forecast.risk_level || null,
      risks: forecast.risks || [],
      risk_count: forecast.risk_count || 0,
      highest_probability_risk: forecast.highest_probability_risk || null,
      most_severe_risk: forecast.most_severe_risk || null,
      stabilization_scenario: forecast.stabilization_scenario || null,
      forecasted_at: forecast.forecasted_at || null,
      error: forecast.error || null,
    },
    narrative_reality: {
      narrative_checks: narrativeCheck.narrative_checks || [],
      narratives_analyzed: narrativeCheck.narratives_analyzed || 0,
      overall_narrative_integrity: narrativeCheck.overall_narrative_integrity || null,
      most_misleading_narrative: narrativeCheck.most_misleading_narrative || null,
      most_accurate_narrative: narrativeCheck.most_accurate_narrative || null,
      analysis_summary: narrativeCheck.analysis_summary || null,
      analyzed_at: narrativeCheck.analyzed_at || null,
      error: narrativeCheck.error || null,
    },
    pipeline_status: {
      flow1: "success",
      flow2: flow2Status,
      flow3: flow3Status,
      flow4: flow4Status,
      flow5: flow5Status,
    },
    completed_at: new Date().toISOString(),
  };
}