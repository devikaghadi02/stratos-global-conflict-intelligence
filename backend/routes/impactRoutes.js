import express from "express";
import { handleImpact } from "../controllers/impactcontroller.js";

const router = express.Router();

// POST /api/impact
router.post("/", handleImpact);

export default router;