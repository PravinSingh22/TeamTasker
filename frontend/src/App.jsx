import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './features/auth/authSlice';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectsPage from './pages/Projects';
import TasksPage from './pages/Tasks';
import NotificationsPage from './pages/Notifications';
import AnalyticsPage from './pages/Analytics';
import Header from './components/Header';

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((s) => s.auth.token);

  const onLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
  };

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<div style={{ padding:16 }}>Welcome to TeamTasker</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/projects" element={
          <ProtectedRoute><ProjectsPage /></ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute><NotificationsPage /></ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute><AnalyticsPage /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

