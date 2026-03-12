import { ingestDocument } from "./ingestionservice.js";
import { extractEvents } from "./eventservice.js";
import { analyzeImpact } from "./impactservice.js";
import { forecastRisks } from "./riskservice.js";

/**
 * Master orchestrator — runs Flow 1, then Flow 2 + Flow 3 in parallel,
 * then Flow 4 using Flow 3 output.
 * Returns combined result from all four flows in one response.
 */
export async function runFullAnalysis({ text, query }) {
  console.log("[STRATOS] Starting full analysis pipeline...");

  // ─────────────────────────────────────────
  // FLOW 1 — Document ingestion + RAG
  // ─────────────────────────────────────────
  console.log("[STRATOS] Flow 1 — Ingesting document...");
  const ingestResult = await ingestDocument({ text, query });
  console.log(
    `[STRATOS] Flow 1 done — ${ingestResult.document_stats.total_chunks} chunks`
  );

  const { evidence_chunks, geopolitical_signals } = ingestResult;

  // ─────────────────────────────────────────
  // FLOW 2 + FLOW 3 — Run in parallel
  // ─────────────────────────────────────────
  console.log("[STRATOS] Flow 2 + Flow 3 — Running in parallel...");

  const [eventResult, impactResult] = await Promise.allSettled([
    extractEvents({ evidenceChunks: evidence_chunks, signals: geopolitical_signals }),
    analyzeImpact({ evidenceChunks: evidence_chunks, signals: geopolitical_signals }),
  ]);

  // Handle Flow 2 result
  const events =
    eventResult.status === "fulfilled"
      ? eventResult.value
      : { error: eventResult.reason?.message, events: [], narratives: [] };

  if (eventResult.status === "fulfilled") {
    console.log(
      `[STRATOS] Flow 2 done — ${events.event_count} events, ${events.narrative_count} narratives`
    );
  } else {
    console.error("[STRATOS] Flow 2 failed:", eventResult.reason?.message);
  }

  // Handle Flow 3 result
  const impact =
    impactResult.status === "fulfilled"
      ? impactResult.value
      : { error: impactResult.reason?.message, impacts: [] };

  if (impactResult.status === "fulfilled") {
    console.log(
      `[STRATOS] Flow 3 done — overall severity: ${impact.overall_severity}`
    );
  } else {
    console.error("[STRATOS] Flow 3 failed:", impactResult.reason?.message);
  }

  // ─────────────────────────────────────────
  // FLOW 4 — Risk forecasting (needs Flow 3 output)
  // ─────────────────────────────────────────
  let riskResult = { error: null };

  if (impactResult.status === "fulfilled" && impact.impacts.length > 0) {
    console.log("[STRATOS] Flow 4 — Forecasting risks...");
    try {
      riskResult = await forecastRisks({
        impactData: impact,
        evidenceChunks: evidence_chunks,
        signals: geopolitical_signals,
      });
      console.log(
        `[STRATOS] Flow 4 done — ${riskResult.risk_count} risks, level: ${riskResult.risk_level}`
      );
    } catch (err) {
      console.error("[STRATOS] Flow 4 failed:", err.message);
      riskResult = { error: err.message, risks: [] };
    }
  } else {
    console.warn("[STRATOS] Flow 4 skipped — Flow 3 did not produce impact data.");
    riskResult = { error: "Skipped — no impact data available", risks: [] };
  }

  // ─────────────────────────────────────────
  // Return combined result
  // ─────────────────────────────────────────
  return {
    // Flow 1
    ingestion: {
      document_stats: ingestResult.document_stats,
      evidence_chunks: ingestResult.evidence_chunks,
      geopolitical_signals: ingestResult.geopolitical_signals,
      query_used: ingestResult.query_used,
      processed_at: ingestResult.processed_at,
    },
    // Flow 2
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
    // Flow 3
    impact: {
      summary: impact.summary || null,
      overall_severity: impact.overall_severity || null,
      most_affected_system: impact.most_affected_system || null,
      impacts: impact.impacts || [],
      systems_analyzed: impact.systems_analyzed || 0,
      analyzed_at: impact.analyzed_at || null,
      error: impact.error || null,
    },
    // Flow 4
    forecast: {
      risk_summary: riskResult.risk_summary || null,
      risk_level: riskResult.risk_level || null,
      risks: riskResult.risks || [],
      risk_count: riskResult.risk_count || 0,
      highest_probability_risk: riskResult.highest_probability_risk || null,
      most_severe_risk: riskResult.most_severe_risk || null,
      stabilization_scenario: riskResult.stabilization_scenario || null,
      forecasted_at: riskResult.forecasted_at || null,
      error: riskResult.error || null,
    },
    // Meta
    pipeline_status: {
      flow1: "success",
      flow2: eventResult.status === "fulfilled" ? "success" : "failed",
      flow3: impactResult.status === "fulfilled" ? "success" : "failed",
      flow4: riskResult.error ? "failed" : "success",
    },
    completed_at: new Date().toISOString(),
  };
}