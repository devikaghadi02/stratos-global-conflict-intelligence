import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
import { callAI, parseAIJson } from "./backend/utils/aiClient.js";

async function testAI() {
  console.log("Testing Unified AI Client integration (Gemini + OpenRouter)...");
  try {
    const raw = await callAI("Respond ONLY with: {\"status\": \"SUCCESS\"}", { temperature: 0.1 });
    console.log("Raw Response:", raw);
    const parsed = parseAIJson(raw);
    console.log("Parsed Status:", parsed.status);
    if (parsed.status === "SUCCESS") {
      console.log("✅ AI System is properly integrated and translating!");
    }
  } catch (err) {
    console.error("❌ AI System Test Failed:", err.message);
  }
}

testAI();
