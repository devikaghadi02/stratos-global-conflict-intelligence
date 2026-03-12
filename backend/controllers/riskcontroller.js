import { forecastRisks } from "../services/riskservice.js";

export async function handleRisks(req, res) {
  try {
    const { impactData, evidenceChunks, signals } = req.body;

    if (!impactData || !impactData.impacts) {
      return res.status(400).json({
        success: false,
        error: "Missing 'impactData' in request body. Run impact analysis first.",
      });
    }

    if (impactData.impacts.length === 0) {
      return res.status(400).json({
        success: false,
        error: "impactData.impacts array is empty.",
      });
    }

    console.log(`[STRATOS] Risk forecasting — ${impactData.impacts.length} impact systems`);

    const result = await forecastRisks({ impactData, evidenceChunks, signals });

    console.log(`[STRATOS] Risk forecast done — ${result.risk_count} risks, level: ${result.risk_level}`);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[STRATOS] Risk forecast error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}