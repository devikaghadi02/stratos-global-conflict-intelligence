import { runFullAnalysis } from "../services/analyzeservice.js";

export async function handleAnalyze(req, res) {
  try {
    const { text, query } = req.body;

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

    console.log(`[STRATOS] Full analysis triggered — ${text.length} chars`);

    const result = await runFullAnalysis({ text, query });

    console.log(
      `[STRATOS] Pipeline complete — Flow1: ${result.pipeline_status.flow1} | Flow2: ${result.pipeline_status.flow2} | Flow3: ${result.pipeline_status.flow3}`
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[STRATOS] Full analysis error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}