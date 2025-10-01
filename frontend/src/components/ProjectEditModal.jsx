import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ReactDOM from 'react-dom';
import { updateProject } from '../features/projects/projectsSlice';

export default function ProjectEditModal({ project, open, onClose }) {
  const dispatch = useDispatch();
  const [local, setLocal] = useState({ title: '', description: '' });

  useEffect(() => {
    if (project) setLocal({ title: project.title || '', description: project.description || '' });
  }, [project]);

  if (!open || !project) return null;

  const save = () => {
    dispatch(updateProject({ id: project._id, updates: { title: local.title, description: local.description } }));
    onClose?.();
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 60 }}>
      <div onClick={(e) => e.stopPropagation()} className="modal-panel modal-content">
        <div className="modal-header">
          <h3>Edit Project</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body" style={{ marginTop: 12 }}>
          <input placeholder="Title" value={local.title} onChange={(e) => setLocal({ ...local, title: e.target.value })} />
          <input placeholder="Description" value={local.description} onChange={(e) => setLocal({ ...local, description: e.target.value })} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Save</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
