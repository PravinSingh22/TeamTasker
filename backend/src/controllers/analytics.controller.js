import { Task } from '../models/Task.js';
import { ActivityLog } from '../models/ActivityLog.js';

export async function taskStatusCounts(req, res) {
  const pipeline = [
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $project: { _id: 0, status: '$_id', count: 1 } },
  ];
  const data = await Task.aggregate(pipeline);
  return res.status(200).json(data);
}

export async function dailyTaskCreation(req, res) {
  const pipeline = [
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $project: { _id: 0, day: '$_id', count: 1 } },
    { $sort: { day: 1 } },
  ];
  const data = await Task.aggregate(pipeline);
  return res.status(200).json(data);
}

export async function topUsers(req, res) {
  // Top users by tasks completed (status done)
  const pipeline = [
    { $match: { status: 'done', assignee: { $ne: null } } },
    { $group: { _id: '$assignee', completed: { $sum: 1 } } },
    { $sort: { completed: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'assigneeInfo',
      },
    },
    { $unwind: '$assigneeInfo' },
    { $project: { _id: 0, name: '$assigneeInfo.name', completed: 1 } },
  ];
  const data = await Task.aggregate(pipeline);
  return res.status(200).json(data);
}
