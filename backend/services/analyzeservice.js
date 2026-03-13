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

  // ── FLOW 2 + FLOW 3 — Parallel (different OpenRouter requests)
  console.log("[STRATOS] Flow 2 + Flow 3 — Running in parallel...");
  const [eventResult, impactResult] = await Promise.allSettled([
    extractEvents({ evidenceChunks: evidence_chunks, signals: geopolitical_signals }),
    analyzeImpact({ evidenceChunks: evidence_chunks, signals: geopolitical_signals }),
  ]);

  const events = eventResult.status === "fulfilled"
    ? eventResult.value
    : { events: [], narratives: [], event_count: 0, narrative_count: 0, error: eventResult.reason?.message };

  const impact = impactResult.status === "fulfilled"
    ? impactResult.value
    : { impacts: [], error: impactResult.reason?.message };

  if (eventResult.status === "fulfilled") {
    console.log(`[STRATOS] Flow 2 done — ${events.event_count} events, ${events.narrative_count} narratives`);
  } else {
    console.error("[STRATOS] Flow 2 failed:", eventResult.reason?.message);
  }

  if (impactResult.status === "fulfilled") {
    console.log(`[STRATOS] Flow 3 done — overall severity: ${impact.overall_severity}`);
  } else {
    console.error("[STRATOS] Flow 3 failed:", impactResult.reason?.message);
  }

  await wait(2000);

  // ── FLOW 4 + FLOW 5 — Parallel
  console.log("[STRATOS] Flow 4 + Flow 5 — Running in parallel...");
  const narrativesForCheck = events.narratives || [];

  const [riskResult, narrativeResult] = await Promise.allSettled([
    impact.impacts?.length > 0
      ? forecastRisks({ impactData: impact, evidenceChunks: evidence_chunks, signals: geopolitical_signals })
      : Promise.reject(new Error("Skipped — no impact data")),
    narrativesForCheck.length > 0
      ? checkNarratives({ narratives: narrativesForCheck, evidenceChunks: evidence_chunks })
      : Promise.reject(new Error("Skipped — no narratives")),
  ]);

  const forecast = riskResult.status === "fulfilled"
    ? riskResult.value
    : { risks: [], error: riskResult.reason?.message };

  const narrativeCheck = narrativeResult.status === "fulfilled"
    ? narrativeResult.value
    : { narrative_checks: [], error: narrativeResult.reason?.message };

  if (riskResult.status === "fulfilled") {
    console.log(`[STRATOS] Flow 4 done — ${forecast.risk_count} risks, level: ${forecast.risk_level}`);
  } else {
    console.error("[STRATOS] Flow 4 failed:", riskResult.reason?.message);
  }

  if (narrativeResult.status === "fulfilled") {
    console.log(`[STRATOS] Flow 5 done — integrity: ${narrativeCheck.overall_narrative_integrity}`);
  } else {
    console.error("[STRATOS] Flow 5 failed:", narrativeResult.reason?.message);
  }

  const flow2Status = eventResult.status === "fulfilled" ? "success" : "failed";
  const flow3Status = impactResult.status === "fulfilled" ? "success" : "failed";
  const flow4Status = riskResult.status === "fulfilled" ? "success" : "failed";
  const flow5Status = narrativeResult.status === "fulfilled" ? "success" : "failed";

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