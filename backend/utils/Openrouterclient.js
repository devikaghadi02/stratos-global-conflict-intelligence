import fetch from "node-fetch";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Free models in order of preference — fallback if one fails
const FREE_MODELS = [
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "google/gemma-3-12b-it:free",
];
let orKeyIndex = 0;

function getOpenRouterKey() {
  const keys = [
    process.env.OPENROUTER_API_KEY,
    process.env.OPENROUTER_API_KEY_2,
  ].filter(Boolean);
  const key = keys[orKeyIndex % keys.length];
  orKeyIndex++;
  return key;
}

export async function callOpenRouter(prompt, options = {}, retries = 3) {
  const apiKey = getOpenRouterKey();
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set in .env");
  const model = options.model || FREE_MODELS[0];

  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`[STRATOS] OpenRouter attempt ${attempt}/${retries} — model: ${model}`);

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
        console.log(`[STRATOS] Rate limited. Waiting 5s...`);
        await new Promise((r) => setTimeout(r, 5000));
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
      if (attempt === retries) throw err;
      console.log(`[STRATOS] Attempt ${attempt} failed: ${err.message}. Retrying...`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  throw new Error("OpenRouter failed after all retries.");
}

export function parseJSON(rawText) {
  let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error(`No JSON found: ${cleaned.slice(0, 200)}`);
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch (e) {
    throw new Error(`Failed to parse JSON: ${cleaned.slice(start, start + 200)}`);
  }
}