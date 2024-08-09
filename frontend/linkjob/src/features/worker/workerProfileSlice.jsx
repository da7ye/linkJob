// workerProfileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  worker: null,
  isLoading: false,
  isError: false,
  message: '',
};

export const fetchWorkerProfile = createAsyncThunk(
  'workerProfile/fetchWorkerProfile',
  async (_, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.access;
      const response = await axios.get('http://localhost:8000/api/worker-update/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateWorkerProfile = createAsyncThunk(
  'workerProfile/updateWorkerProfile',
  async (workerData, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.access;
      const response = await axios.put('http://localhost:8000/api/worker-update/', workerData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const workerProfileSlice = createSlice({
  name: 'workerProfile',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkerProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWorkerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.worker = action.payload;
      })
      .addCase(fetchWorkerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateWorkerProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateWorkerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.worker = action.payload;
      })
      .addCase(updateWorkerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = workerProfileSlice.actions;
export default workerProfileSlice.reducer;
