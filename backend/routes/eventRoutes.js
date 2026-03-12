import express from "express";
import { handleEvents } from "../controllers/eventcontroller.js";

const router = express.Router();

// POST /api/events
router.post("/", handleEvents);

export default router;