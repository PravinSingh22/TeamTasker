import { Task } from '../models/Task.js';
import { Notification } from '../models/Notification.js';
import { ActivityLog } from '../models/ActivityLog.js';

export async function createTask(req, res) {
  const { projectId, title, description, status, priority, assigneeId, dueDate } = req.body;
  if (!projectId || !title) return res.status(400).json({ message: 'projectId and title are required' });
  const task = await Task.create({
    project: projectId,
    title,
    description: description || '',
    status: status || 'todo',
    priority: priority || 'medium',
    assignee: assigneeId || null,
    dueDate: dueDate ? new Date(dueDate) : null,
  });
  await ActivityLog.create({ actor: req.user?.id, action: 'task_created', entityType: 'task', entityId: task._id });
  if (assigneeId) {
    await Notification.create({ user: assigneeId, type: 'task_assigned', data: { taskId: task._id, title: task.title } });
  }
  return res.status(201).json(task);
}

export async function listTasks(req, res) {
  const { projectId } = req.query;
  const filter = projectId ? { project: projectId } : {};
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  return res.status(200).json(tasks);
}

export async function getTask(req, res) {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Not found' });
  return res.status(200).json(task);
}

export async function updateTask(req, res) {
  const { title, description, status, priority, assigneeId, dueDate } = req.body;
  const prev = await Task.findById(req.params.id);
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(assigneeId !== undefined && { assignee: assigneeId || null }),
      },
    },
    { new: true }
  );
  if (!task) return res.status(404).json({ message: 'Not found' });
  await ActivityLog.create({ actor: req.user?.id, action: 'task_updated', entityType: 'task', entityId: task._id });
  if (assigneeId !== undefined && String(prev?.assignee || '') !== String(assigneeId || '')) {
    if (assigneeId) {
      await Notification.create({ user: assigneeId, type: 'task_assigned', data: { taskId: task._id, title: task.title } });
    }
  }
  return res.status(200).json(task);
}

export async function deleteTask(req, res) {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Not found' });
  await ActivityLog.create({ actor: req.user?.id, action: 'task_deleted', entityType: 'task', entityId: task._id });
  return res.status(204).send();
}

export async function addComment(req, res) {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'text is required' });

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Not found' });

  const comment = {
    author: req.user?.id,
    text,
  };

  task.comments.push(comment);
  await task.save();

  await task.populate('comments.author', 'id name email');

  await ActivityLog.create({ actor: req.user?.id, action: 'task_commented', entityType: 'task', entityId: task._id });
  return res.status(201).json(task);
}
