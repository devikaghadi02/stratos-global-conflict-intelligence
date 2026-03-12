import { forecastRisks } from '../services/risks.service.js';

export async function getRiskForecast(req, res, next) {
  try {
    const { events, impactMatrix, chunks } = req.body;
    if (!Array.isArray(events) || events.length === 0) return res.status(400).json({ error: 'events array required' });
    if (!Array.isArray(chunks)) return res.status(400).json({ error: 'chunks must be an array' });

    const result = await forecastRisks(events, impactMatrix || null, chunks);
    res.status(200).json({ success: true, flow: 'Flow4-RiskForecasting', data: result });
  } catch (error) {
    error.flow = 'Flow4';
    next(error);
  }
}