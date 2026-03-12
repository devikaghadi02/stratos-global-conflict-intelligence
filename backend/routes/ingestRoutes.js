import express from "express";
import { handleIngest } from "../controllers/ingestioncontroller.js";

const router = express.Router();

// POST /api/ingest
router.post("/", handleIngest);

export default router;