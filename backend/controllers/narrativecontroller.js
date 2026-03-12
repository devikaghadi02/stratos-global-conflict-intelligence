import { checkNarratives } from "../services/narrativeservice.js";

export async function handleNarrativeCheck(req, res) {
  try {
    const { narratives, evidenceChunks } = req.body;

    if (!narratives || !Array.isArray(narratives)) {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid 'narratives' array in request body.",
      });
    }

    if (narratives.length === 0) {
      return res.status(400).json({
        success: false,
        error: "narratives array is empty. Run event extraction first.",
      });
    }

    if (!evidenceChunks || !Array.isArray(evidenceChunks) || evidenceChunks.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Missing or empty 'evidenceChunks' array in request body.",
      });
    }

    console.log(
      `[STRATOS] Narrative check — ${narratives.length} narratives, ${evidenceChunks.length} evidence chunks`
    );

    const result = await checkNarratives({ narratives, evidenceChunks });

    console.log(
      `[STRATOS] Narrative check done — integrity: ${result.overall_narrative_integrity}`
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[STRATOS] Narrative check error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}