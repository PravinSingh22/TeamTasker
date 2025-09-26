import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const fetchUsers = createAsyncThunk('users/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/users');
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Failed to load users' });
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchUsers.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || 'Error'; })
      .addCase(fetchUsers.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
  }
});

export default usersSlice.reducer;

