import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectsReducer from '../features/projects/projectsSlice';
import tasksReducer from '../features/tasks/tasksSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    notifications: notificationsReducer,
    analytics: analyticsReducer,
    users: usersReducer,
  },
});

