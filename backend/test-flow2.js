import dotenv from "dotenv";
dotenv.config();
import { extractEvents } from "./services/eventservice.js";

async function run() {
  try {
    const evidenceChunks = [
      { text: "Russian forces advanced 5km in the eastern sector, cutting off main supply lines.", relevance: 0.95 },
      { text: "The US announced new sanctions targeting energy sector intermediaries in the UAE.", relevance: 0.88 }
    ];
    
    console.log("Starting flow 2 test...");
    const result = await extractEvents({ evidenceChunks, signals: [], geminiKey: process.env.GEMINI_API_KEY });
    console.log("Success:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Test failed:", err.message);
  }
}

run();
