import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject, deleteProject } from '../features/projects/projectsSlice';
import ProjectEditModal from './ProjectEditModal';
import ConfirmationModal from './ConfirmationModal';

export default function ProjectSidebar({ selectedId, onSelect }) {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.projects || { items: [] });
  const [form, setForm] = useState({ title: '', description: '' });
  const [editing, setEditing] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

  const handleDeleteConfirm = () => {
    if (deletingProject) {
      dispatch(deleteProject(deletingProject._id));
      setDeletingProject(null);
    }
  };

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  return (
    <aside className="sidebar project-sidebar">
      <div className="sidebar-header">
        <h3>Projects</h3>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (!form.title) return; dispatch(createProject(form)); setForm({ title: '', description: '' }); }} style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
        <input placeholder="New project title..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn btn-primary btn-sm" disabled={loading} type="submit">Create</button>
      </form>
      <div>
        {items.map((p) => (
          <div key={p._id} className={`project-item ${selectedId === p._id ? 'selected' : ''}`} onClick={() => onSelect?.(p)}>
            <div className="project-item-title">{p.title}</div>
            <div className="project-item-desc">{p.description}</div>
            <div className="project-item-actions" onClick={(e) => e.stopPropagation()}>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditing(p)}>
                Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => setDeletingProject(p)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <ProjectEditModal project={editing} open={!!editing} onClose={() => setEditing(null)} />
      <ConfirmationModal
        open={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
      >
        Are you sure you want to delete the project "<strong>{deletingProject?.title}</strong>"? All associated tasks will also be removed. This action cannot be undone.
      </ConfirmationModal>
    </aside>
  );
}
