import { Project } from '../models/Project.js';
import { ActivityLog } from '../models/ActivityLog.js';

export async function createProject(req, res) {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'title is required' });
  const project = await Project.create({ title, description: description || '', owner: req.user?.id });
  await ActivityLog.create({ actor: req.user?.id, action: 'project_created', entityType: 'project', entityId: project._id });
  return res.status(201).json(project);
}

export async function listProjects(req, res) {
  const projects = await Project.find({ owner: req.user?.id }).sort({ createdAt: -1 });
  return res.status(200).json(projects);
}

export async function getProject(req, res) {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user?.id });
  if (!project) return res.status(404).json({ message: 'Not found' });
  return res.status(200).json(project);
}

export async function updateProject(req, res) {
  const { title, description } = req.body;
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, owner: req.user?.id },
    { $set: { ...(title && { title }), ...(description !== undefined && { description }) } },
    { new: true }
  );
  if (!project) return res.status(404).json({ message: 'Not found' });
  await ActivityLog.create({ actor: req.user?.id, action: 'project_updated', entityType: 'project', entityId: project._id });
  return res.status(200).json(project);
}

export async function deleteProject(req, res) {
  const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user?.id });
  if (!project) return res.status(404).json({ message: 'Not found' });
  await ActivityLog.create({ actor: req.user?.id, action: 'project_deleted', entityType: 'project', entityId: project._id });
  return res.status(204).send();
}

