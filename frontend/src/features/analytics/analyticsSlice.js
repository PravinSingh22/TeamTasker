import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const fetchTaskStatusCounts = createAsyncThunk('analytics/taskStatusCounts', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/analytics/task-status-counts');
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Failed to load task status counts' });
  }
});

export const fetchDailyTaskCreation = createAsyncThunk('analytics/dailyTaskCreation', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/analytics/daily-task-creation');
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Failed to load daily task creation' });
  }
});

export const fetchTopUsers = createAsyncThunk('analytics/topUsers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/analytics/top-users');
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Failed to load top users' });
  }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: { statusCounts: [], daily: [], topUsers: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskStatusCounts.fulfilled, (s, a) => { s.statusCounts = a.payload; })
      .addCase(fetchDailyTaskCreation.fulfilled, (s, a) => { s.daily = a.payload; })
      .addCase(fetchTopUsers.fulfilled, (s, a) => { s.topUsers = a.payload; });
  }
});

export default analyticsSlice.reducer;

