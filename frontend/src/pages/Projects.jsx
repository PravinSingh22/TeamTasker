import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../features/users/usersSlice';
import { fetchTasks } from '../features/tasks/tasksSlice';
import ProjectSidebar from '../components/ProjectSidebar';
import TaskViews from '../components/TaskViews';
import RightAnalyticsPanel from '../components/RightAnalyticsPanel';

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 360px', gap: 0 }}>
      <ProjectSidebar selectedId={selectedProject?._id} onSelect={(p) => { setSelectedProject(p); dispatch(fetchTasks(p._id)); }} />
      <main style={{ padding: 16 }}>
        {selectedProject ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <h2 style={{ marginTop: 0 }}>{selectedProject.title}</h2>
            <TaskViews projectId={selectedProject._id} />
          </div>
        ) : (
          <div style={{ height: 'calc(100vh - 60px)', display: 'grid', placeItems: 'center', color: 'var(--fg)' }}>
            <div>Select a project to view tasks</div>
          </div>
        )}
      </main>
      <RightAnalyticsPanel />
    </div>
  );
}

