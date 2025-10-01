import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markRead, deleteNotification, clearAllNotifications } from '../features/notifications/notificationsSlice';

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.notifications || { items: [] });
  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  return (
    <div style={{ maxWidth: 860, margin: '24px auto', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Notifications</h2>
        {items.length > 0 && (
          <button className="btn btn-danger" onClick={() => dispatch(clearAllNotifications())}>Clear All</button>
        )}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 10 }}>
        {items.map((n) => (
          <li key={n._id} className="neo-card" style={{ padding: 12, display: 'grid', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>{n.data?.title || n.type}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {!n.read && <button className="btn btn-sm btn-ghost" onClick={() => dispatch(markRead(n._id))}>Mark read</button>}
                <button className="btn btn-sm btn-danger" onClick={() => dispatch(deleteNotification(n._id))}>Delete</button>
              </div>
            </div>
            {n.data?.message && <div style={{ fontSize: 13, opacity: .85 }}>{n.data.message}</div>}
            <div style={{ fontSize: 12, opacity: .7 }}>{new Date(n.createdAt).toLocaleString()}</div>
          </li>
        ))}
        {items.length === 0 && <div style={{ opacity: .7 }}>No notifications</div>}
      </ul>
    </div>
  );
}

