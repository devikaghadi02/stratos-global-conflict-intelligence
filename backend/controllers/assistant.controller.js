import { processAssistantQuery } from '../services/assistant.service.js';

export async function chat(req, res, next) {
  try {
    const { question, context } = req.body;
    if (!question?.trim()) return res.status(400).json({ error: 'question is required' });
    if (!context || !Array.isArray(context.evidenceChunks)) {
      return res.status(400).json({ error: 'context.evidenceChunks array required' });
    }

    const result = await processAssistantQuery(question, context);
    res.status(200).json({ success: true, flow: 'Flow6-GeopoliticalAssistant', question, data: result });
  } catch (error) {
    error.flow = 'Flow6';
    next(error);
  }
}