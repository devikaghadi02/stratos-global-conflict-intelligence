import { Router } from 'express';
import { extractEvents } from '../controllers/events.controller.js';

const router = Router();
router.post('/', extractEvents);
export default router;