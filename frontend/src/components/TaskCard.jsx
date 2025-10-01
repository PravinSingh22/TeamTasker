import { memo } from 'react';
import { motion } from 'framer-motion';

const priorityColor = (p) => ({
  low: '#3b82f6',
  medium: '#f59e0b',
  high: '#ef4444'
}[p] || '#64748b');

export default memo(function TaskCard({ task, assignee, onClick }) {
  return (
    <motion.div whileHover={{ y: -2, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} onClick={onClick} className="task-card">
      <div className="task-card-header">
        <div className="task-card-title">{task.title}</div>
        <span className="task-card-priority" style={{ background: priorityColor(task.priority) }}>
          {task.priority}
        </span>
      </div>
      {task.description && (
        <div className="task-card-desc">{task.description}</div>
      )}
      <div className="task-card-footer">
        <div>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</div>
        <div title={assignee?.name || 'Unassigned'} className="task-card-assignee">
          <div className="task-card-avatar">
            {(assignee?.name || 'U').slice(0,1).toUpperCase()}
          </div>
          <span>{assignee?.name || 'Unassigned'}</span>
        </div>
      </div>
    </motion.div>
  );
});
