import { analyzeImpact } from "../services/impactservice.js";

export async function handleImpact(req, res) {
  try {
    const { evidenceChunks, signals } = req.body;

    // Validate
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

    console.log(`[STRATOS] Analyzing impact — ${evidenceChunks.length} evidence chunks`);

    const result = await analyzeImpact({ evidenceChunks, signals });

    console.log(`[STRATOS] Impact analysis done — overall severity: ${result.overall_severity}`);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[STRATOS] Impact analysis error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}