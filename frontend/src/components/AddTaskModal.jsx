import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactDOM from 'react-dom';
import { createTask } from '../features/tasks/tasksSlice';

export default function AddTaskModal({ projectId, open, onClose }) {
  const dispatch = useDispatch();
  const users = useSelector((s) => s.users?.items || []);
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium', assigneeId: '', dueDate: '' });
  if (!open) return null;
  const submit = () => {
    if (!form.title) return;
    dispatch(createTask({ projectId, ...form, assigneeId: form.assigneeId || null }));
    onClose?.();
    setForm({ title: '', description: '', status: 'todo', priority: 'medium', assigneeId: '', dueDate: '' });
  };
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0, color: 'var(--fg)' }}>Create Task</h3>
        <div className="modal-body">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="modal-grid-2">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}>
              <option value="">Unassigned</option>
              {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
            </select>
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Create</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
