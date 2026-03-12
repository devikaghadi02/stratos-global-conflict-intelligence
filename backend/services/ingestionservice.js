import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAG_SCRIPT = path.join(__dirname, "../ml/rag_engine.py");

// Spawns the Python RAG engine and returns parsed JSON output
function runPythonRAG(payload) {
  return new Promise((resolve, reject) => {
    const py = spawn("python", [RAG_SCRIPT]);

    let stdout = "";
    let stderr = "";

    // Send input payload to Python via stdin
    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();

    // Collect output
    py.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    py.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    py.on("close", (code) => {
      if (code !== 0) {
        console.error("[RAG] Python error:\n", stderr);
        return reject(
          new Error(`RAG engine failed (exit ${code}): ${stderr.slice(0, 400)}`)
        );
      }

      try {
        resolve(JSON.parse(stdout));
      } catch (e) {
        reject(
          new Error(`Failed to parse RAG output: ${stdout.slice(0, 300)}`)
        );
      }
    });

    py.on("error", (err) => {
      reject(new Error(`Could not start Python process: ${err.message}`));
    });
  });
}

import { fetchLiveGdeltEvents } from "./fetchers/gdeltFetcher.js";
import { fetchLiveCommodities } from "./fetchers/commodityFetcher.js";
import { fetchLiveMaritime } from "./fetchers/maritimeFetcher.js";

// Main service function — called by the controller
export async function ingestDocument({ text, query }) {
  const effectiveQuery =
    query?.trim() || "geopolitical conflict impact energy trade logistics";

  console.log("[STRATOS] Running RAG Engine on local document...");
  const result = await runPythonRAG({
    mode: "ingest",
    text: text.trim(),
    query: effectiveQuery,
  });

  if (result.error) {
    throw new Error(result.error);
  }

  // Fetch Live Data in parallel
  console.log("[STRATOS] Fetching live supplementary data...");
  const [liveGdelt, liveCommodities, liveMaritime] = await Promise.all([
    fetchLiveGdeltEvents(),
    fetchLiveCommodities(),
    fetchLiveMaritime()
  ]);

  // Combine live data with RAG extracted chunks
  const combinedEvidence = [
    ...result.evidence_chunks,
    ...liveGdelt,
    ...liveCommodities,
    ...liveMaritime
  ];

  // Enrich each evidence chunk with position and word count
  const enrichedEvidence = combinedEvidence.map((chunk, i) => ({
    ...chunk,
    position: i + 1,
    word_count: chunk.text.split(" ").length,
  }));

  return {
    document_stats: result.document_stats,
    evidence_chunks: enrichedEvidence,
    geopolitical_signals: result.geopolitical_signals,
    query_used: effectiveQuery,
    processed_at: new Date().toISOString(),
  };
}