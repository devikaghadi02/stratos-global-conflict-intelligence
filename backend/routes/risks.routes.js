import { Router } from 'express';
import { getRiskForecast } from '../controllers/risks.controller.js';

const router = Router();
router.post('/', getRiskForecast);
export default router;