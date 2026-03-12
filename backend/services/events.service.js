import { callGemini } from '../utils/geminiClient.js';
import { parseLLMJson } from '../utils/jsonParser.js';
import { buildEventExtractionPrompt } from '../utils/promptBuilder.js';

export async function extractEventsAndNarratives(documentText, evidenceChunks, signals) {
  if (!documentText?.trim()) throw new Error('documentText is required');
  if (!Array.isArray(evidenceChunks)) throw new Error('evidenceChunks must be an array');

  console.log(`[Flow2] Processing ${documentText.length} chars, ${evidenceChunks.length} chunks`);

  const prompt = buildEventExtractionPrompt(documentText, evidenceChunks, signals || []);
  const rawResponse = await callGemini(prompt, { temperature: 0.2, maxTokens: 4096 });

  let parsed;
  try { parsed = parseLLMJson(rawResponse); }
  catch (e) { throw new Error(`JSON parse failed in Flow2: ${e.message}`); }

  parsed.events = parsed.events || [];
  parsed.narratives = parsed.narratives || [];
  parsed.summary = parsed.summary || {
    total_events: parsed.events.length,
    threat_level: 'UNKNOWN',
    key_actors: [],
    dominant_signal: signals?.[0] || 'GENERAL'
  };
  parsed.metadata = {
    flow: 'Flow2-EventExtraction',
    input_document_length: documentText.length,
    evidence_chunks_used: evidenceChunks.length,
    signals_applied: signals || [],
    processed_at: new Date().toISOString()
  };

  console.log(`[Flow2] Extracted ${parsed.events.length} events, ${parsed.narratives.length} narratives`);
  return parsed;
}