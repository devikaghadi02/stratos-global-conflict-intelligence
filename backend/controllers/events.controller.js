import { extractEventsAndNarratives } from '../services/events.service.js';

export async function extractEvents(req, res, next) {
  try {
    const { documentText, chunks, signals } = req.body;
    if (!documentText) return res.status(400).json({ error: 'documentText is required' });
    if (!Array.isArray(chunks)) return res.status(400).json({ error: 'chunks must be an array' });

    const result = await extractEventsAndNarratives(documentText, chunks, signals);
    res.status(200).json({ success: true, flow: 'Flow2-EventExtraction', data: result });
  } catch (error) {
    error.flow = 'Flow2';
    next(error);
  }
}