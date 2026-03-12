import express from "express";
import { handleRisks } from "../controllers/riskcontroller.js";

const router = express.Router();

// POST /api/risks
router.post("/", handleRisks);

export default router;