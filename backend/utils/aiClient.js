import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";

// Configuration
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const FREE_MODELS = [
  "google/gemma-3-12b-it:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "qwen/qwen-2-7b-instruct:free"
];

let geminiKeyIndex = 0;
let openRouterKeyIndex = 0;

function getGeminiKeys() {
  return [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].filter(Boolean);
}

function getOpenRouterKeys() {
  return [
    process.env.OPENROUTER_API_KEY,
    process.env.OPENROUTER_API_KEY_2,
  ].filter(Boolean);
}

/**
 * Robust AI Call that tries Gemini first (if keys exist) 
 * and falls back to OpenRouter if Gemini fails or keys are missing.
 */
export async function callAI(prompt, options = {}, retries = 2) {
  const geminiKeys = getGeminiKeys();
  const orKeys = getOpenRouterKeys();

  // Try ALL Gemini keys first one by one
  for (let i = 0; i < geminiKeys.length; i++) {
    try {
      console.log(`[STRATOS-AI] Trying Gemini key ${i + 1}/${geminiKeys.length}...`);
      return await callGeminiDirect(prompt, geminiKeys[i], options);
    } catch (err) {
      console.warn(`[STRATOS-AI] Gemini key ${i + 1} failed: ${err.message.slice(0, 80)}`);
    }
  }

  // Only fall back to OpenRouter if ALL Gemini keys fail
  if (orKeys.length > 0) {
    console.log(`[STRATOS-AI] All Gemini keys failed. Trying OpenRouter...`);
    const key = orKeys[openRouterKeyIndex % orKeys.length];
    openRouterKeyIndex++;
    return await callOpenRouterDirect(prompt, key, options, retries);
  }

  throw new Error("All AI API keys exhausted.");
}

async function callGeminiDirect(prompt, apiKey, options) {
  const url = `${GEMINI_URL}?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options.temperature || 0.3,
        maxOutputTokens: options.maxTokens || 4096,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini error ${response.status}: ${err.slice(0, 200)}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned empty response");
  return text;
}

async function callOpenRouterDirect(prompt, apiKey, options, retries) {
  const model = options.model || FREE_MODELS[0];
  
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "STRATOS",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: options.maxTokens || 4096,
          temperature: options.temperature || 0.2,
        }),
      });

      if (response.status === 429) {
        console.log(`[STRATOS-AI] OpenRouter rate limited. Waiting 10s...`);
        await new Promise(r => setTimeout(r, 10000));
        continue;
      }

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenRouter error ${response.status}: ${err.slice(0, 200)}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error("OpenRouter returned empty response");
      return text;
    } catch (err) {
      if (attempt > retries) throw err;
      console.log(`[STRATOS-AI] OpenRouter attempt ${attempt} failed: ${err.message}. Retrying...`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

// Utility for cleaning JSON from LLM responses
export function parseAIJson(rawText) {
  let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error(`No JSON object found in response`);
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch (e) {
    throw new Error(`Failed to parse AI JSON: ${e.message}`);
  }
}
