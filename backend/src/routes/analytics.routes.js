import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { taskStatusCounts, dailyTaskCreation, topUsers } from '../controllers/analytics.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/task-status-counts', taskStatusCounts);
router.get('/daily-task-creation', dailyTaskCreation);
router.get('/top-users', topUsers);

export default router;

