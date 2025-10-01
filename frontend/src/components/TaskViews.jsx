import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import AddTaskModal from './AddTaskModal';
import { updateTask, createTask } from '../features/tasks/tasksSlice';

export default function TaskViews({ projectId }) {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.tasks || { items: [] });
  const users = useSelector((s) => s.users?.items || []);
  const [view, setView] = useState(() => {
    try { return localStorage.getItem('tt_view') || 'list'; } catch (e) { return 'list'; }
  });
  const [openTask, setOpenTask] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState('');

  const byId = useMemo(() => Object.fromEntries(users.map((u) => [u._id, u])), [users]);
  const filtered = useMemo(() => items.filter((t) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [t.title, t.description].some((v) => (v || '').toLowerCase().includes(q));
  }), [items, query]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    const statusMap = { todo: 'todo', in_progress: 'in_progress', review: 'in_progress', done: 'done' };
    dispatch(updateTask({ id: draggableId, updates: { status: statusMap[destination.droppableId] || destination.droppableId } }));
  };

  const addQuickTask = () => setAddOpen(true);

  const sections = [
    { key: 'todo', title: 'Todo' },
    { key: 'in_progress', title: 'In Progress' },
    { key: 'done', title: 'Done' },
  ];

  const columnIcons = {
    todo: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
    ),
    in_progress: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
      </svg>
    ),
    done: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="segmented">
          <button onClick={() => { setView('list'); try { localStorage.setItem('tt_view', 'list'); } catch (e) {} }} aria-pressed={view==='list'}>List View</button>
          <button onClick={() => { setView('kanban'); try { localStorage.setItem('tt_view', 'kanban'); } catch (e) {} }} aria-pressed={view==='kanban'}>Kanban Board</button>
        </div>
        <button className="btn btn-primary" onClick={addQuickTask} style={{ position: 'relative' }}>+ Task</button>
      </div>
      <div style={{ marginBottom: 8 }}>
        <input placeholder="Search tasks..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {view === 'list' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 12 }}>
          {filtered.map((t) => (
            <TaskCard key={t._id} task={t} assignee={byId[t.assignee]} onClick={() => setOpenTask(t)} />
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {sections.map((col) => {
              const tasksInSection = filtered.filter((t) => t.status === col.key);
              return (
                <Droppable key={col.key} droppableId={col.key}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} style={{
                    }} className="kanban-column">
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>{col.title}</div>
                      {tasksInSection.length > 0 ? (
                        tasksInSection.map((t, idx) => (
                          <Draggable key={t._id} draggableId={t._id} index={idx}>
                            {(pp) => (
                              <div ref={pp.innerRef} {...pp.draggableProps} {...pp.dragHandleProps} style={{ marginBottom: 10, ...pp.draggableProps.style }}>
                                <TaskCard task={t} assignee={byId[t.assignee]} onClick={() => setOpenTask(t)} />
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <div className="kanban-empty">
                          {columnIcons[col.key]}
                          <span style={{ marginTop: 8, fontSize: 12 }}>No tasks</span>
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {openTask && <TaskModal task={openTask} open={!!openTask} onClose={() => setOpenTask(null)} />}
      <AddTaskModal projectId={projectId} open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
