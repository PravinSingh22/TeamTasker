import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactDOM from 'react-dom';
import { updateTask, deleteTask, addComment } from "../features/tasks/tasksSlice";

export default function TaskModal({ task, open, onClose }) {
  const dispatch = useDispatch();
  const users = useSelector((s) => s.users?.items || []);
  const authUser = useSelector((s) => s.auth.user); // ✅ get logged-in user
  const tasks = useSelector((s) => s.tasks.items); // ✅ get latest tasks
  const liveTask = tasks.find((t) => t._id === task?._id); // ✅ always updated from Redux

  const [local, setLocal] = useState(task);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    setLocal(task);
  }, [task]);

  if (!open || !task) return null;

  const handleSave = () => {
    dispatch(
      updateTask({
        id: task._id,
        updates: {
          title: local.title,
          description: local.description,
          status: local.status,
          priority: local.priority,
          assigneeId: local.assignee || null,
          dueDate: local.dueDate || null,
        },
      })
    );
    onClose?.();
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    dispatch(addComment({ id: task._id, text: commentText }));

    setCommentText("");
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Task Details</h3>
        </div>

        {/* Task editing */}
        <div className="modal-body">
          <input
            value={local?.title || ""}
            placeholder="Title"
            onChange={(e) => setLocal({ ...local, title: e.target.value })}
          />
          <textarea
            rows={4}
            value={local?.description || ""}
            placeholder="Description"
            onChange={(e) => setLocal({ ...local, description: e.target.value })}
          />
          <div className="modal-grid-2">
            <select
              value={local?.status || "todo"}
              onChange={(e) => setLocal({ ...local, status: e.target.value })}
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select
              value={local?.priority || "medium"}
              onChange={(e) => setLocal({ ...local, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={local?.assignee || ""}
              onChange={(e) => setLocal({ ...local, assignee: e.target.value })}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={
                local?.dueDate
                  ? new Date(local.dueDate).toISOString().slice(0, 10)
                  : ""
              }
              onChange={(e) => setLocal({ ...local, dueDate: e.target.value })}
            />
          </div>
        </div>

        {/* ✅ Comments Section */}
        <div className="task-modal-comments-section">
          <h4>Comments</h4>
          <div className="task-modal-comments-container">
            {Array.isArray(liveTask?.comments) && liveTask.comments.length > 0 ? (
              liveTask.comments.map((c, i) => (
                <div
                  key={i}
                  className="comment-bubble"
                  style={{ // Keep margin for spacing
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontSize: 14, color: "var(--fg)" }}>
                    <strong>{c.author?.name || "Unknown"}</strong>: {c.text}
                  </div>
                  {c.createdAt && (
                    <div className="comment-bubble-meta">
                      {new Date(c.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ color: "var(--muted)" }}>No comments yet</div>
            )}
          </div>

          {/* Add new comment */}
          <div className="comment-add-form">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
            />
            <button className="btn btn-primary btn-sm" onClick={handleAddComment}>Add</button>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-actions" style={{ marginTop: 20 }}>
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <button // This will be replaced with a confirmation modal
            className="btn btn-danger"
            onClick={() => {
              if (confirm("Delete this task?")) {
                dispatch(deleteTask(task._id));
                onClose();
              }
            }}
          >
            Delete
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
