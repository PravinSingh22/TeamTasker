import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject, updateProject, deleteProject } from '../features/projects/projectsSlice';
import TasksPage from './Tasks';
import { fetchTasks } from '../features/tasks/tasksSlice';

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.projects || { items: [] });
  const [form, setForm] = useState({ title: '', description: '' });
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  return (
    <div style={{ maxWidth: 720, margin: '24px auto' }}>
      <h2>Projects</h2>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}

      <form onSubmit={(e) => { e.preventDefault(); dispatch(createProject(form)); setForm({ title: '', description: '' }); }} style={{ marginBottom: 16 }}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ marginRight: 8 }} />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ marginRight: 8, width: 300 }} />
        <button disabled={loading} type="submit">Create</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((p) => (
          <li key={p._id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
            <div style={{ fontWeight: 600 }}>{p.title}</div>
            <div style={{ fontSize: 13, color: '#666' }}>{p.description}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button onClick={() => { setSelectedProject(p); dispatch(fetchTasks(p._id)); }}>Open</button>
              <button onClick={() => {
                const nt = prompt('New title', p.title);
                const nd = prompt('New description', p.description || '');
                if (nt !== null && nd !== null) dispatch(updateProject({ id: p._id, updates: { title: nt, description: nd } }));
              }}>Edit</button>
              <button onClick={() => dispatch(deleteProject(p._id))}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {selectedProject && (
        <div style={{ marginTop: 24 }}>
          <h3>Tasks for: {selectedProject.title}</h3>
          <TasksPage projectId={selectedProject._id} />
        </div>
      )}
    </div>
  );
}

