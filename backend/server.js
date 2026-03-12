import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ingestRoutes from "./routes/ingestRoutes.js";
import impactRoutes from "./routes/impactRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import riskRoutes from "./routes/riskRoutes.js";
import narrativeRoutes from "./routes/narrativeRoutes.js";
import analyzeRoutes from "./routes/analyzeRoutes.js";
import assistantRoutes from "./routes/assistant.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    platform: "STRATOS",
    flows_active: ["ingest", "events", "impact", "risks", "narratives", "analyze", "assistant"],
    timestamp: new Date().toISOString(),
  });
});

// Individual flow routes
app.use("/api/ingest", ingestRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/impact", impactRoutes);
app.use("/api/risks", riskRoutes);
app.use("/api/narratives", narrativeRoutes);
app.use("/api/assistant", assistantRoutes);

// Combined pipeline — runs all flows
app.use("/api/analyze", analyzeRoutes);

// Error handler for next(error) pattern
app.use((err, req, res, next) => {
  console.error(`[STRATOS] Error in ${err.flow || "unknown"} flow:`, err.message);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`\n STRATOS Backend running on http://localhost:${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health\n`);
});