import express from "express";
import { handleNarrativeCheck } from "../controllers/narrativecontroller.js";

const router = express.Router();

// POST /api/narratives/check
router.post("/check", handleNarrativeCheck);

export default router;