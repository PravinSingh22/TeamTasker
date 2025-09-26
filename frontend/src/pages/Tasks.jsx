import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask, addComment } from '../features/tasks/tasksSlice';
import { fetchUsers } from '../features/users/usersSlice';

export default function TasksPage({ projectId }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.tasks || { items: [] });
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'todo', assigneeId: '', dueDate: '' });
  const users = useSelector((s) => s.users?.items || []);

  useEffect(() => { if (projectId) dispatch(fetchTasks(projectId)); }, [dispatch, projectId]);
  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  return (
    <div style={{ maxWidth: 720, margin: '24px auto' }}>
      <h3>Tasks</h3>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      <form onSubmit={(e) => { e.preventDefault(); dispatch(createTask({ projectId, ...form, assigneeId: form.assigneeId || null })); setForm({ title: '', description: '', priority: 'medium', status: 'todo', assigneeId: '', dueDate: '' }); }} style={{ marginBottom: 16 }}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ marginRight: 8 }} />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ marginRight: 8, width: 200 }} />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ marginRight: 8 }}>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} style={{ marginRight: 8 }}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })} style={{ marginRight: 8 }}>
          <option value="">Unassigned</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>
        <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} style={{ marginRight: 8 }} />
        <button disabled={loading} type="submit">Add Task</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((t) => (
          <li key={t._id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
            <div style={{ fontWeight: 600 }}>{t.title}</div>
            <div style={{ fontSize: 13, color: '#666' }}>{t.description}</div>
            <div>Status: {t.status} | Priority: {t.priority} | Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</div>
            <div>Assignee: {users.find((u) => u._id === t.assignee)?.name || 'Unassigned'}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button onClick={() => {
                const nt = prompt('New title', t.title);
                if (nt !== null) dispatch(updateTask({ id: t._id, updates: { title: nt } }));
              }}>Edit</button>
              <button onClick={() => dispatch(deleteTask(t._id))}>Delete</button>
              <select value={t.status} onChange={(e) => dispatch(updateTask({ id: t._id, updates: { status: e.target.value } }))}>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <select value={t.priority} onChange={(e) => dispatch(updateTask({ id: t._id, updates: { priority: e.target.value } }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select value={t.assignee || ''} onChange={(e) => dispatch(updateTask({ id: t._id, updates: { assigneeId: e.target.value || null } }))}>
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
              <input type="date" value={t.dueDate ? new Date(t.dueDate).toISOString().slice(0,10) : ''} onChange={(e) => dispatch(updateTask({ id: t._id, updates: { dueDate: e.target.value || null } }))} />
              <button onClick={() => {
                const txt = prompt('Add comment');
                if (txt) dispatch(addComment({ id: t._id, text: txt }));
              }}>Comment</button>
            </div>
            {Array.isArray(t.comments) && t.comments.length > 0 && (
              <ul style={{ marginTop: 8, fontSize: 13 }}>
                {t.comments.map((c, i) => (
                  <li key={i}>- {c.text}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

