import dotenv from "dotenv";
dotenv.config();

import { ingestDocument } from "./ingestionservice.js";
import { extractEvents } from "./eventservice.js";
import { analyzeImpact } from "./impactservice.js";
import { forecastRisks } from "./riskservice.js";
import { checkNarratives } from "./narrativeservice.js";

// ─────────────────────────────────────────
// Gemini API key rotation
// Rotates between available keys to avoid rate limiting
// ─────────────────────────────────────────

let keyIndex = 0;

export function getNextGeminiKey() {
  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
  ].filter(Boolean);

  const key = keys[keyIndex % keys.length];
  const display = keyIndex % keys.length + 1;
  keyIndex++;
  console.log(`[STRATOS] Using Gemini key ${display} of ${keys.length}`);
  return key;
}

// Small delay between Gemini calls to avoid rate limits
function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─────────────────────────────────────────
// Master pipeline orchestrator
// Runs flows sequentially to avoid rate limiting
// ─────────────────────────────────────────

export async function runFullAnalysis({ text, query }) {
  console.log("[STRATOS] Starting full analysis pipeline...");

  // ─────────────────────────────────────────
  // FLOW 1 — Document ingestion + RAG
  // No Gemini call — runs instantly
  // ─────────────────────────────────────────
  console.log("[STRATOS] Flow 1 — Ingesting document...");
  const ingestResult = await ingestDocument({ text, query });
  console.log(`[STRATOS] Flow 1 done — ${ingestResult.document_stats.total_chunks} chunks`);

  const { evidence_chunks, geopolitical_signals } = ingestResult;

  // ─────────────────────────────────────────
  // FLOW 2 — Event & narrative extraction
  // ─────────────────────────────────────────
  console.log("[STRATOS] Flow 2 — Extracting events...");
  let events = { events: [], narratives: [], event_count: 0, narrative_count: 0, error: null };
  let flow2Status = "failed";

  try {
    events = await extractEvents({
      evidenceChunks: evidence_chunks,
      signals: geopolitical_signals,
      geminiKey: getNextGeminiKey(),
    });
    flow2Status = "success";
    console.log(`[STRATOS] Flow 2 done — ${events.event_count} events, ${events.narrative_count} narratives`);
  } catch (err) {
    events.error = err.message;
    console.error("[STRATOS] Flow 2 failed:", err.message);
  }

  await wait(3000);

  // ─────────────────────────────────────────
  // FLOW 3 — Systemic impact analysis
  // ─────────────────────────────────────────
  console.log("[STRATOS] Flow 3 — Analyzing impact...");
  let impact = { impacts: [], error: null };
  let flow3Status = "failed";

  try {
    impact = await analyzeImpact({
      evidenceChunks: evidence_chunks,
      signals: geopolitical_signals,
      geminiKey: getNextGeminiKey(),
    });
    flow3Status = "success";
    console.log(`[STRATOS] Flow 3 done — overall severity: ${impact.overall_severity}`);
  } catch (err) {
    impact.error = err.message;
    console.error("[STRATOS] Flow 3 failed:", err.message);
  }

  await wait(3000);

  // ─────────────────────────────────────────
  // FLOW 4 — Risk forecasting
  // ─────────────────────────────────────────
  console.log("[STRATOS] Flow 4 — Forecasting risks...");
  let forecast = { risks: [], error: null };
  let flow4Status = "failed";

  if (flow3Status === "success" && impact.impacts?.length > 0) {
    try {
      forecast = await forecastRisks({
        impactData: impact,
        evidenceChunks: evidence_chunks,
        signals: geopolitical_signals,
        geminiKey: getNextGeminiKey(),
      });
      flow4Status = "success";
      console.log(`[STRATOS] Flow 4 done — ${forecast.risk_count} risks, level: ${forecast.risk_level}`);
    } catch (err) {
      forecast.error = err.message;
      console.error("[STRATOS] Flow 4 failed:", err.message);
    }
  } else {
    forecast.error = "Skipped — no impact data";
    console.warn("[STRATOS] Flow 4 skipped — no impact data");
  }

  await wait(3000);

  // ─────────────────────────────────────────
  // FLOW 5 — Narrative vs Reality
  // ─────────────────────────────────────────
  console.log("[STRATOS] Flow 5 — Checking narratives...");
  let narrativeCheck = { narrative_checks: [], error: null };
  let flow5Status = "failed";

  const narrativesForCheck = events.narratives || [];

  if (narrativesForCheck.length > 0) {
    try {
      narrativeCheck = await checkNarratives({
        narratives: narrativesForCheck,
        evidenceChunks: evidence_chunks,
        geminiKey: getNextGeminiKey(),
      });
      flow5Status = "success";
      console.log(`[STRATOS] Flow 5 done — integrity: ${narrativeCheck.overall_narrative_integrity}`);
    } catch (err) {
      narrativeCheck.error = err.message;
      console.error("[STRATOS] Flow 5 failed:", err.message);
    }
  } else {
    narrativeCheck.error = "Skipped — no narratives to check";
    console.warn("[STRATOS] Flow 5 skipped — no narratives");
  }

  // ─────────────────────────────────────────
  // Return combined result
  // ─────────────────────────────────────────
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