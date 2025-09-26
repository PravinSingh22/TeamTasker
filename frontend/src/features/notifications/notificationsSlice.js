import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/notifications');
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Failed to load notifications' });
  }
});

export const markRead = createAsyncThunk('notifications/markRead', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/api/notifications/${id}/read`);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Failed to mark read' });
  }
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchNotifications.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || 'Error'; })
      .addCase(fetchNotifications.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(markRead.fulfilled, (s, a) => {
        const idx = s.items.findIndex((n) => n._id === a.payload._id);
        if (idx !== -1) s.items[idx] = a.payload;
      });
  }
});

export default notificationsSlice.reducer;

