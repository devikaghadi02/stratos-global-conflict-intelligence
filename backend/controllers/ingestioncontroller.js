import { ingestDocument } from "../services/ingestionservice.js";

export async function handleIngest(req, res) {
  try {
    const { text, query } = req.body;

    // Validate
    if (!text || typeof text !== "string") {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid 'text' field in request body.",
      });
    }

    if (text.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: "Document too short. Please provide at least 50 characters.",
      });
    }

    console.log(`[STRATOS] Ingesting document — ${text.length} chars`);

    const result = await ingestDocument({ text, query });

    console.log(
      `[STRATOS] Done — ${result.document_stats.total_chunks} chunks, ${result.evidence_chunks.length} evidence segments`
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[STRATOS] Ingestion error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}