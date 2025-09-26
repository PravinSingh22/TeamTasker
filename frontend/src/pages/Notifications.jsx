import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markRead } from '../features/notifications/notificationsSlice';

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.notifications || { items: [] });
  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  return (
    <div style={{ maxWidth: 720, margin: '24px auto' }}>
      <h2>Notifications</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((n) => (
          <li key={n._id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
            <div>{n.type} - {n.data?.title || ''}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{n.read ? 'read' : 'unread'}</div>
            {!n.read && <button onClick={() => dispatch(markRead(n._id))}>Mark read</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}

