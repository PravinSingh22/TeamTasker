import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listNotifications, markNotificationRead } from '../controllers/notification.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/', listNotifications);
router.post('/:id/read', markNotificationRead);

export default router;

