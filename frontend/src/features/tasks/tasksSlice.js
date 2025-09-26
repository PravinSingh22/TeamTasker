import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const fetchTasks = createAsyncThunk('tasks/fetch', async (projectId, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/tasks', { params: { projectId } });
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Failed to load tasks' });
  }
});

export const createTask = createAsyncThunk('tasks/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/tasks', payload);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Failed to create task' });
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/api/tasks/${id}`, updates);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Failed to update task' });
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/tasks/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Failed to delete task' });
  }
});

export const addComment = createAsyncThunk('tasks/addComment', async ({ id, text }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/api/tasks/${id}/comments`, { text });
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Failed to add comment' });
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTasks.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || 'Error'; })
      .addCase(fetchTasks.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(createTask.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(updateTask.fulfilled, (s, a) => {
        const idx = s.items.findIndex((t) => t._id === a.payload._id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deleteTask.fulfilled, (s, a) => { s.items = s.items.filter((t) => t._id !== a.payload); })
      .addCase(addComment.fulfilled, (s, a) => {
        const idx = s.items.findIndex((t) => t._id === a.payload._id);
        if (idx !== -1) s.items[idx] = a.payload;
      });
  }
});

export default tasksSlice.reducer;

