import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = Router();
router.use(requireAuth);
router.get('/', async (req, res) => {
  const users = await User.find({}, { name: 1, email: 1 }).sort({ name: 1 });
  res.status(200).json(users);
});

export default router;

