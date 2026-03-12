import { extractEvents } from "../services/eventservice.js";

export async function handleEvents(req, res) {
  try {
    const { evidenceChunks, signals } = req.body;

    if (!evidenceChunks || !Array.isArray(evidenceChunks)) {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid 'evidenceChunks' array in request body.",
      });
    }

    if (evidenceChunks.length === 0) {
      return res.status(400).json({
        success: false,
        error: "evidenceChunks array is empty. Run document ingestion first.",
      });
    }

    console.log(
      `[STRATOS] Extracting events — ${evidenceChunks.length} evidence chunks`
    );

    const result = await extractEvents({ evidenceChunks, signals });

    console.log(
      `[STRATOS] Event extraction done — ${result.event_count} events, ${result.narrative_count} narratives`
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[STRATOS] Event extraction error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}