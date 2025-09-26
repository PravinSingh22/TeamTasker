import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const signup = createAsyncThunk('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/auth/signup', payload);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Signup failed' });
  }
});

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/auth/login', payload);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Login failed' });
  }
});

const initialState = {
  token: localStorage.getItem('tt_token'),
  user: JSON.parse(localStorage.getItem('tt_user') || 'null'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('tt_token');
      localStorage.removeItem('tt_user');
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const setPending = (state) => { state.loading = true; state.error = null; };
    const setRejected = (state, action) => { state.loading = false; state.error = action.payload?.message || 'Error'; };
    const setFulfilled = (state, action) => {
      state.loading = false;
      state.error = null;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('tt_token', action.payload.token);
      localStorage.setItem('tt_user', JSON.stringify(action.payload.user));
    };
    builder
      .addCase(signup.pending, setPending)
      .addCase(signup.rejected, setRejected)
      .addCase(signup.fulfilled, setFulfilled)
      .addCase(login.pending, setPending)
      .addCase(login.rejected, setRejected)
      .addCase(login.fulfilled, setFulfilled);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

