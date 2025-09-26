import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/projects');
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Failed to load projects' });
  }
});

export const createProject = createAsyncThunk('projects/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/projects', payload);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Failed to create project' });
  }
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/api/projects/${id}`, updates);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Failed to update project' });
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/projects/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Failed to delete project' });
  }
});

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProjects.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || 'Error'; })
      .addCase(fetchProjects.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })

      .addCase(createProject.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createProject.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || 'Error'; })
      .addCase(createProject.fulfilled, (s, a) => { s.loading = false; s.items.unshift(a.payload); })

      .addCase(updateProject.fulfilled, (s, a) => {
        const idx = s.items.findIndex((p) => p._id === a.payload._id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deleteProject.fulfilled, (s, a) => {
        s.items = s.items.filter((p) => p._id !== a.payload);
      });
  },
});

export default projectsSlice.reducer;

