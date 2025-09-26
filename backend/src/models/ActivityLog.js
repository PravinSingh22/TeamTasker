import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    action: { type: String, required: true },
    entityType: { type: String, enum: ['project', 'task', 'user'], required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: false },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

