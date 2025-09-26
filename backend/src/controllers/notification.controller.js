import { Notification } from '../models/Notification.js';

export async function listNotifications(req, res) {
  const items = await Notification.find({ user: req.user?.id }).sort({ createdAt: -1 });
  return res.status(200).json(items);
}

export async function markNotificationRead(req, res) {
  const item = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user?.id },
    { $set: { read: true } },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Not found' });
  return res.status(200).json(item);
}

