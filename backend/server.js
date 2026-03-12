import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import eventsRoutes from './routes/events.routes.js';
import risksRoutes from './routes/risks.routes.js';
import assistantRoutes from './routes/assistant.routes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'STRATOS Backend',
    flows: ['Flow2-Events', 'Flow4-Risks', 'Flow6-Assistant'],
    timestamp: new Date().toISOString()
  });
});

app.use('/api/events', eventsRoutes);
app.use('/api/risks', risksRoutes);
app.use('/api/assistant', assistantRoutes);

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    flow: err.flow || 'unknown'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`STRATOS backend running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
});