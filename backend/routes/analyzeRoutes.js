import express from "express";
import { handleAnalyze } from "../controllers/analyzecontroller.js";

const router = express.Router();

// POST /api/analyze — runs Flow 1 + Flow 2 + Flow 3 in one call
router.post("/", handleAnalyze);

export default router;