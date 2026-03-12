export function parseLLMJson(text) {
  if (!text || typeof text !== 'string') throw new Error('Input must be a non-empty string');

  try { return JSON.parse(text.trim()); } catch (_) {}

  const jsonBlock = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonBlock) { try { return JSON.parse(jsonBlock[1].trim()); } catch (_) {} }

  const plainBlock = text.match(/```\s*([\s\S]*?)\s*```/);
  if (plainBlock) { try { return JSON.parse(plainBlock[1].trim()); } catch (_) {} }

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try { return JSON.parse(text.slice(firstBrace, lastBrace + 1)); } catch (_) {}
  }

  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    try { return JSON.parse(text.slice(firstBracket, lastBracket + 1)); } catch (_) {}
  }

  console.error('[jsonParser] Failed to parse:', text.slice(0, 500));
  throw new Error('Could not extract valid JSON from LLM response');
}

export function parseLLMJsonSafe(text, fallback = null) {
  try { return parseLLMJson(text); } catch (err) {
    console.warn('[jsonParser] Using fallback:', err.message);
    return fallback;
  }
}