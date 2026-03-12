import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ingestRoutes from "./routes/ingestRoutes.js";
import impactRoutes from "./routes/impactRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import riskRoutes from "./routes/riskRoutes.js";
import analyzeRoutes from "./routes/analyzeRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    platform: "STRATOS",
    flows_active: ["ingest", "events", "impact", "risks", "analyze"],
    timestamp: new Date().toISOString(),
  });
});

// Individual flow routes
app.use("/api/ingest", ingestRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/impact", impactRoutes);
app.use("/api/risks", riskRoutes);

// Combined pipeline route — runs all flows
app.use("/api/analyze", analyzeRoutes);

// Start
app.listen(PORT, () => {
  console.log(`\n STRATOS Backend running on http://localhost:${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health\n`);
});