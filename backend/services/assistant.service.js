import { callAI, parseAIJson } from '../utils/aiClient.js';
import { buildAssistantPrompt } from '../utils/promptBuilder.js';

export async function processAssistantQuery(userQuestion, context) {
  if (!userQuestion?.trim()) throw new Error('userQuestion is required');

  const {
    evidenceChunks = [],
    events = [],
    impactMatrix = null,
    riskScenarios = [],
    conversationHistory = []
  } = context;

  console.log(`[Flow6] Query: "${userQuestion.slice(0, 80)}..."`);
  console.log(`[Flow6] Context: ${evidenceChunks.length} evidence, ${events.length} events, ${riskScenarios.length} risks`);

  let question = userQuestion;
  if (conversationHistory.length > 0) {
    const history = conversationHistory.map(t => `${t.role.toUpperCase()}: ${t.content}`).join('\n\n');
    question = `CONVERSATION HISTORY:\n${history}\n\nCURRENT QUESTION: ${userQuestion}`;
  }

  const prompt = buildAssistantPrompt(question, { evidenceChunks, events, impactMatrix, riskScenarios });
  const rawResponse = await callAI(prompt, { temperature: 0.4, maxTokens: 4096 });

  let parsed;
  try {
    parsed = parseAIJson(rawResponse);
  } catch (_) {
    console.warn('[Flow6] JSON parse failed, returning raw text');
    return {
      answer: rawResponse,
      reasoning_steps: ['Raw text response — JSON parsing failed'],
      evidence_citations: [],
      related_events: [],
      related_risks: [],
      confidence_level: 'LOW',
      confidence_score: 0.3,
      caveats: ['Structured parsing failed'],
      follow_up_questions: [],
      intelligence_gaps: [],
      metadata: { flow: 'Flow6-Assistant', parse_error: true, processed_at: new Date().toISOString() }
    };
  }

  parsed.answer = parsed.answer || 'No answer generated';
  parsed.reasoning_steps = parsed.reasoning_steps || [];
  parsed.evidence_citations = parsed.evidence_citations || [];
  parsed.confidence_level = parsed.confidence_level || 'MEDIUM';
  parsed.confidence_score = parsed.confidence_score || 0.5;
  parsed.follow_up_questions = parsed.follow_up_questions || [];
  parsed.intelligence_gaps = parsed.intelligence_gaps || [];
  parsed.metadata = {
    flow: 'Flow6-Assistant',
    question_length: userQuestion.length,
    context_evidence_count: evidenceChunks.length,
    context_events_count: events.length,
    context_risks_count: riskScenarios.length,
    processed_at: new Date().toISOString()
  };

  console.log(`[Flow6] Answer generated, confidence: ${parsed.confidence_score}`);
  return parsed;
}