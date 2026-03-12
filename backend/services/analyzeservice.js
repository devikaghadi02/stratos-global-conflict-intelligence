import { ingestDocument } from "./ingestionservice.js";
import { extractEvents } from "./eventservice.js";
import { analyzeImpact } from "./impactservice.js";
import { forecastRisks } from "./riskservice.js";
import { checkNarratives } from "./narrativeservice.js";

/**
 * Master orchestrator — runs all 5 flows in sequence/parallel.
 * Flow 1 → Flow 2 + Flow 3 (parallel) → Flow 4 + Flow 5 (parallel)
 */
export async function runFullAnalysis({ text, query }) {
  console.log("[STRATOS] Starting full analysis pipeline...");

  // ─────────────────────────────────────────
  // FLOW 1 — Document ingestion + RAG
  // ─────────────────────────────────────────
  console.log("[STRATOS] Flow 1 — Ingesting document...");
  const ingestResult = await ingestDocument({ text, query });
  console.log(`[STRATOS] Flow 1 done — ${ingestResult.document_stats.total_chunks} chunks`);

  const { evidence_chunks, geopolitical_signals } = ingestResult;

  // ─────────────────────────────────────────
  // FLOW 2 + FLOW 3 — Run in parallel
  // ─────────────────────────────────────────
  console.log("[STRATOS] Flow 2 + Flow 3 — Running in parallel...");

  const [eventResult, impactResult] = await Promise.allSettled([
    extractEvents({ evidenceChunks: evidence_chunks, signals: geopolitical_signals }),
    analyzeImpact({ evidenceChunks: evidence_chunks, signals: geopolitical_signals }),
  ]);

  const events =
    eventResult.status === "fulfilled"
      ? eventResult.value
      : { error: eventResult.reason?.message, events: [], narratives: [] };

  const impact =
    impactResult.status === "fulfilled"
      ? impactResult.value
      : { error: impactResult.reason?.message, impacts: [] };

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

  // ─────────────────────────────────────────
  // FLOW 4 + FLOW 5 — Run in parallel
  // ─────────────────────────────────────────
  console.log("[STRATOS] Flow 4 + Flow 5 — Running in parallel...");

  const narrativesForCheck = events.narratives || [];
  const hasImpact = impactResult.status === "fulfilled" && impact.impacts?.length > 0;
  const hasNarratives = narrativesForCheck.length > 0;

  const [riskResult, narrativeResult] = await Promise.allSettled([
    hasImpact
      ? forecastRisks({ impactData: impact, evidenceChunks: evidence_chunks, signals: geopolitical_signals })
      : Promise.reject(new Error("Skipped — no impact data")),
    hasNarratives
      ? checkNarratives({ narratives: narrativesForCheck, evidenceChunks: evidence_chunks })
      : Promise.reject(new Error("Skipped — no narratives")),
  ]);

  const forecast =
    riskResult.status === "fulfilled"
      ? riskResult.value
      : { error: riskResult.reason?.message, risks: [] };

  const narrativeCheck =
    narrativeResult.status === "fulfilled"
      ? narrativeResult.value
      : { error: narrativeResult.reason?.message, narrative_checks: [] };

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

  // ─────────────────────────────────────────
  // Return combined result
  // ─────────────────────────────────────────
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
      flow2: eventResult.status === "fulfilled" ? "success" : "failed",
      flow3: impactResult.status === "fulfilled" ? "success" : "failed",
      flow4: riskResult.status === "fulfilled" ? "success" : "failed",
      flow5: narrativeResult.status === "fulfilled" ? "success" : "failed",
    },
    completed_at: new Date().toISOString(),
  };
}