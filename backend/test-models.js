import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const modelsToTest = [
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash"
];

async function testModels() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("No API key");
    return;
  }

  for (const model of modelsToTest) {
    console.log(`\nTesting model: ${model}`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
      }),
    });

    console.log(`Status: ${response.status}`);
    if (!response.ok) {
      const err = await response.text();
      console.log(`Error: ${err}`);
    } else {
      console.log("Success!");
    }
  }
}

testModels();
